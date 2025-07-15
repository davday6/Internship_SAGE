import React from 'react';
import { businessCapabilities } from '../data/agentData';
import type { FilterOptions } from '../types';

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
    
    // Reset L2 capability when L1 changes
    if (name === 'l1Capability' && value !== filters.l1Capability) {
      onFilterChange({ l1Capability: value, l2Capability: 'all' });
    }
  };

  // Get available L2 capabilities based on selected L1
  const getL2Options = () => {
    if (filters.l1Capability === 'all') {
      // Gather all subcapabilities from all L1 capabilities
      const allSubCapabilities: string[] = [];
      Object.values(businessCapabilities).forEach(capability => {
        capability.subCapabilities.forEach(subCap => {
          if (!allSubCapabilities.includes(subCap)) {
            allSubCapabilities.push(subCap);
          }
        });
      });
      return allSubCapabilities.sort();
    }
    
    const l1 = filters.l1Capability;
    return businessCapabilities[l1]?.subCapabilities || [];
  };

  return (
    <div className="filter-container">
      <div className="filter-title">Filters</div>
      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="l1Capability">Business Capability (L1)</label>
          <select 
            id="l1Capability" 
            name="l1Capability" 
            value={filters.l1Capability} 
            onChange={handleFilterChange}
          >
            <option value="all">All Capabilities</option>
            {Object.keys(businessCapabilities).map((cap) => (
              <option key={cap} value={cap}>{cap}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="l2Capability">Business Capability (L2)</label>
          <select 
            id="l2Capability" 
            name="l2Capability" 
            value={filters.l2Capability} 
            onChange={handleFilterChange}
          >
            <option value="all">All Sub-Capabilities</option>
            {getL2Options().map((subcap) => (
              <option key={subcap} value={subcap}>{subcap}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="trial">Trial Availability</label>
          <select id="trial" name="trial" value={filters.trial} onChange={handleFilterChange}>
            <option value="all">All Agents</option>
            <option value="true">Trial Available</option>
            <option value="false">No Trial Available</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating">Minimum Rating</label>
          <select id="rating" name="rating" value={filters.rating} onChange={handleFilterChange}>
            <option value="all">Any Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
            <option value="rating">Highest Rated</option>
            <option value="comments">Most Reviewed</option>
            <option value="title">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
