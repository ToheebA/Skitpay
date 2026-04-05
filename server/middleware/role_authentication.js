const { UnauthorizedError } = require('../errors');

const authenticationRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            throw new UnauthorizedError('Access denied');
        }
        next();
    };
};

module.exports = authenticationRole;