# Multiple Domains and Subdomains Implementation

This document describes the implementation of support for multiple domains and subdomains for each agent in the SAGE platform.

## Overview

The system has been updated to allow each agent to have multiple domains and subdomains instead of being limited to a single domain and subdomain. This provides greater flexibility in categorizing agents that span multiple business areas or capabilities.

## Changes Made

### 1. Database Schema Updates (`backend/models/Agent.js`)

- **Added new fields**: `domains` and `subdomains` as arrays of strings
- **Maintained legacy fields**: `domain` and `subdomain` for backward compatibility
- **Updated search index**: Now includes `domains` and `subdomains` in text search

```javascript
// New schema structure
domains: [{ type: String, required: true }],     // Array of domains
subdomains: [{ type: String, required: true }], // Array of subdomains

// Legacy fields (maintained for compatibility)
domain: { type: String },    // Single domain (legacy)
subdomain: { type: String }  // Single subdomain (legacy)
```

### 2. TypeScript Interface Updates (`react-app/src/types/index.ts`)

- **Updated Agent interface**: Added `domains` and `subdomains` arrays
- **Maintained legacy fields**: `domain` and `subdomain` marked as optional for backward compatibility

```typescript
export interface Agent {
  // ... other fields
  domains: string[];        // New array field
  subdomains: string[];     // New array field
  domain?: string;          // Legacy field (optional)
  subdomain?: string;       // Legacy field (optional)
}
```

### 3. Frontend Component Updates

#### Agent Card (`react-app/src/components/AgentCard.tsx`)
- Updated to display multiple domains and subdomains as separate tags
- Maintains backward compatibility with legacy single domain/subdomain format

#### Agent Modal (`react-app/src/components/AgentModal.tsx`)
- Updated to show all domains and subdomains in the detailed view
- Uses flexible layout to accommodate multiple tags

#### Stats Component (`react-app/src/components/Stats.tsx`)
- Updated to count unique domains and subdomains across all agents
- Handles both new array format and legacy single values

### 4. Business Logic Updates

#### Business Capabilities Derivation (`react-app/src/data/agentData.ts`)
- Updated to process multiple domains and subdomains
- Creates comprehensive capability mappings from all agent domains

#### Filtering and Search (`react-app/src/App.tsx`)
- Updated search to work across all domains and subdomains
- Enhanced filtering to match agents with any relevant domain/subdomain

#### Agent Helpers (`react-app/src/utils/agentHelpers.ts`)
- Updated `addNewAgent` function to support array format
- Maintains compatibility with legacy single domain/subdomain input

### 5. Backend Script Updates

#### Add New Agent Script (`backend/scripts/addNewAgent.js`)
- **Interactive mode**: Prompts for comma-separated domains and subdomains
- **Command line mode**: Supports both new array format and legacy single values
- **Validation**: Ensures at least one domain and subdomain are provided
- **Backward compatibility**: Still supports legacy `--domain` and `--subdomain` flags

##### New Usage Examples:
```bash
# Interactive mode (prompts for comma-separated values)
npm run add-agent

# Command line with multiple domains
node scripts/addNewAgent.js --title "Multi-Domain AI" --domains "Business Services,Healthcare" --subdomains "Financial Services,Medical Analytics" --description "..."

# Legacy command line (still supported)
node scripts/addNewAgent.js --title "Single Domain AI" --domain "Business Services" --subdomain "Financial Services" --description "..."
```

### 6. Data Migration

#### Migration Script (`backend/scripts/migrateToMultipleDomains.js`)
- Converts existing single domain/subdomain values to arrays
- Maintains data integrity during migration
- Provides verification of successful migration

##### Usage:
```bash
# Safe mode (shows what would be migrated)
npm run migrate-domains-safe

# Execute migration
npm run migrate-domains
```

### 7. Styling Updates (`react-app/src/App.css`)

- **New container classes**: `.agent-domains`, `.agent-subdomains`, `.modal-domains`, `.modal-subdomains`
- **Flexible layout**: Uses flexbox to handle multiple tags gracefully
- **Consistent spacing**: Maintains visual consistency between single and multiple tags

## Backward Compatibility

The implementation maintains full backward compatibility:

1. **Database**: Legacy `domain` and `subdomain` fields are preserved
2. **API**: Existing agents continue to work without modification
3. **Frontend**: Components handle both old and new data formats
4. **Scripts**: Legacy command-line arguments still function

## Migration Process

To migrate an existing system:

1. **Update codebase**: Deploy the new code
2. **Run migration**: Execute `npm run migrate-domains` in the backend directory (if needed)
3. **Split domains**: Execute `npm run split-domains` to clean up domain/subdomain separators
4. **Verify**: Check that all agents display correctly in the frontend
5. **Test**: Run `npm run test-domains` to verify functionality

## Post-Migration Domain Splitting

After implementing multiple domains support, you may want to clean up existing data that has domains/subdomains with separators:

### Split Domains Script
- **Purpose**: Automatically splits domains like "Software Development / Developer Tools" into ["Software Development", "Developer Tools"]
- **Usage**: `npm run split-domains` (or `npm run split-domains-safe` for preview)
- **Benefits**: 
  - Cleaner categorization
  - Better filtering capabilities
  - More accurate search results
  - Improved user experience

## New Features Enabled

1. **Cross-domain agents**: Agents can now belong to multiple business domains
2. **Enhanced filtering**: Users can find agents that match any of their domains/subdomains
3. **Improved search**: Search works across all domains and subdomains
4. **Better categorization**: More accurate representation of agent capabilities

## API Compatibility

The API remains fully compatible:
- Existing agents return both legacy fields and new arrays
- New agents can be created with either format
- Filtering works with both old and new field structures

## Future Considerations

1. **Legacy field removal**: After full migration and testing, legacy `domain` and `subdomain` fields can be removed
2. **Enhanced UI**: Consider adding domain/subdomain management interfaces
3. **Advanced filtering**: Implement more sophisticated filtering based on multiple categories
4. **Performance optimization**: Add database indexes for improved query performance on arrays

## Testing

Before deployment:
1. Test agent creation with multiple domains/subdomains
2. Verify filtering works correctly
3. Ensure search functionality covers all domains/subdomains
4. Test migration script on a copy of production data
5. Verify backward compatibility with existing agents
