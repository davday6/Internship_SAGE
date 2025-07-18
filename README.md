# SAGE Web Portal

This repository contains the SAGE (Sogeti AI Guide & Exchange) web portal, developed as a Capgemini/Sogeti USA Internship project. SAGE is a comprehensive platform for discovering and evaluating AI solutions across various business domains.

## Project Structure

The project consists of two main components:

### Frontend (React Application)
- Located in `/react-app`
- Built with React + TypeScript + Vite
- Features:
  - Interactive AI agent catalog with filtering and search
  - Detailed agent information cards
  - User review system
  - Real-time chat interface
  - Responsive design for all devices

### Backend (Python Chatbot)
- Located in `/chatbot`
- Built with Python + Flask
- Features:
  - AI-powered chat functionality
  - Azure OpenAI integration
  - Context-aware responses
  - Secure API endpoints

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn
- Git

### Frontend Setup
1. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the react-app directory with:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the chatbot directory:
   ```bash
   cd chatbot
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv chatbotvenv
   source chatbotvenv/bin/activate  # On Windows: chatbotvenv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the chatbot directory with your Azure OpenAI credentials:
   ```
   AZURE_OPENAI_API_KEY=your_api_key
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_API_VERSION=2024-12-01-preview
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

## Features

### Agent Catalog
- Browse AI solutions by business domain
- Filter by capabilities, trial availability, and ratings
- Detailed agent information with user reviews
- Trial access links where available

### Interactive Chat
- Real-time chat interface
- AI-powered responses
- Context-aware assistance
- Integration with Azure OpenAI

### Review System
- User ratings and reviews
- Average rating calculation
- Detailed feedback display

## Project Architecture

### Frontend
- React for UI components
- TypeScript for type safety
- Vite for build tooling
- CSS for styling
- Context API for state management

### Backend
- Flask for API endpoints
- Azure OpenAI for AI capabilities
- Environment variables for configuration
- Virtual environment for dependency isolation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security Notes

- Never commit `.env` files
- Keep API keys secure
- Review dependencies regularly
- Follow security best practices

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Capgemini/Sogeti USA for the internship opportunity
- Project mentors and supervisors
- Azure OpenAI team for AI capabilities
