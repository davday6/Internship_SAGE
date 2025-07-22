import { useState, useEffect, useMemo } from 'react'
import { flushSync } from 'react-dom'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Filters from './components/Filters'
import AgentCard from './components/AgentCard'
import AgentModal from './components/AgentModal'
import Pagination from './components/Pagination'
import ContactForm from './components/ContactForm'
import ChatWidget from './components/ChatWidget'
import ViewToggle from './components/ViewToggle'
import { fetchAgentsData, deriveBusinessCapabilities } from './data/agentData'
import { AgentService } from './services/agentService'
import type { Agent, FilterOptions, Review, BusinessCapabilities } from './types'

function App() {
  // State for agents and filtered agents
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [displayedAgents, setDisplayedAgents] = useState<Agent[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    l1Capability: 'all',
    l2Capability: 'all',
    trial: 'all',
    rating: 'all',
    sortBy: 'rating'
  })
  
  // State for modal
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  
  // State for view type (grid or list)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')

  // Derive business capabilities from agents data
  const businessCapabilities: BusinessCapabilities = useMemo(() => {
    return deriveBusinessCapabilities(agents);
  }, [agents]);

  // Fetch agents data on component mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true)
        setError(null)
        const agentsData = await fetchAgentsData()
        setAgents(agentsData)
      } catch (err) {
        setError('Failed to load agents. Please check if the backend server is running.')
        console.error('Error loading agents:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  // Helper function to apply filters and sorting to agents
  const applyFiltersAndSorting = (agentsToFilter: Agent[], query: string, currentFilters: FilterOptions) => {
    let result = [...agentsToFilter];
    
    // Apply search filter
    if (query) {
      const searchQuery = query.toLowerCase();
      result = result.filter(
        agent => 
          agent.title.toLowerCase().includes(searchQuery) ||
          agent.description.toLowerCase().includes(searchQuery) ||
          agent.domain.toLowerCase().includes(searchQuery) ||
          agent.subdomain.toLowerCase().includes(searchQuery)
      );
    }
    
    // Apply business capability filters
    if (currentFilters.l1Capability !== 'all') {
      result = result.filter(agent => agent.domain === currentFilters.l1Capability);
    }
    
    // Apply subcapability filter (regardless of L1 selection)
    if (currentFilters.l2Capability !== 'all') {
      result = result.filter(agent => agent.subdomain === currentFilters.l2Capability);
    }
    
    // Apply trial filter
    if (currentFilters.trial !== 'all') {
      const hasTrialUrl = currentFilters.trial === 'true';
      result = result.filter(agent => Boolean(agent.trialUrl) === hasTrialUrl);
    }
    
    // Apply rating filter
    if (currentFilters.rating !== 'all') {
      const minRating = parseFloat(currentFilters.rating);
      result = result.filter(agent => (agent.rating || 0) >= minRating);
    }
    
    // Apply sorting
    switch (currentFilters.sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'comments':
        result.sort((a, b) => (b.comments || 0) - (a.comments || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    return result;
  };
  
  // Filter agents based on search query and filters
  useEffect(() => {
    const result = applyFiltersAndSorting(agents, searchQuery, filters);
    setFilteredAgents(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [agents, searchQuery, filters]);
  
  // Update displayed agents based on current page
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setDisplayedAgents(filteredAgents.slice(indexOfFirstItem, indexOfLastItem));
  }, [filteredAgents, currentPage, itemsPerPage]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAgents.length / itemsPerPage);
  }, [filteredAgents, itemsPerPage]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to agents section when search is performed
    setTimeout(() => {
      document.querySelector('.main')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle clearing all filters and search
  const handleClearAll = () => {
    setFilters({
      l1Capability: 'all',
      l2Capability: 'all',
      trial: 'all',
      rating: 'all',
      sortBy: 'rating'
    });
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Handle agent selection for modal
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };
  
  // Handle adding a review
  const handleAddReview = async (agentId: string, review: Review) => {
    try {
      // Submit review to the backend API
      const updatedAgent = await AgentService.submitReview(agentId, {
        author: review.author,
        rating: review.rating,
        comment: review.comment
      });

      // Update agents state with the agent returned from the API
      // Create a completely new agents array to ensure React detects the change
      const newAgents = agents.map(agent => 
        agent.id === agentId ? { ...updatedAgent } : { ...agent }
      );
      
      // Force immediate updates using flushSync
      flushSync(() => {
        setAgents([...newAgents]); // Create a new array reference
        // Immediately update filtered agents using the same logic as useEffect
        const filteredResult = applyFiltersAndSorting(newAgents, searchQuery, filters);
        setFilteredAgents([...filteredResult]); // Create a new array reference
      });

      // Also update selected agent in the modal
      if (selectedAgent && selectedAgent.id === agentId) {
        setSelectedAgent(updatedAgent);
      }

      console.log('Review submitted successfully!');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <Hero onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main className="main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading agents...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-message">
              <h3>Error Loading Agents</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            <Stats agents={filteredAgents} />
            
            <Filters 
              filters={filters} 
              businessCapabilities={businessCapabilities}
              onFilterChange={handleFilterChange} 
              onClearAll={handleClearAll}
            />
            
            <div className="filters-view-controls">
              <ViewToggle 
                viewType={viewType}
                onToggle={setViewType}
              />
            </div>
            
            <div className={`agents-container ${viewType}-view`}>
              {displayedAgents.length > 0 ? (
                displayedAgents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onClick={handleAgentClick} 
                  />
                ))
              ) : (
                <div className="no-results">
                  No agents found matching your criteria. Try adjusting your filters.
                </div>
              )}
            </div>
            
            {filteredAgents.length > itemsPerPage && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
      
      <ContactForm />
      
      <AgentModal 
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddReview={handleAddReview}
      />
      
      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">About</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} Sogeti. All rights reserved.
          </div>
        </div>
      </footer>
      
      <ChatWidget />
    </>
  )
}

export default App
