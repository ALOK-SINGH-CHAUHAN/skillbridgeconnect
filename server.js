const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PostgreSQL connection - supports both local and cloud databases
let DATABASE_URL = process.env.DATABASE_URL;

// If no environment variable is set, use default PostgreSQL URL
if (!DATABASE_URL) {
    DATABASE_URL = 'postgresql://localhost:5432/student_teacher_portal';
    console.log('No DATABASE_URL provided, using default local PostgreSQL');
}

console.log('Attempting to connect to PostgreSQL...');
const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Initialize User model
const UserModel = require('./User')(sequelize);

// Database connection and sync
sequelize.authenticate()
.then(() => {
    console.log('Connected to PostgreSQL successfully');
    return sequelize.sync({ alter: true }); // Use alter: true to update tables without dropping
})
.then(() => {
    console.log('Database tables synchronized');
})
.catch((error) => {
    console.error('PostgreSQL connection error:', error);
    console.error('Please make sure PostgreSQL is running or provide a valid DATABASE_URL environment variable');
});

// Make User model available to routes
app.locals.User = UserModel;

// Import routes
const authRoutes = require('./auth');

// Routes
app.use('/api', authRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

// Serve login/register page
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve student dashboard
app.get('/student-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve teacher dashboard
app.get('/teacher-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher-dashboard.html'));
});

// Serve about us page
app.get('/about-us', (req, res) => {
    res.sendFile(path.join(__dirname, 'about-us.html'));
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});