import statusCodes from 'http-status-codes';

export  const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        console.log(req.user);
        if(!req.user){
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: No user information found' });
        }
        const userRole = req.user.role
        console.log(userRole);
        if(!allowedRoles.includes(userRole)){
            return res.status(
                statusCodes.FORBIDDEN).json({
                message: 'Forbidden: You do not have access to this resource'
            });
        }
        next();
    };
};

