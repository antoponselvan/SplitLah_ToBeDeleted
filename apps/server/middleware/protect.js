
const protect = async (req,res,next) => {
    if (!req.session.userId){
        res.status(401).json({
            msg: "Unauthorized!"
        })
        return
    }
    req.body.userId = req.session.userId
    next()
}

module.exports = {protect}