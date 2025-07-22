const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Create transporter using SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendContactFormEmail(contactData) {
    const { name, email, subject, message } = contactData;
    
    // Email content for the recipient (daveh.day@capgemini.com)
    const recipientMailOptions = {
      from: `"SAGE Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'daveh.day@capgemini.com',
      subject: `SAGE Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0056b3; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">SAGE Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #0056b3; margin-top: 0;">New Contact Form Submission</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0056b3; border-radius: 4px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">This email was sent from the SAGE (Sogeti Agent Exchange) contact form.</p>
            <p style="margin: 5px 0 0 0;">Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
SAGE Contact Form Submission

Contact Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Auto-reply email for the person who submitted the form
    const autoReplyMailOptions = {
      from: `"SAGE Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting SAGE - We\'ve received your message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0056b3; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">SAGE - Sogeti Agent Exchange</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #0056b3;">Thank you for reaching out!</h2>
            
            <p>Dear ${name},</p>
            
            <p>We've successfully received your message regarding "<strong>${subject}</strong>" and appreciate you taking the time to contact us.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
              <ul style="color: #555;">
                <li>Our team will review your message within 1-2 business days</li>
                <li>We'll respond to your inquiry at <strong>${email}</strong></li>
                <li>For urgent matters, you may also reach out to us directly</li>
              </ul>
            </div>
            
            <p>In the meantime, feel free to explore our AI agent catalog and discover the solutions that can help transform your business.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit SAGE Platform
              </a>
            </div>
            
            <p>Best regards,<br>
            <strong>The SAGE Team</strong><br>
            Sogeti Agent Exchange</p>
          </div>
          
          <div style="background-color: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
Dear ${name},

Thank you for reaching out to SAGE (Sogeti Agent Exchange)!

We've successfully received your message regarding "${subject}" and appreciate you taking the time to contact us.

What happens next?
- Our team will review your message within 1-2 business days
- We'll respond to your inquiry at ${email}
- For urgent matters, you may also reach out to us directly

In the meantime, feel free to explore our AI agent catalog and discover the solutions that can help transform your business.

Best regards,
The SAGE Team
Sogeti Agent Exchange

---
This is an automated response. Please do not reply to this email.
      `
    };

    try {
      // Send both emails
      const recipientResult = await this.transporter.sendMail(recipientMailOptions);
      const autoReplyResult = await this.transporter.sendMail(autoReplyMailOptions);
      
      return {
        success: true,
        recipientMessageId: recipientResult.messageId,
        autoReplyMessageId: autoReplyResult.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'SMTP connection verified' };
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();
