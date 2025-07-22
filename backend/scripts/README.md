# Backend Scripts

This directory contains utility scripts for managing the SAGE backend database and functionality.

## Available Scripts

- **`clearAllReviews.js`** - Remove all reviews from all agents in the database
- **`addNewAgent.js`** - Add a new agent to the database with interactive or command-line input
- **`testEmail.js`** - Test email configuration for contact form notifications

## Email Testing Script

### Overview
The `testEmail.js` script helps you verify that the email configuration is working correctly for contact form notifications.

### Usage

From the `backend` directory:

```bash
# Test email configuration
npm run test-email
```

This script will:
1. Check if all required environment variables are set
2. Test the SMTP connection
3. Optionally send a test email

**Note:** Make sure your `.env` file is configured with email settings. See `EMAIL_SETUP.md` for detailed setup instructions.

## Add New Agent Script

### Overview
The `addNewAgent.js` script allows you to easily add new agents to the SAGE database. This is useful for:
- Adding new AI agents discovered or developed
- Populating the database with agent data
- Bulk agent creation during initial setup

### Usage

#### Method 1: Using npm scripts (Recommended)

From the `backend` directory:

```bash
# Interactive mode - prompts for all agent information
npm run add-agent

# Show help information
npm run add-agent-help
```

#### Method 2: Interactive Mode

From the `backend` directory:

```bash
node scripts/addNewAgent.js
```

This will prompt you for each required field:
- Agent Title
- Domain (e.g., "Business Services", "Healthcare", "Software Development")
- Subdomain (e.g., "Financial Services", "Data Analytics", "Code Review")
- Description
- Trial URL (optional)
- Comment/Contact URL (optional)

#### Method 3: Command Line Mode

From the `backend` directory:

```bash
node scripts/addNewAgent.js --title "Agent Name" --domain "Domain" --subdomain "Subdomain" --description "Description" [--trialUrl "URL"] [--commentUrl "URL"]
```

#### Method 4: Help Information

```bash
npm run add-agent-help
# or
node scripts/addNewAgent.js --help
```

### Examples

**Interactive Mode:**
```bash
node scripts/addNewAgent.js
```

**Command Line Mode:**
```bash
node scripts/addNewAgent.js \
  --title "Market Analysis AI" \
  --domain "Business Services" \
  --subdomain "Financial Services" \
  --description "AI agent that provides comprehensive market analysis and financial insights using real-time data" \
  --trialUrl "https://market-analysis-ai.com/trial"
```

### Features

- **Input Validation**: Validates all required fields and URLs
- **Duplicate Detection**: Warns if an agent with similar title already exists
- **Auto ID Generation**: Automatically generates unique IDs for new agents
- **Database Verification**: Confirms the agent was successfully saved
- **Interactive Prompts**: User-friendly prompts for all required information
- **Flexible Input**: Supports both interactive and command-line modes

### What the script does

1. Connects to your MongoDB database
2. Validates all input data
3. Checks for duplicate agent titles
4. Generates a unique ID for the new agent
5. Creates and saves the agent to the database
6. Verifies the agent was successfully added
7. Provides confirmation and closes the database connection

### Example Output

```
🚀 Starting Add New Agent Script...
==================================================
💬 Starting interactive mode...

📝 Enter agent information:
========================================
Agent Title: Market Analysis AI
Domain (e.g., "Business Services", "Healthcare", "Software Development"): Business Services
Subdomain (e.g., "Financial Services", "Data Analytics"): Financial Services
Description: AI agent that provides market analysis and insights
Trial URL (optional, press Enter to skip): https://example.com/trial
Comment/Contact URL (optional, press Enter to skip): 

🔗 Connecting to MongoDB...
✅ Connected to MongoDB successfully!

📊 Agent Summary:
========================================
ID: 15
Title: Market Analysis AI
Domain: Business Services
Subdomain: Financial Services
Description: AI agent that provides market analysis and insights
Trial URL: https://example.com/trial
Comment URL: Not provided
========================================
💾 Saving agent to database...
✅ Agent added successfully!
🆔 Agent ID: 15
📝 Title: Market Analysis AI
✅ Verification successful: Agent found in database
🔌 Closing database connection...
👋 Done!

🎉 Agent successfully added to the SAGE database!
   You can now view it in the web application.
```

## Clear All Reviews Script

### Overview
The `clearAllReviews.js` script allows you to remove all reviews from all agents in the database. This is useful for:
- Resetting the database during development
- Cleaning up test data
- Starting fresh with reviews

### Usage

#### Method 1: Using npm scripts (Recommended)

From the `backend` directory:

```bash
# Safe mode - shows what would be deleted but requires confirmation flag
npm run clear-reviews-safe

# Direct execution - immediately clears all reviews (use with caution!)
npm run clear-reviews
```

#### Method 2: Direct node execution

From the `backend` directory:

```bash
# Safe mode - will show warning and exit unless --confirm flag is provided
node scripts/clearAllReviews.js

# With confirmation - will actually clear the reviews
node scripts/clearAllReviews.js --confirm
```

### Safety Features

- **Confirmation Required**: The script requires the `--confirm` flag to actually delete reviews
- **Review Count Display**: Shows how many reviews will be deleted before proceeding
- **Verification**: After clearing, verifies that all reviews were successfully removed
- **Error Handling**: Proper error handling and database connection management

### What the script does

1. Connects to your MongoDB database using the same connection string as the main application
2. Finds all agents in the database
3. Counts total reviews across all agents
4. Displays a warning and requires confirmation
5. Removes all reviews from all agents
6. Resets the `rating` and `comments` count for each agent to 0
7. Verifies the operation was successful
8. Closes the database connection

### Example Output

```
🚀 Starting Clear All Reviews Script...
==================================================
🔗 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
🔍 Finding all agents...
📊 Found 12 agents in the database
📝 Total reviews to be cleared: 47
⚠️  WARNING: This will permanently delete ALL reviews from ALL agents!
   This action cannot be undone.
🧹 Clearing all reviews...
✅ All reviews cleared successfully!
📊 Updated 12 agents
🗑️  Removed 47 reviews total
✅ Verification successful: All reviews have been cleared
🔌 Closing database connection...
👋 Done!
```

### Prerequisites

- Node.js installed
- MongoDB connection configured in `.env` file
- All backend dependencies installed (`npm install`)

### Important Notes

- **⚠️ This operation is irreversible** - once reviews are deleted, they cannot be recovered
- The script uses the same database connection as your main application
- Make sure your `.env` file is properly configured with `MONGODB_URL`
- Always test in a development environment first
- Consider backing up your database before running in production

### Troubleshooting

- **"Cannot find module"**: Make sure you're running the script from the `backend` directory
- **Connection errors**: Verify your `.env` file contains the correct `MONGODB_URL`
- **Permission errors**: Ensure your MongoDB user has write permissions
