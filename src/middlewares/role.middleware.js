const statusCodes = require('http-status-codes');

const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: No user information found' });
        }
        userRole = req.user.role
        if(!allowedRoles.includes(userRole)){
            return res.status(
                statusCodes.FORBIDDEN).json({
                message: 'Forbidden: You do not have access to this resource'
            });
        }
        next();
    };
};

module.exports = authorizeRoles;