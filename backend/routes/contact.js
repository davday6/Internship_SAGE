const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST /api/contact - Submit a contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required (name, email, subject, message)' 
      });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }

    // Create new contact message
    const contactMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    // Save to database
    await contactMessage.save();

    // Return success response
    res.status(201).json({ 
      message: 'Contact message submitted successfully',
      id: contactMessage._id
    });

  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ 
      message: 'Server error. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/contact - Get all contact messages (for admin use)
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get messages with pagination
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await ContactMessage.countDocuments(query);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/contact/:id/status - Update message status (for admin use)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'read', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Update message status
    const message = await ContactMessage.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ 
      message: 'Status updated successfully',
      contactMessage: message
    });

  } catch (error) {
    console.error('Error updating contact message status:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
