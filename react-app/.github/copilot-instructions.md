<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SAGE - Sogeti Agent Exchange

This project is a React application built with TypeScript and Vite for the Sogeti Agent Exchange (SAGE) platform. It's an app for browsing, filtering, and reviewing AI models.

## Project Architecture

- **Components**: All UI components are in the `src/components` directory
- **Types**: TypeScript interfaces and types are in `src/types`
- **Data**: Sample data and business capability mappings are in `src/data`
- **Styling**: CSS styles are in `App.css` and `index.css`

## Component Structure

The app has these main components:
- `Header`: App header with logo and search functionality
- `Stats`: Displays statistics about agents
- `Filters`: Provides filtering options
- `AgentCard`: Card component for displaying individual agents
- `AgentModal`: Modal for viewing agent details and adding reviews
- `Pagination`: Pagination controls for browsing agents

## Data Models

The main data types are:
- `Agent`: Represents an AI agent with properties like title, domain, description
- `Review`: Represents a user review for an agent
- `BusinessCapability`: Represents business domain categorizations
- `FilterOptions`: Options for filtering agents

Please maintain the existing code structure and component organization when making changes or adding features.
