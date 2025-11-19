const User = require('../models/User'); 
const bcrypt = require('bcrypt');       
const jwt = require('jsonwebtoken');    

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword, 
        });

        const savedUser = await newUser.save();
        
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email }).select('+password'); 

        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' } 
        );

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