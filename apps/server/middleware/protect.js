
const protect = async (req,res,next) => {
    const userId = await req.session.userId
    console.log(userId)
    console.log("Protect Fn Session:",req.session.session)
    if (!userId){
        res.status(401).json({
            msg: "Unauthorized User!"
        })
        return
    }
    req.body.userId = req.session.userId
    next()
}

module.exports = {protect}