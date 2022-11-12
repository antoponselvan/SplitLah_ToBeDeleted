const express =require("express")
const transactionRouter = express.Router()
const {getPaidTransactions, getReceivedTransactions, registerTransaction, updateTransaction} = require('../controllers/transactionController')
const {protect} = require("../middleware/protect")

transactionRouter.post('/paid', protect, getPaidTransactions)
transactionRouter.post('/received', protect, getReceivedTransactions)
transactionRouter.post('/register', protect, registerTransaction)
transactionRouter.put('/', protect, updateTransaction)

module.exports = transactionRouter