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
import { agentsData } from './data/agentData'
import type { Agent, FilterOptions, Review } from './types'

function App() {
  // State for agents and filtered agents
  const [agents, setAgents] = useState<Agent[]>(agentsData)
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agentsData)
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
      const isTrialAvailable = filters.trial === 'true';
      result = result.filter(agent => agent.trial === isTrialAvailable);
    }
    
    // Apply rating filter
    if (filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      result = result.filter(agent => agent.rating >= minRating);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'comments':
        result.sort((a, b) => b.comments - a.comments);
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
  };
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle agent selection for modal
  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };
  
  // Handle adding a review
  const handleAddReview = (agentId: string, review: Review) => {
    setAgents(prev => {
      return prev.map(agent => {
        if (agent.id === agentId) {
          const reviewsList = agent.reviewsList ? [...agent.reviewsList, review] : [review];
          return { 
            ...agent, 
            reviewsList,
            comments: agent.comments + 1,
            rating: calculateNewRating(reviewsList)
          };
        }
        return agent;
      });
    });
    
    // Also update selected agent in the modal
    if (selectedAgent && selectedAgent.id === agentId) {
      const reviewsList = selectedAgent.reviewsList ? [...selectedAgent.reviewsList, review] : [review];
      setSelectedAgent({
        ...selectedAgent,
        reviewsList,
        comments: selectedAgent.comments + 1,
        rating: calculateNewRating(reviewsList)
      });
    }
  };
  
  // Calculate new rating after adding a review
  const calculateNewRating = (reviews: Review[]) => {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Hero onSearch={handleSearch} />
      
      <main className="main">
        <Stats agents={filteredAgents} />
        
        <Filters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
        
        <div className="agents-container">
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
    </>
  )
}

export default App
