const User = require('../models/User'); // Get the User data structure (Schema)
const bcrypt = require('bcrypt');       // Tool to securely hash passwords
const jwt = require('jsonwebtoken');    // Tool to create secure login tokens

/**
 * Function to handle user registration (creating a new account)
 */
const registerUser = async (req, res) => {
    // Get username, email, and password from the request body (the data sent by the user)
    const { username, email, password } = req.body;

    try {
        // 1. Check if a user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If yes, send an error and stop the process
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // 2. Hash the password for security
        // 'salt' is random data added to the password before hashing. 10 is the strength level.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create a new User object with the HASHED password
        const newUser = new User({
            username,
            email,
            password: hashedPassword, 
        });

        // 4. Save the new user record to the MongoDB database
        const savedUser = await newUser.save();
        
        // 5. Send a success response back, excluding the password
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });

    } catch (error) {
        // If anything goes wrong (e.g., database failure), send a generic server error
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

/**
 * Function to handle user login (authenticating an existing user)
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Find the user in the database by email
        // We use .select('+password') to force Mongoose to fetch the password hash (which is normally hidden)
        const user = await User.findOne({ email }).select('+password'); 

        if (!user) {
            // If no user is found, reject the login
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        // 2. Compare the password the user typed with the HASHED password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // If the hashes don't match, reject the login
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        // 3. Create a JSON Web Token (JWT) - this is the "ticket" the user gets for access
        const token = jwt.sign(
            { id: user._id }, // The ID of the user is stored inside the token
            process.env.JWT_SECRET, // The secret key from your .env file is used to sign the token
            { expiresIn: '30d' } // The token will be valid for 30 days
        );

        // 4. Send the login token and user details back
        res.json({
            message: 'Login successful',
            token: token,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error during login.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};