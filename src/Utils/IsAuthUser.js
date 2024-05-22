import jwt from 'jsonwebtoken';

const IsAuthUser = (req, res, next) => {
    // Check if authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    // Extract token from authorization header
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing from authorization header' });
    }
    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Attach user information to request object
        req.user = decodedToken;
        next();
    });
};
export { IsAuthUser };
