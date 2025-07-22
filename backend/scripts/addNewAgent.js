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
  
  if (!agentData.domain || agentData.domain.trim() === '') {
    errors.push('Domain is required');
  }
  
  if (!agentData.subdomain || agentData.subdomain.trim() === '') {
    errors.push('Subdomain is required');
  }
  
  if (!agentData.description || agentData.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (agentData.trialUrl && !isValidUrl(agentData.trialUrl)) {
    errors.push('Trial URL must be a valid URL');
  }
  
  if (agentData.commentUrl && !isValidUrl(agentData.commentUrl)) {
    errors.push('Comment URL must be a valid URL');
  }
  
  return errors;
}

// URL validation helper
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
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
    agentData.domain = await question('Domain (e.g., "Business Services", "Healthcare", "Software Development"): ');
    agentData.subdomain = await question('Subdomain (e.g., "Financial Services", "Data Analytics"): ');
    agentData.description = await question('Description: ');
    
    const trialUrl = await question('Trial URL (optional, press Enter to skip): ');
    if (trialUrl.trim()) {
      agentData.trialUrl = trialUrl.trim();
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
      domain: agentData.domain.trim(),
      subdomain: agentData.subdomain.trim(),
      description: agentData.description.trim(),
      rating: 0,
      comments: 0,
      commentUrl: agentData.commentUrl ? agentData.commentUrl.trim() : null,
      trialUrl: agentData.trialUrl ? agentData.trialUrl.trim() : null,
      reviewsList: []
    });

    console.log('\n📊 Agent Summary:');
    console.log('=' .repeat(40));
    console.log(`ID: ${newAgent.id}`);
    console.log(`Title: ${newAgent.title}`);
    console.log(`Domain: ${newAgent.domain}`);
    console.log(`Subdomain: ${newAgent.subdomain}`);
    console.log(`Description: ${newAgent.description}`);
    console.log(`Trial URL: ${newAgent.trialUrl || 'Not provided'}`);
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

This script adds a new agent to the SAGE database.

Usage Options:

1. Interactive Mode (Recommended):
   node scripts/addNewAgent.js

2. Command Line Mode:
   node scripts/addNewAgent.js --title "Agent Name" --domain "Domain" --subdomain "Subdomain" --description "Description" [--trialUrl "URL"] [--commentUrl "URL"]

Examples:

Interactive:
   node scripts/addNewAgent.js

Command Line:
   node scripts/addNewAgent.js --title "Market Analysis AI" --domain "Business Services" --subdomain "Financial Services" --description "AI agent that provides market analysis and insights" --trialUrl "https://market-ai.com/trial"

Required Fields:
   - title: Agent name
   - domain: Business domain (e.g., "Healthcare", "Software Development")  
   - subdomain: More specific capability (e.g., "Data Analytics", "Code Review")
   - description: Detailed description of agent capabilities

Optional Fields:
   - trialUrl: URL for trying the agent
   - commentUrl: URL for contacting agent creator or leaving feedback

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
  if (args.title || args.domain || args.subdomain || args.description) {
    console.log('📋 Using command line arguments...');
    agentData = {
      title: args.title,
      domain: args.domain,
      subdomain: args.subdomain,
      description: args.description,
      trialUrl: args.trialUrl,
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
