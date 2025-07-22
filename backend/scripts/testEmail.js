#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * 
 * This script tests the email configuration for the SAGE contact form.
 * Run with: npm run test-email
 */

require('dotenv').config();
const emailService = require('../services/emailService');

async function testEmailConfiguration() {
  console.log('🧪 Testing SAGE Email Configuration...\n');
  
  // Check if required environment variables are set
  console.log('📋 Checking environment variables:');
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_EMAIL'];
  let missingVars = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.log('📝 Please check your .env file and copy from .env.example if needed.');
    process.exit(1);
  }
  
  console.log('\n🔗 Testing SMTP connection...');
  
  try {
    const connectionTest = await emailService.testConnection();
    
    if (connectionTest.success) {
      console.log('✅ SMTP connection successful!');
    } else {
      console.log('❌ SMTP connection failed:', connectionTest.message);
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ SMTP connection error:', error.message);
    process.exit(1);
  }
  
  // Ask if user wants to send a test email
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('\n📧 Would you like to send a test email? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n📤 Sending test email...');
      
      try {
        const testContactData = {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Email Configuration Test',
          message: 'This is a test message to verify the email configuration is working correctly.'
        };
        
        const emailResult = await emailService.sendContactFormEmail(testContactData);
        
        if (emailResult.success) {
          console.log('✅ Test email sent successfully!');
          console.log(`📧 Notification email ID: ${emailResult.recipientMessageId}`);
          console.log(`📧 Auto-reply email ID: ${emailResult.autoReplyMessageId}`);
          console.log(`📬 Check ${process.env.CONTACT_EMAIL} for the notification email.`);
        } else {
          console.log('❌ Test email failed');
        }
      } catch (error) {
        console.log('❌ Test email error:', error.message);
      }
    }
    
    console.log('\n🎉 Email configuration test completed!');
    console.log('💡 You can now use the contact form with email notifications.');
    rl.close();
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Test cancelled by user.');
  process.exit(0);
});

// Run the test
testEmailConfiguration().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
