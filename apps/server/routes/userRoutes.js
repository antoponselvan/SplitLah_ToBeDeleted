const express = require("express")
const userRouter = express.Router()
const {registerUser, loginUser, updateUser, logoutUser, getUserSummary, checkLogin, searchUser} = require("../controllers/userController")
const {protect} = require("../middleware/protect")

userRouter.post('/register', registerUser)
userRouter.post('/login',loginUser)
userRouter.put('/edit', protect, updateUser)
userRouter.post('/logout', logoutUser)
userRouter.get('/summary', protect, getUserSummary)
userRouter.get('/checklogin', protect, checkLogin)
userRouter.post('/search',protect, searchUser)

module.exports = userRouter