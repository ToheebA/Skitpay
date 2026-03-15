const { UnauthorizedError } = require('../errors');

const authenticationRole = (...allowedRoles) => {
    return (req, res, next) => {
        // console.log('Role middleware hit')
        // console.log('req.user:', req.user)
        // console.log('allowedRoles:', allowedRoles)
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            throw new UnauthorizedError('Access denied');
        }
        next();
    };
};

module.exports = authenticationRole;