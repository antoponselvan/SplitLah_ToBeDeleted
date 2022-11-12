
const Transaction = require('../models/transaction')
const User = require('../models/user')
const Group = require('../models/group')

const getPaidTransactions = async (req,res) => {
// req should contain - userID and groupID
    try {
        const userId = req.session.userId
        const groupId = req.body.groupId
        const pageNum = req.body.pageNum - 1
        const paidTransactionListRaw = await Transaction.find({groupId, paidBy:userId},["receivedBy","amount","description","createdAt","updatedAt"],{limit:10,skip:(10*pageNum), sort:{"updatedAt":-1}})

        const paidTransactionList = []
        for (const transactionRaw of paidTransactionListRaw){
            const transaction = transactionRaw.toObject()
            const nameRecord = await User.findById(transaction.receivedBy,["name"])
            transaction.receivedByName = nameRecord.name
            paidTransactionList.push(transaction)
        }

        res.status(200).json(paidTransactionList)
    } catch(error){
        console.log(error)
        res.status(500).json({msg: "Unknown Server Error"})
    }    
}

const getReceivedTransactions = async (req,res) => {
    // req should contain - userID and groupID
    try {
        const userId = req.session.userId
        const groupId = req.body.groupId
        const pageNum = req.body.pageNum - 1
        const receivedTransactionListRaw = await Transaction.find({groupId, receivedBy:userId},["paidBy","amount","description","createdAt","updatedAt"],{limit:10, skip:(10*pageNum), sort:{"updatedAt":-1}})
        const receivedTransactionList = []
        for (const transactionRaw of receivedTransactionListRaw) {
            const transaction = transactionRaw.toObject()
            const nameRecord = await (User.findById(transaction.paidBy))
            transaction.paidByName = nameRecord.name
            receivedTransactionList.push(transaction)
        }
        console.log("Txn list", receivedTransactionList)
        res.status(200).json(receivedTransactionList)
    }catch (error){
        console.log(error)
        res.status(500).json({msg: "Unknown Server Error"})
    }
    }
    
const registerTransaction = async (req,res) => {
// req should contain - All schema entries of "Transaction" collection
    try {
        const createdBy = req.session.userId
        const paidBy = req.body.paidBy
        const receivedBy = req.body.receivedBy
        const amount = req.body.amount
        const description = req.body.description
        const groupId = req.body.groupId
        const userListRaw = (await Group.findById(groupId)).toObject().userList
        const userList = userListRaw.map((user)=>user.toString())
        console.log(userList)
        console.log(createdBy, paidBy, receivedBy)
        if ((userList.find((user)=>(user===createdBy))) && (userList.find((user)=>(user===paidBy))) && (userList.find((user)=>(user===receivedBy)))) {
            const newTransaction = (await Transaction.create({createdBy, paidBy, receivedBy, amount, description, groupId})).toObject()
            res.status(201).json({msg:"Txn successfully created", ...newTransaction})
            return
        }      
        res.status(400).json({msg: "One of users doesnt belong to this group"})

    } catch(error){
        console.log(error)
        res.status(500).json({
            msg: "Unknown server Error"
        })
    }
}

const updateTransaction = (req, res) => {
// req should contain - All schema entries of "Transaction" collection
}

module.exports = {getPaidTransactions, getReceivedTransactions, registerTransaction, updateTransaction}