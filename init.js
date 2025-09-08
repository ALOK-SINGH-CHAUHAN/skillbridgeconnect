const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initializeDatabase = async () => {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                disability_type VARCHAR(100),
                phone VARCHAR(20),
                date_of_birth DATE,
                address TEXT,
                emergency_contact_name VARCHAR(100),
                emergency_contact_phone VARCHAR(20),
                accessibility_needs TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_verified BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);

        // Create courses table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100) NOT NULL,
                duration_weeks INTEGER,
                difficulty_level VARCHAR(50),
                max_students INTEGER DEFAULT 20,
                instructor_name VARCHAR(100),
                accessibility_features TEXT[],
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);

        // Create enrollments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completion_date TIMESTAMP,
                status VARCHAR(50) DEFAULT 'enrolled',
                progress_percentage INTEGER DEFAULT 0,
                UNIQUE(user_id, course_id)
            )
        `);

        // Create support_tickets table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS support_tickets (
                id SERIAL PRIMARY KEY,
                ticket_id VARCHAR(20) UNIQUE NOT NULL,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                email VARCHAR(255) NOT NULL,
                full_name VARCHAR(200) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                priority VARCHAR(20) DEFAULT 'medium',
                category VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP
            )
        `);

        // Insert sample courses
        const courseCheck = await pool.query('SELECT COUNT(*) FROM courses');
        if (parseInt(courseCheck.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO courses (title, description, category, duration_weeks, difficulty_level, instructor_name, accessibility_features) VALUES
                ('Computer Basics for Beginners', 'Learn fundamental computer skills including file management, basic software use, and internet navigation.', 'Digital Skills', 6, 'Beginner', 'Sarah Johnson', ARRAY['Screen reader compatible', 'Large font support', 'Audio descriptions']),
                ('Internet Navigation and Safety', 'Master safe internet browsing, email usage, and online communication tools.', 'Digital Skills', 4, 'Beginner', 'Mike Chen', ARRAY['High contrast mode', 'Keyboard navigation', 'Voice commands']),
                ('Independent Living Skills', 'Develop essential daily living skills for increased independence and confidence.', 'Life Skills', 8, 'Beginner', 'Dr. Emma Wilson', ARRAY['Visual aids', 'Sign language interpretation', 'Tactile materials']),
                ('Financial Literacy and Budgeting', 'Learn personal finance management, budgeting, and financial planning strategies.', 'Life Skills', 6, 'Intermediate', 'Robert Martinez', ARRAY['Audio content', 'Simple language', 'Interactive tools']),
                ('Resume Writing and Interview Skills', 'Build professional resumes and develop confidence for job interviews.', 'Professional Skills', 4, 'Intermediate', 'Lisa Thompson', ARRAY['Template customization', 'Speech support', 'Practice modules']),
                ('Customer Service Excellence', 'Master customer service skills for various workplace environments.', 'Professional Skills', 5, 'Intermediate', 'James Wilson', ARRAY['Role-play scenarios', 'Clear instructions', 'Flexible pacing']),
                ('Digital Art and Design', 'Explore creative expression through digital art tools and design principles.', 'Creative Arts', 10, 'Beginner', 'Maria Rodriguez', ARRAY['Adaptive tools', 'Color blind friendly', 'Motor skill accommodations']),
                ('Creative Writing Workshop', 'Develop writing skills and express creativity through various writing forms.', 'Creative Arts', 8, 'Beginner', 'David Park', ARRAY['Text-to-speech', 'Grammar assistance', 'Flexible formatting'])
            `);
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = { pool, initializeDatabase };