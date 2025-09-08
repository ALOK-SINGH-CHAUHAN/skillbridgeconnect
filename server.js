const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection with fallback
let pool = null;
let dbConnected = false;

// Initialize database connection
if (process.env.DATABASE_URL) {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        // Test database connection
        pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error('Database connection error:', err);
                console.log('Running in fallback mode without database');
                dbConnected = false;
            } else {
                console.log('Database connected successfully');
                dbConnected = true;
            }
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
        console.log('Running in fallback mode without database');
        dbConnected = false;
    }
} else {
    console.log('No DATABASE_URL provided, running in demo mode');
    dbConnected = false;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// In-memory storage for demo mode (when database is not available)
let users = [];
let nextUserId = 1;

// Routes

// Registration endpoint with fallback
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

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (dbConnected && pool) {
            // Database mode
            try {
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
            } catch (dbError) {
                console.error('Database error during registration:', dbError);
                // Fallback to demo mode if database fails
                dbConnected = false;
            }
        }
        
        if (!dbConnected) {
            // Demo/fallback mode
            const existingUser = users.find(u => u.username === username || u.email === email);
            
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username or email already exists' 
                });
            }

            const newUser = {
                id: nextUserId++,
                username,
                email,
                password: hashedPassword,
                user_type: userType,
                created_at: new Date().toISOString()
            };

            users.push(newUser);

            // Return user without password
            const { password: _, ...userResponse } = newUser;
            res.status(201).json({
                success: true,
                message: 'User registered successfully (Demo Mode)',
                user: userResponse
            });
        }

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration: ' + error.message
        });
    }
});

// Login endpoint with fallback
app.post('/api/login', async (req, res) => {
    try {
        const { usernameEmail, password } = req.body;

        if (!usernameEmail || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username/email and password are required' 
            });
        }

        let user = null;

        if (dbConnected && pool) {
            // Database mode
            try {
                const result = await pool.query(
                    'SELECT * FROM users WHERE username = $1 OR email = $1',
                    [usernameEmail]
                );
                user = result.rows[0] || null;
            } catch (dbError) {
                console.error('Database error during login:', dbError);
                dbConnected = false;
            }
        }
        
        if (!dbConnected) {
            // Demo/fallback mode
            user = users.find(u => u.username === usernameEmail || u.email === usernameEmail);
        }

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Remove password from response
        const { password: userPassword, ...userData } = user;

        res.json({
            success: true,
            message: dbConnected ? 'Login successful' : 'Login successful (Demo Mode)',
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login: ' + error.message
        });
    }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
    try {
        if (dbConnected && pool) {
            // Database mode
            const result = await pool.query('SELECT username FROM users ORDER BY created_at DESC');
            res.json({
                success: true,
                users: result.rows
            });
        } else {
            // Demo mode
            const userList = users.map(u => ({ username: u.username }));
            res.json({
                success: true,
                users: userList,
                mode: 'demo'
            });
        }
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
    res.json({ 
        status: 'OK', 
        database: dbConnected ? 'Connected' : 'Demo Mode',
        timestamp: new Date().toISOString() 
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        database: dbConnected ? 'connected' : 'demo_mode',
        users_count: dbConnected ? 'database' : users.length,
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Database status: ${dbConnected ? 'Connected' : 'Demo Mode'}`);
});