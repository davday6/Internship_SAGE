# Backend Scripts

This directory contains utility scripts for managing the SAGE backend database.

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
