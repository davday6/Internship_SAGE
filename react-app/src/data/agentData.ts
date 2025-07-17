import type { Agent, BusinessCapabilities } from '../types';

// Define business capability levels
export const businessCapabilities: BusinessCapabilities = {
  "Development": {
    name: "Development",
    subCapabilities: ["SDLC", "Software Development / DevOps", "Software Engineering / Automated Program Repair", "Software Development / Project Management", "Software Development / Developer Tools"]
  },
  "Data": {
    name: "Data",
    subCapabilities: ["Data Analytics & Business Intelligence", "Data Labeling & Annotation", "Text-to-SQL & Business Intelligence", "Enterprise Knowledge Management"]
  },
  "Testing": {
    name: "Testing",
    subCapabilities: ["Testing", "ERP"]
  },
  "AI": {
    name: "AI",
    subCapabilities: ["Computer Vision / AI-assisted Development", "AI Safety & Security", "AI/LLM Observability & Monitoring", "Synthetic Data Generation"]
  },
  "Healthcare": {
    name: "Healthcare",
    subCapabilities: ["Healthcare", "Healthcare / Health Insurance"]
  },
  "Business Services": {
    name: "Business Services",
    subCapabilities: ["HR", "Legal", "Procurement", "Financial Services", "Property Management", "Retail / Content Marketing"]
  },
  "Customer Engagement": {
    name: "Customer Engagement",
    subCapabilities: ["Customer Service / E-commerce", "Telecommunications", "Sales Experience"]
  },
  "Supply Chain": {
    name: "Supply Chain",
    subCapabilities: ["Demand Forecast (SCM)"]
  },
  "Government": {
    name: "Government",
    subCapabilities: ["Government"]
  },
  "Cross-Domain": {
    name: "Cross-Domain",
    subCapabilities: ["Multiple Domains"]
  }
};

// Sample agent data
export const agentsData: Agent[] = [
  {
    id: "1",
    title: "DevAssistant AI",
    domain: "Development",
    subdomain: "Software Development / DevOps",
    description: "An AI assistant specialized in helping developers with code completion, bug fixing, and code reviews. Supports multiple programming languages including JavaScript, Python, and Java.",
    trial: true,
    trialUrl: "https://trial.devassistant.ai/register",
    contactUrl: "https://devassistant.ai/contact",
    reviewsList: [
      {
        author: "John Dev",
        date: "2025-05-12",
        rating: 5,
        comment: "Incredibly helpful for debugging complex issues. Saved me hours of work!"
      },
      {
        author: "Alice Coder",
        date: "2025-05-01",
        rating: 4,
        comment: "Very good at suggesting code improvements. Occasionally misses context in larger projects."
      }
    ]
  },
  {
    id: "2",
    title: "HealthTech Analyzer",
    domain: "Healthcare",
    subdomain: "Healthcare",
    description: "Specialized AI for healthcare data analysis, patient record management, and medical research assistance. HIPAA compliant and trained on validated medical datasets.",
    trial: false,
    contactUrl: "https://healthtechanalyzer.com/support",
    reviewsList: [
      {
        author: "Dr. Smith",
        date: "2025-06-03",
        rating: 5,
        comment: "Excellent for analyzing patient data trends. Very accurate recommendations."
      },
      {
        author: "Medical Researcher",
        date: "2025-05-22",
        rating: 4,
        comment: "Great tool for research assistance, but requires some domain expertise to get the best results."
      }
    ]
  },
  {
    id: "3",
    title: "DataViz Master",
    domain: "Data",
    subdomain: "Data Analytics & Business Intelligence",
    description: "AI-powered data visualization tool that automatically creates insightful charts and dashboards from raw data. Supports multiple data sources and export formats.",
    trial: true,
    trialUrl: "https://datavizmaster.io/trial",
    contactUrl: "https://datavizmaster.io/contact",
    reviewsList: [
      {
        author: "Data Analyst",
        date: "2025-06-10",
        rating: 4,
        comment: "Creates beautiful visualizations with minimal effort. Would like more customization options."
      }
    ]
  },
  {
    id: "4",
    title: "TestSuite Pro",
    domain: "Testing",
    subdomain: "Testing",
    description: "AI agent that automatically generates comprehensive test cases, performs regression testing, and identifies potential vulnerabilities in your code.",
    trial: false,
    reviewsList: [
      {
        author: "QA Lead",
        date: "2025-05-18",
        rating: 5,
        comment: "Dramatically improved our test coverage. Finds edge cases we would have missed."
      }
    ]
  },
  {
    id: "5",
    title: "AI Safety Guard",
    domain: "AI",
    subdomain: "AI Safety & Security",
    description: "A specialized agent for monitoring and ensuring the ethical and safe operation of other AI systems. Provides risk assessments and mitigation strategies.",
    trial: true,
    trialUrl: "https://ai-safety-guard.dev/try",
    reviewsList: [
      {
        author: "AI Ethics Officer",
        date: "2025-06-15",
        rating: 5,
        comment: "Essential tool for our AI governance framework. Comprehensive monitoring capabilities."
      }
    ]
  },
  {
    id: "6",
    title: "HR Assistant Pro",
    domain: "Business Services",
    subdomain: "HR",
    description: "AI-powered HR assistant for employee onboarding, performance review analysis, and HR policy compliance. Integrates with popular HRIS systems.",
    trial: false,
    reviewsList: [
      {
        author: "HR Manager",
        date: "2025-06-02",
        rating: 4,
        comment: "Streamlines our HR processes effectively. Could use better customization for company-specific policies."
      }
    ]
  },
  // Example of a new agent added to the platform
  {
    id: "7",
    title: "Market Analysis AI",
    domain: "Business Services",
    subdomain: "Financial Services",
    description: "AI that provides market analysis and financial insights based on real-time data and historical trends. Helps with investment decisions and market forecasting.",
    trial: true,
    trialUrl: "https://market-analysis-ai.com/free-trial",
    reviewsList: [
      {
        author: "Financial Analyst",
        date: "2025-07-15",
        rating: 4,
        comment: "Very useful for quick market insights. Saved me hours of research."
      }
    ]
  },
  {
    id: "8",
    title: "Market Research Bot",
    domain: "Business Services",
    subdomain: "Financial Services",
    description: "AI that provides market research and competitive analysis based on real-time data and historical trends. Helps with investment decisions and market forecasting.",
    trial: true,
    trialUrl: "https://market-research-bot.com/free-trial",
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

// Function to find L1 category for a domain
export function findL1ForDomain(domain: string): string {
  for (const [key] of Object.entries(businessCapabilities)) {
    if (key === domain) {
      return key;
    }
  }
  return "Other";
}

// Synchronize comments count and calculate average ratings from reviews
export function syncAgentData(agents: Agent[]): Agent[] {
  return agents.map(agent => {
    // Calculate the actual average rating from reviews
    const reviewsList = agent.reviewsList || [];
    const reviewCount = reviewsList.length;
    
    // Calculate average rating if reviews exist
    let averageRating = 0;
    if (reviewCount > 0) {
      const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
      averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
    }
    
    return {
      ...agent,
      comments: reviewCount,
      rating: averageRating
    };
  });
}

// Initial synchronization to ensure consistency with calculated ratings
export const syncedAgentsData = syncAgentData(agentsData);
