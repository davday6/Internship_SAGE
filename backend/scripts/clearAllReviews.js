#!/usr/bin/env node

/**
 * Clear All Reviews Script
 * 
 * This script connects to the MongoDB database and removes all reviews 
 * from all agents in the collection. It also resets the rating and 
 * comments count for each agent.
 * 
 * Usage:
 *   node scripts/clearAllReviews.js
 * 
 * Make sure to run this from the backend directory where the .env file is located.
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import the Agent model
const Agent = require('../models/Agent');

async function clearAllReviews() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    
    // Connect to MongoDB using the same connection string as the main app
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('🔍 Finding all agents...');
    
    // Get all agents
    const agents = await Agent.find({});
    console.log(`📊 Found ${agents.length} agents in the database`);

    if (agents.length === 0) {
      console.log('ℹ️  No agents found in the database');
      return;
    }

    // Count total reviews before clearing
    let totalReviewsCount = 0;
    agents.forEach(agent => {
      if (agent.reviewsList && agent.reviewsList.length > 0) {
        totalReviewsCount += agent.reviewsList.length;
      }
    });

    console.log(`📝 Total reviews to be cleared: ${totalReviewsCount}`);

    if (totalReviewsCount === 0) {
      console.log('ℹ️  No reviews found to clear');
      return;
    }

    // Ask for confirmation (in a real script, you might want to add readline for user input)
    console.log('⚠️  WARNING: This will permanently delete ALL reviews from ALL agents!');
    console.log('   This action cannot be undone.');
    
    // For safety, let's add a simple check
    const shouldProceed = process.argv.includes('--confirm');
    
    if (!shouldProceed) {
      console.log('❌ Operation cancelled.');
      console.log('   To proceed, run: node scripts/clearAllReviews.js --confirm');
      return;
    }

    console.log('🧹 Clearing all reviews...');

    // Update all agents to remove reviews and reset ratings
    const result = await Agent.updateMany(
      {}, // Match all documents
      {
        $set: {
          reviewsList: [],
          rating: 0,
          comments: 0
        }
      }
    );

    console.log('✅ All reviews cleared successfully!');
    console.log(`📊 Updated ${result.modifiedCount} agents`);
    console.log(`🗑️  Removed ${totalReviewsCount} reviews total`);

    // Verify the operation
    const verificationAgents = await Agent.find({});
    const remainingReviews = verificationAgents.reduce((total, agent) => {
      return total + (agent.reviewsList ? agent.reviewsList.length : 0);
    }, 0);

    if (remainingReviews === 0) {
      console.log('✅ Verification successful: All reviews have been cleared');
    } else {
      console.log(`⚠️  Verification warning: ${remainingReviews} reviews still remain`);
    }

  } catch (error) {
    console.error('❌ Error clearing reviews:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    console.log('🔌 Closing database connection...');
    await mongoose.connection.close();
    console.log('👋 Done!');
  }
}

// Handle script execution
if (require.main === module) {
  console.log('🚀 Starting Clear All Reviews Script...');
  console.log('=' .repeat(50));
  
  clearAllReviews()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = clearAllReviews;
