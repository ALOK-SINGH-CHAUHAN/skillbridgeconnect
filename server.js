const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

// Routes

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, userType } = req.body;

        // Validation
        if (!username || !email || !password || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (!['student', 'teacher', 'sponsor'].includes(userType)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user type' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username or email already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING id, username, email, user_type, created_at',
            [username, email, hashedPassword, userType]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { usernameEmail, password } = req.body;

        // Validation
        if (!usernameEmail || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username/email and password are required' 
            });
        }

        // Find user by username or email
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $1',
            [usernameEmail]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const user = userResult.rows[0];

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Login successful - return user data (excluding password)
        const { password: _, ...userData } = user;

        res.json({
            success: true,
            message: 'Login successful',
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Get all users (for testing - returns only username for easy rendering)
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT username FROM users ORDER BY created_at DESC');
        res.json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching users' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;