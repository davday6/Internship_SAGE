# 🔧 Quick Setup Guide for Email Configuration

## Step 1: Update Your Password

Edit the `.env` file and replace `your-capgemini-password-here` with your actual Capgemini email password:

```env
SMTP_PASS=your-actual-password
```

## Step 2: Test the Configuration

Run the test command to verify everything works:

```bash
npm run test-email
```

## Step 3: If You Get Authentication Errors

### For Capgemini/Corporate Email:
1. **Check if you have 2FA enabled** on your Capgemini account
2. **If 2FA is enabled**, you may need to:
   - Contact IT support for SMTP settings
   - Use an App Password instead of your regular password
   - Get approval for external SMTP access

### Alternative: Use Gmail
If corporate email doesn't work, you can use a personal Gmail account:

1. **Update .env file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your-personal-email@gmail.com
   SMTP_PASS=your-gmail-app-password
   ```

2. **Set up Gmail App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use that 16-character password in SMTP_PASS

## Step 4: Test the Contact Form

Once email is working:
1. Start the backend: `npm run dev`
2. Start the frontend (from react-app directory): `npm run dev`
3. Submit a test contact form
4. Check your email for notifications!

## 🔍 Troubleshooting

- **Authentication failed**: Check username/password, try App Password
- **Connection timeout**: Check SMTP host/port settings
- **Corporate restrictions**: Contact IT department for SMTP access

## 📞 Need Help?

If you're having issues, the email functionality is designed to fail gracefully - the contact form will still work and save to the database even if email fails.
