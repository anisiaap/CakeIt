const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('Authenticating token...');
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user data to the request
        console.log('Token authenticated:', decoded);
        next();
    } catch (err) {
        console.log('Token verification failed:', err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        console.log(`Forbidden: User role is ${req.user.role}, required role is ${role}`);
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };
