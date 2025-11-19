const express = require('express');
// Import the functions (logic) from the controller file
const { registerUser, loginUser } = require('../controllers/userController'); 

// Create an Express router object
const router = express.Router();

// ROUTE 1: REGISTER USER (Public - anyone can access)
// When a POST request hits /api/users/register, run the registerUser function
router.post('/register', registerUser); 

// ROUTE 2: LOGIN USER (Public - anyone can access)
// When a POST request hits /api/users/login, run the loginUser function
router.post('/login', loginUser);       

module.exports = router;