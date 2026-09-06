const adminMiddleware = (req, res, next) => {
    // Check if user exists (set by authMiddleware)
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "You are not authenticated!"
        });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    // User is admin, proceed
    next();
};

module.exports = adminMiddleware;