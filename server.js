require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose'); 

// Import the route files
const userRoutes = require('./routes/userRoutes'); 
const recipeRoutes = require('./routes/recipeRoutes'); 

const app = express();
const port = process.env.PORT || 5000; 

// --- MIDDLEWARE ---
// Body parser middleware for JSON data
app.use(express.json()); 

// --- ROUTES ---
app.get('/', (req, res) => {
    res.send('Recipe Vault API is running!');
});

// User authentication routes (Registration, Login)
app.use('/api/users', userRoutes); 

// Recipe CRUD routes (Create, Read, Update, Delete)
app.use('/api/recipes', recipeRoutes); // <--- Line 29 (the point of the error)

// --- DATABASE CONNECTION & SERVER START ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Server connected to MongoDB and running on port: ${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error.message);
    });