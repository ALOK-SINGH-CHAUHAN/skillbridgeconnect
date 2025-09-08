const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'shaktipath-secret-key-change-in-production';

const auth = (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies.token;
        
        if (!token) {
            const authHeader = req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = auth;