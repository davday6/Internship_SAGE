#!/usr/bin/env node

/**
 * Add New Agent Script
 * 
 * This script connects to the MongoDB database and adds a new agent 
 * to the collection. It provides an interactive prompt to gather 
 * agent information or accepts command line arguments.
 * 
 * Usage:
 *   Interactive mode:
 *     node scripts/addNewAgent.js
 * 
 *   Command line mode:
 *     node scripts/addNewAgent.js --title "Agent Name" --domain "Business Services" --subdomain "Financial Services" --description "Agent description" --trialUrl "https://example.com/trial"
 * 
 * Make sure to run this from the backend directory where the .env file is located.
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Import the Agent model
const Agent = require('../models/Agent');

// Command line argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    if (key && value && key.startsWith('--')) {
      params[key.substring(2)] = value;
    }
  }
  
  return params;
}

// Validate required agent fields
function validateAgentData(agentData) {
  const errors = [];
  
  if (!agentData.title || agentData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  // Check domains array
  if (!agentData.domains || !Array.isArray(agentData.domains) || agentData.domains.length === 0) {
    errors.push('At least one domain is required');
  } else {
    // Check if all domains are non-empty strings
    const invalidDomains = agentData.domains.filter(d => !d || typeof d !== 'string' || d.trim() === '');
    if (invalidDomains.length > 0) {
      errors.push('All domains must be non-empty strings');
    }
  }
  
  // Check subdomains array
  if (!agentData.subdomains || !Array.isArray(agentData.subdomains) || agentData.subdomains.length === 0) {
    errors.push('At least one subdomain is required');
  } else {
    // Check if all subdomains are non-empty strings
    const invalidSubdomains = agentData.subdomains.filter(s => !s || typeof s !== 'string' || s.trim() === '');
    if (invalidSubdomains.length > 0) {
      errors.push('All subdomains must be non-empty strings');
    }
  }
  
  if (!agentData.description || agentData.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (agentData.trialUrl && !isValidUrl(agentData.trialUrl)) {
    errors.push('Trial URL must be a valid URL (e.g., https://example.com) or email address');
  }
  
  if (agentData.documentationUrl && !isValidUrl(agentData.documentationUrl)) {
    errors.push('Documentation URL must be a valid URL (e.g., https://example.com) or email address');
  }
  
  if (agentData.commentUrl && !isValidUrl(agentData.commentUrl)) {
    errors.push('Comment URL must be a valid URL (e.g., https://example.com) or email address');
  }
  
  return errors;
}

// URL validation helper (accepts URLs and email addresses)
function isValidUrl(string) {
  // Check if it's a valid URL
  try {
    new URL(string);
    return true;
  } catch (_) {
    // If not a URL, check if it's a valid email address
    return isValidEmail(string);
  }
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Interactive prompt for agent data
async function promptForAgentData() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));
  
  console.log('\n📝 Enter agent information:');
  console.log('=' .repeat(40));
  
  const agentData = {};
  
  try {
    agentData.title = await question('Agent Title: ');
    
    // Handle domains - support multiple domains
    const domainsInput = await question('Domains (comma-separated, e.g., "Business Services, Healthcare"): ');
    agentData.domains = domainsInput.split(',').map(d => d.trim()).filter(d => d.length > 0);
    
    // Handle subdomains - support multiple subdomains
    const subdomainsInput = await question('Subdomains (comma-separated, e.g., "Financial Services, Data Analytics"): ');
    agentData.subdomains = subdomainsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    agentData.description = await question('Description: ');
    
    const trialUrl = await question('Trial URL (optional, press Enter to skip): ');
    if (trialUrl.trim()) {
      agentData.trialUrl = trialUrl.trim();
    }
    
    const documentationUrl = await question('Documentation URL (optional, press Enter to skip): ');
    if (documentationUrl.trim()) {
      agentData.documentationUrl = documentationUrl.trim();
    }
    
    const commentUrl = await question('Comment/Contact URL (optional, press Enter to skip): ');
    if (commentUrl.trim()) {
      agentData.commentUrl = commentUrl.trim();
    }
    
    return agentData;
  } finally {
    rl.close();
  }
}

// Generate unique ID for new agent
async function generateUniqueId() {
  try {
    // Find the highest existing ID and increment
    const agents = await Agent.find({}, 'id').sort({ id: -1 });
    
    if (agents.length === 0) {
      return '1';
    }
    
    // Try to find the highest numeric ID
    let maxId = 0;
    agents.forEach(agent => {
      const numId = parseInt(agent.id);
      if (!isNaN(numId) && numId > maxId) {
        maxId = numId;
      }
    });
    
    return (maxId + 1).toString();
  } catch (error) {
    console.error('Error generating unique ID:', error);
    // Fallback to timestamp-based ID
    return Date.now().toString();
  }
}

// Add agent to database
async function addAgentToDatabase(agentData) {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB using the same connection string as the main app
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully!');

    // Validate agent data
    const validationErrors = validateAgentData(agentData);
    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:');
      validationErrors.forEach(error => console.log(`   - ${error}`));
      return false;
    }

    // Generate unique ID
    const uniqueId = await generateUniqueId();
    
    // Check if an agent with similar title already exists
    const existingAgent = await Agent.findOne({ 
      title: { $regex: new RegExp(`^${agentData.title.trim()}$`, 'i') }
    });
    
    if (existingAgent) {
      console.log(`⚠️  An agent with title "${agentData.title}" already exists!`);
      console.log(`   Existing agent ID: ${existingAgent.id}`);
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const proceed = await new Promise(resolve => {
        rl.question('Do you want to proceed anyway? (y/N): ', answer => {
          rl.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
      });
      
      if (!proceed) {
        console.log('❌ Operation cancelled.');
        return false;
      }
    }

    // Create new agent object
    const newAgent = new Agent({
      id: uniqueId,
      title: agentData.title.trim(),
      domains: agentData.domains.map(d => d.trim()),
      subdomains: agentData.subdomains.map(s => s.trim()),
      description: agentData.description.trim(),
      rating: 0,
      comments: 0,
      commentUrl: agentData.commentUrl ? agentData.commentUrl.trim() : null,
      trialUrl: agentData.trialUrl ? agentData.trialUrl.trim() : null,
      documentationUrl: agentData.documentationUrl ? agentData.documentationUrl.trim() : null,
      version: agentData.version || '1.0',
      reviewsList: []
    });

    console.log('\n📊 Agent Summary:');
    console.log('=' .repeat(40));
    console.log(`ID: ${newAgent.id}`);
    console.log(`Title: ${newAgent.title}`);
    console.log(`Domains: ${newAgent.domains.join(', ')}`);
    console.log(`Subdomains: ${newAgent.subdomains.join(', ')}`);
    console.log(`Description: ${newAgent.description}`);
    console.log(`Version: ${newAgent.version}`);
    console.log(`Trial URL: ${newAgent.trialUrl || 'Not provided'}`);
    console.log(`Documentation URL: ${newAgent.documentationUrl || 'Not provided'}`);
    console.log(`Comment URL: ${newAgent.commentUrl || 'Not provided'}`);
    console.log('=' .repeat(40));

    // Save to database
    console.log('💾 Saving agent to database...');
    await newAgent.save();
    
    console.log('✅ Agent added successfully!');
    console.log(`🆔 Agent ID: ${newAgent.id}`);
    console.log(`📝 Title: ${newAgent.title}`);
    
    // Verify the agent was saved
    const verifyAgent = await Agent.findOne({ id: uniqueId });
    if (verifyAgent) {
      console.log('✅ Verification successful: Agent found in database');
    } else {
      console.log('⚠️  Verification warning: Agent not found in database');
    }
    
    return true;

  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Error: An agent with this ID already exists');
    } else {
      console.error('❌ Error adding agent:', error.message);
    }
    return false;
  } finally {
    // Close the database connection
    console.log('🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('👋 Done!');
  }
}

// Display help information
function showHelp() {
  console.log(`
📖 Add New Agent Script Help
=${'='.repeat(30)}

This script adds a new agent to the SAGE database with support for multiple domains and subdomains.

Usage Options:

1. Interactive Mode (Recommended):
   node scripts/addNewAgent.js

2. Command Line Mode:
   node scripts/addNewAgent.js --title "Agent Name" --domains "Domain1,Domain2" --subdomains "Subdomain1,Subdomain2" --description "Description" [--trialUrl "URL"] [--commentUrl "URL"]

Examples:

Interactive:
   node scripts/addNewAgent.js

Command Line with Multiple Domains/Subdomains:
   node scripts/addNewAgent.js --title "Multi-Domain AI" --domains "Business Services,Healthcare" --subdomains "Financial Services,Medical Analytics" --description "AI agent that provides analysis across multiple domains"

Required Fields:
   - title: Agent name
   - domains: Business domains (comma-separated, e.g., "Healthcare,Software Development")
   - subdomains: More specific capabilities (comma-separated, e.g., "Data Analytics,Code Review")
   - description: Detailed description of agent capabilities

Optional Fields:
   - trialUrl: URL for trying the agent (e.g., https://example.com/trial)
   - commentUrl: URL for contacting agent creator or email address (e.g., https://contact.com or user@example.com)

Note: Make sure to run this from the backend directory where the .env file is located.
`);
}

// Main function
async function main() {
  const args = parseArgs();
  
  // Check for help flag - check before doing anything else
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    return;
  }
  
  console.log('🚀 Starting Add New Agent Script...');
  console.log('=' .repeat(50));
  
  let agentData;
  
  // Check if we have command line arguments
  if (args.title || args.domains || args.subdomains || args.description) {
    console.log('📋 Using command line arguments...');
    
    // Handle domains and subdomains as comma-separated values
    let domains = [];
    let subdomains = [];
    
    if (args.domains) {
      domains = args.domains.split(',').map(d => d.trim()).filter(d => d.length > 0);
    }
    
    if (args.subdomains) {
      subdomains = args.subdomains.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    
    agentData = {
      title: args.title,
      domains: domains,
      subdomains: subdomains,
      description: args.description,
      trialUrl: args.trialUrl,
      documentationUrl: args.documentationUrl,
      commentUrl: args.commentUrl
    };
  } else {
    console.log('💬 Starting interactive mode...');
    agentData = await promptForAgentData();
  }
  
  // Add agent to database
  const success = await addAgentToDatabase(agentData);
  
  if (success) {
    console.log('\n🎉 Agent successfully added to the SAGE database!');
    console.log('   You can now view it in the web application.');
    process.exit(0);
  } else {
    console.log('\n💥 Failed to add agent to database.');
    process.exit(1);
  }
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { addAgentToDatabase, validateAgentData, generateUniqueId };
