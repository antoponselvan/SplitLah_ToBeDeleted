const express = require("express")
const groupRouter = express.Router()

const {registerGroup, updateGroup, getGroupsSummary, getGroupDetails, deleteGroup} = require("../controllers/groupController")
const {protect} = require("../middleware/protect")

groupRouter.post('/register', protect, registerGroup)
groupRouter.put('/edit', protect, updateGroup)
groupRouter.get('/summary', protect, getGroupsSummary)
groupRouter.post('/details',protect, getGroupDetails)
groupRouter.delete('/delete', protect, deleteGroup)

module.exports = groupRouter