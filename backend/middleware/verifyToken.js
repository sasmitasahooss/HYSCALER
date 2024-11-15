const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET); // Use the same secret key used in signing
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(400).json({ msg: 'Token is not valid' });
    }
};

module.exports = verifyToken;