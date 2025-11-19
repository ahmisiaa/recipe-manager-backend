require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');

// We will create these files in the next step
const userRoutes = require('./routes/userRoutes'); 

const app = express();
const port = process.env.PORT || 4000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// --- ROUTES ---
// This line links the authentication logic to your app
app.use('/api/users', userRoutes); 

// Basic Route for testing the server status
app.get('/', (req, res) => {
    res.send('Recipe Vault API is running!');
});

// --- DATABASE CONNECTION & SERVER START ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // Start the server ONLY if the DB connection is successful
        app.listen(port, () => {
            console.log(`Server connected to MongoDB and running on port: ${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error.message);
    });