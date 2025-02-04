// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define the port
const PORT = process.env.PORT || 3000;

// In-memory database for comments
let comments = [];

// Load existing comments from file if it exists
const commentsFilePath = path.join(__dirname, 'comments.json');
if (fs.existsSync(commentsFilePath)) {
    const fileData = fs.readFileSync(commentsFilePath);
    comments = JSON.parse(fileData);
}

// Save comments to file
function saveComments() {
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
}

// Routes

// Get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Submit a comment
app.post('/comments', (req, res) => {
    const { name, email, comment } = req.body;
    if (!name || !email || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newComment = { id: comments.length + 1, name, email, comment };
    comments.push(newComment);
    saveComments();
    res.status(201).json(newComment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    comments.splice(index, 1);
    saveComments();
    res.status(204).send();
});

// Update a comment
app.put('/comments/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, comment } = req.body;
    const index = comments.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    if (!name || !email || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }
});