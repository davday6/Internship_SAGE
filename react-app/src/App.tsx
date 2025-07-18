import { useState, useEffect, useMemo } from 'react'
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
import { syncedAgentsData, syncAgentData } from './data/agentData'
import type { Agent, FilterOptions, Review } from './types'

function App() {
  // State for agents and filtered agents
  const [agents, setAgents] = useState<Agent[]>(syncedAgentsData)
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(syncedAgentsData)
  const [displayedAgents, setDisplayedAgents] = useState<Agent[]>([])
  
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
  
  // Filter agents based on search query and filters
  useEffect(() => {
    let result = [...agents];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        agent => 
          agent.title.toLowerCase().includes(query) ||
          agent.description.toLowerCase().includes(query) ||
          agent.domain.toLowerCase().includes(query) ||
          agent.subdomain.toLowerCase().includes(query)
      );
    }
    
    // Apply business capability filters
    if (filters.l1Capability !== 'all') {
      result = result.filter(agent => agent.domain === filters.l1Capability);
    }
    
    // Apply subcapability filter (regardless of L1 selection)
    if (filters.l2Capability !== 'all') {
      result = result.filter(agent => agent.subdomain === filters.l2Capability);
    }
    
    // Apply trial filter
    if (filters.trial !== 'all') {
      const hasTrialUrl = filters.trial === 'true';
      result = result.filter(agent => Boolean(agent.trialUrl) === hasTrialUrl);
    }
    
    // Apply rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      result = result.filter(agent => (agent.rating || 0) >= minRating);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
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
  const handleAddReview = (agentId: string, review: Review) => {
    setAgents(prev => {
      // First update the reviewsList for the specific agent
      const updatedAgents = prev.map(agent => {
        if (agent.id === agentId) {
          const reviewsList = agent.reviewsList ? [...agent.reviewsList, review] : [review];
          return { 
            ...agent, 
            reviewsList,
          };
        }
        return agent;
      });
      
      // Then use syncAgentData to calculate ratings and comments
      return syncAgentData(updatedAgents);
    });
    
    // Also update selected agent in the modal
    if (selectedAgent && selectedAgent.id === agentId) {
      const reviewsList = selectedAgent.reviewsList ? [...selectedAgent.reviewsList, review] : [review];
      const updatedAgent = {
        ...selectedAgent,
        reviewsList,
      };
      
      // Use syncAgentData to calculate rating and comments for consistency
      const [calculatedAgent] = syncAgentData([updatedAgent]);
      setSelectedAgent(calculatedAgent);
    }
  };

  return (
    <>
      <Header />
      <Hero onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main className="main">
        <Stats agents={filteredAgents} />
        
        <Filters 
          filters={filters} 
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
