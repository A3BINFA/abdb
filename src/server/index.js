require('dotenv').config({ path: './w3s-dynamic-storage/.env' });
const path = require('path');
const express = require('express');
const cors = require('cors');  // ✅ ADD THIS
const { saveMessage, fetchMessages } = require('./db');

const app = express();

// ✅ Enable CORS for all origins (or restrict in production)
app.use(cors({
  origin: '*', // Replace '*' with specific domains if you want to lock down, e.g. ['https://yoursite1.com', 'https://yoursite2.com']
}));

app.use(express.static('dist'));
app.use(express.json());

// POST endpoint for saving messages
app.post('/api/message', async (req, res) => {
  try {
    const status = await saveMessage(req.body);
    const statusCode = status ? 201 : 400;
    res.status(statusCode).send();
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).send();
  }
});

// GET endpoint for fetching recent messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await fetchMessages(20);
    res.send({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send();
  }
});

// Fallback to serve your frontend SPA (index.html) for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

// Start API server on specified port
app.listen(process.env.PORT || 8080, () => console.log(`API listening on port ${process.env.PORT || 8080}!`));