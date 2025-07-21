# SAGE - Sogeti Agent Excha## Getting Started

1. Clone the repository
```
git clone [repository-url]
```

2. Install dependencies
```
cd react-app
npm install
```

3. Start the backend server (required for API data)
```
cd ../backend
npm install
npm start
```
The backend server should be running on `http://localhost:3000`

4. Run the development server
```
cd ../react-app
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Integration

The application fetches agent data from the backend API running on `http://localhost:3000/api/agents`. Make sure the backend server is running before starting the React application. If the API is unavailable, the application will display an error message with a retry option. Agent Exchange) is a web application for browsing, filtering, and reviewing AI models. This application provides a user interface to search through different AI agents organized by business capabilities, view their details, and add reviews.

## Features

- Browse AI agents by business capabilities and sub-capabilities
- Filter agents by trial availability, rating, and other criteria
- Search for specific agents using keywords
- View detailed information about each agent
- Add reviews and ratings for agents
- Responsive design that works on desktop and mobile devices

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS3

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v7.0.0 or later)

### Installation

1. Clone the repository
```
git clone [repository-url]
```

2. Install dependencies
```
cd react-app
npm install
```

3. Run the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
react-app/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and other assets
│   ├── components/       # React components
│   │   ├── AgentCard.tsx
│   │   ├── AgentModal.tsx
│   │   ├── Filters.tsx
│   │   ├── Header.tsx
│   │   ├── Pagination.tsx
│   │   └── Stats.tsx
│   ├── data/             # Data files
│   │   └── agentData.ts  # Sample agent data
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.css           # Main application styles
│   ├── App.tsx           # Main application component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── index.html            # HTML entry point
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## Building for Production

To build the app for production:

```
npm run build
```

This will create a `dist` directory with the production build.

## License

Copyright © 2025 Sogeti. All rights reserved.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
