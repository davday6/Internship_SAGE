# Adding a New Agent to SAGE

This document provides a guide on how to add a new agent to the SAGE platform using the provided helper functions.

## Method 1: Using the Helper Function

You can add a new agent programmatically using the `addNewAgent` function from `utils/agentHelpers.ts`:

```tsx
import { useState } from 'react';
import { addNewAgent } from '../utils/agentHelpers';
import type { Agent } from '../types';

// Assuming you have the current agents in state
const [agents, setAgents] = useState<Agent[]>(currentAgents);

// Example: Adding a new agent
const handleAddAgent = () => {
  const newAgentData = {
    title: "Market Analysis AI",
    domain: "Business Services",
    subdomain: "Financial Services",
    description: "AI that provides market analysis and financial insights based on real-time data.",
    rating: 4.0,
    trial: true,
    reviewsList: [
      {
        author: "Financial Analyst",
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        rating: 4,
        comment: "Very useful for quick market insights. Saved me hours of research."
      }
    ]
  };

  // Add the new agent and update state
  const updatedAgents = addNewAgent(newAgentData, agents);
  setAgents(updatedAgents);
};
```

## Method 2: Directly Editing the Data File

You can also directly add a new agent by editing the `agentData.ts` file:

1. Add a new object to the `agentsData` array
2. Ensure your agent has a unique ID
3. Make sure the `comments` property matches the length of the `reviewsList` array
4. If the domain doesn't exist yet, add it to the `businessCapabilities` object

Example:

```tsx
// In agentData.ts
export const agentsData: Agent[] = [
  // existing agents...
  {
    id: "7", // Make sure this is unique
    title: "Market Analysis AI",
    domain: "Business Services",
    subdomain: "Financial Services",
    description: "AI that provides market analysis and financial insights based on real-time data.",
    rating: 4.0,
    comments: 1, // Should match the length of reviewsList
    trial: true,
    reviewsList: [
      {
        author: "Financial Analyst",
        date: "2025-07-15",
        rating: 4,
        comment: "Very useful for quick market insights. Saved me hours of research."
      }
    ]
  }
];
```

## Adding Reviews to an Agent

You can add reviews to an agent using the `addReviewToAgent` function:

```tsx
import { addReviewToAgent } from '../utils/agentHelpers';

const handleAddReview = (agentId: string) => {
  const newReview = {
    author: "User Name",
    date: new Date().toISOString().split('T')[0],
    rating: 5,
    comment: "This agent exceeded my expectations!"
  };

  // Add the review and update state
  const updatedAgents = addReviewToAgent(agentId, newReview, agents);
  setAgents(updatedAgents);
};
```

## Important Notes

- Each agent must have a unique ID
- The `comments` property should always match the length of the `reviewsList` array
- Ensure the domain and subdomain values match the existing categories in `businessCapabilities`
- When adding a new domain, update the `businessCapabilities` object
