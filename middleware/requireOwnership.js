function requireOwnership(req,res,next){
    if (req.user.id !== req.params.id){
        return res.status(403).json({ message: "Forbidden"});
    }
    next();
}

export default requireOwnership;