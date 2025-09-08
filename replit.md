# Overview

This is an Express.js-based Student-Teacher Portal web application that provides user authentication and role-based access. The application features a modern dark-themed interface with login and registration functionality, supporting both students and teachers as distinct user roles. The system is designed to be the foundation for educational collaboration tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Express.js web framework with Sequelize ORM for database operations
- **Database**: PostgreSQL with environment-based configuration for development
- **Authentication**: Username/email-based login with bcryptjs password hashing
- **Validation**: Express-validator for input validation and sanitization
- **API Design**: RESTful JSON endpoints for frontend-backend communication
- **Deployment**: Node.js server ready for autoscale deployment

## Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap 5 for responsive UI
- **Styling**: Custom CSS with CSS variables for dark theme consistency
- **JavaScript**: Vanilla JavaScript with modular functionality for form handling
- **UI Components**: Tab-based navigation, real-time form validation, and password strength indicators
- **Icons**: Font Awesome integration for visual elements

## Database Schema
- **User Model**: PostgreSQL table storing user credentials, profile information, and role assignment
- **Role System**: Simple ENUM-based roles ('student' or 'teacher') for access control
- **Security**: Password hashing with bcryptjs secure methods
- **Timestamps**: Created_at tracking for user registration
- **Constraints**: Unique constraints on username and email fields for performance and data integrity

## Security Features
- **Password Hashing**: bcryptjs with salt rounds for secure password storage
- **Input Validation**: Express-validator with comprehensive server-side validation
- **Data Sanitization**: Automatic trimming and case normalization
- **Error Handling**: Comprehensive logging and user-friendly error messages

# Recent Changes

## September 08, 2025 - Backend Migration to Express.js & PostgreSQL
- Successfully converted backend from Flask (Python) to Express.js (Node.js)
- Migrated database from MongoDB to PostgreSQL with environment-based configuration
- Created PostgreSQL User model with Sequelize ORM
- Converted all MongoDB/Mongoose queries to PostgreSQL/Sequelize
- Implemented bcryptjs for password hashing (replacing Werkzeug)
- Added express-validator for comprehensive input validation
- Updated workflows for PostgreSQL and Express server
- Configured autoscale deployment for Node.js application

# External Dependencies

## Core Dependencies
- **Express.js**: Web framework and application server
- **Sequelize**: PostgreSQL ORM for database operations
- **pg**: PostgreSQL client for Node.js
- **bcryptjs**: Password hashing and security
- **express-validator**: Input validation and sanitization
- **cors**: Cross-origin resource sharing middleware
- **dotenv**: Environment variable management

## Frontend Dependencies
- **Bootstrap 5**: CSS framework via CDN
- **Font Awesome 6**: Icon library via CDN

## Development Tools
- **Nodemon**: Development server with auto-restart
- **NPM**: Node.js package manager for dependency management
- **Console Logging**: Built-in Node.js logging for debugging
- **Environment Variables**: Configuration management for database URLs and settings

## Database Support
- **PostgreSQL**: Relational database with environment-based configuration
- **Sequelize ORM**: Object Relational Mapping for PostgreSQL operations
- **Auto-constraints**: Unique constraints and validations managed by Sequelize
- **Connection Management**: Automatic connection pooling and error handling