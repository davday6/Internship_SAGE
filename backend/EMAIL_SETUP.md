# Email Configuration Setup

This guide explains how to set up email functionality for the SAGE contact form using nodemailer.

## Overview

When a user submits the contact form:
1. The message is saved to the MongoDB database
2. An email notification is sent to `daveh.day@capgemini.com`
3. An auto-reply confirmation email is sent to the user

## Setup Instructions

### 1. Environment Variables

Copy the `.env.example` file to `.env` and fill in your email configuration:

```bash
cp .env.example .env
```

### 2. Email Provider Configuration

#### For Gmail (Recommended for development):

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SMTP_PASS`

3. **Update .env file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password-here
   CONTACT_EMAIL=daveh.day@capgemini.com
   ```

#### For Corporate Email (Capgemini/Sogeti):

Contact your IT department for SMTP settings. Common configurations:

```env
# Example for Office 365
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@capgemini.com
SMTP_PASS=your-password-here
```

### 3. Testing Email Configuration

You can test the email setup using the test endpoint:

```bash
# Test SMTP connection
curl http://localhost:3001/api/contact/test-email
```

Expected response:
```json
{
  "success": true,
  "message": "SMTP connection verified"
}
```

### 4. Contact Form Behavior

- **Success**: Form submission succeeds, emails are sent
- **Email Failure**: Form submission still succeeds (fails gracefully)
- **Database Failure**: Form submission fails with error message

## Email Templates

### Notification Email (to daveh.day@capgemini.com)
- Professional HTML format
- Contains all form data
- Reply-to address set to user's email
- Timestamp included

### Auto-Reply Email (to form submitter)
- Branded SAGE template
- Confirmation of receipt
- Next steps information
- Link back to SAGE platform

## Security Considerations

1. **Never commit .env files** - they contain sensitive credentials
2. **Use App Passwords** instead of regular passwords when possible
3. **Limit SMTP permissions** to sending only
4. **Monitor email usage** to prevent abuse

## Troubleshooting

### Common Issues:

1. **"Invalid login"**:
   - Check SMTP credentials
   - Ensure 2FA and App Password for Gmail
   - Verify SMTP server settings

2. **"Connection timeout"**:
   - Check SMTP host and port
   - Verify network/firewall settings
   - Try different SMTP port (465 vs 587)

3. **"Message rejected"**:
   - Check sender email reputation
   - Verify recipient email addresses
   - Check for spam filters

### Debug Mode:

Set `NODE_ENV=development` in your .env file for detailed error messages.

## Production Deployment

For production environments:

1. Use a dedicated email service (SendGrid, Mailgun, etc.)
2. Set up proper DNS records (SPF, DKIM, DMARC)
3. Monitor email delivery rates
4. Implement rate limiting for form submissions
5. Set up email logging and monitoring

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SECURE` | Use SSL/TLS | `false` |
| `SMTP_USER` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password/app password | `your-app-password` |
| `CONTACT_EMAIL` | Recipient for contact forms | `daveh.day@capgemini.com` |
| `FRONTEND_URL` | Frontend URL for email links | `https://sage.example.com` |
