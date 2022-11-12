
const User = require('../models/user')
const Group = require("../models/group")
const Transaction = require("../models/transaction")

const registerGroup = async (req, res) => {
// req should contain - All schema entries of "Group" collection
const name = req.body.name
const userList = req.body.userList
const description = req.body.description
if ((!name)||(!userList)) {
    res.status(400).json({msg: "Inadequate Details to register a group"})
    return
}

let invalidUserId = false
userList.forEach(async (userId)=>{
    const user = await User.findById(userId)
    if (!user) {
        res.status(400).json({msg: "Inaccurate user ID details"})
        invalidUserId = true
        return
    }
})
if (invalidUserId) {return}

try {
    const newGroup = await Group.create({name, userList, description})
    res.status(201).json({msg:"New group registed",
    name: newGroup.name})
} catch (error) {
    res.status(500).json({msg: "Some Server Error"})
}
}


const updateGroup = async (req, res) => {
// req should contain - All schema entries of "Group" collection
    const id = req.body.id;
    const name = req.body.name
    const description = req.body.description
    const userList = req.body.userList

    try {

        if ((!id)||(!name)||(!userList)) {
            res.status(400).json({
                msg: "Inadequate Details to update group"
            })
            return
        }
        const group = await Group.findById(id)
        if (!group){
            res.status(400).json({
                msg: "No group found for given ID"
            })
            return
        }
        const invalidUserId = false
        userList.forEach((userId) => {
            const user = User.findById(userId)
            if (!user){
                invalidUserId = true
                res.status(400).json({
                    msg: "Inaccurate user ID details"
                })
                return
            }
        }) 
        if (invalidUserId) {return}
        
        group.name = name
        group.description = description
        group.userList = userList
        await group.save()
        res.status(202).json({msg: "Group Updated", name:group.name})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Server Error"})
    }
}

const getTransactions = async (userId, groupId) => {
    try{
        const transactions = {}

        const  receivedTransactionDocuments = await Transaction.find({receivedBy:userId, groupId:groupId})
        const receivedTransactions = {}
        receivedTransactionDocuments.forEach((transaction)=>{
            if (receivedTransactions[String(transaction.paidBy)]){
                receivedTransactions[String(transaction.paidBy)].push(transaction.amount)
            } else {
                receivedTransactions[String(transaction.paidBy)] = [transaction.amount]
            }
        })
        transactions.recevedAmounts = receivedTransactions
        
        const paidTransactionsDocuments = await Transaction.find({paidBy:userId, groupId:groupId})
        const paidTransactions = {}
        paidTransactionsDocuments.forEach((transaction)=>{
            if (paidTransactions[String(transaction.receivedBy)]){
                paidTransactions[String(transaction.receivedBy)].push(transaction.amount)
            } else {
                paidTransactions[String(transaction.receivedBy)] = [transaction.amount]
            }
        })

        return {receivedTransactions, paidTransactions}
    }catch (error){
        res.status(500).json({msg:"Transaction collection Error"})
    }
}

const getGroupsSummary = async (req, res) => {
// req should contain - UserID
    try {
        const userId = req.body.userId
        if (!userId){
            res.status(400).json({msg: "No UserID found"})
            return
        }
        const user = await User.findById(userId)
        if (!user){
            res.status(400).json({msg: "Invalid UserID"})
            return
        }
        const groups = await Group.find({
            userList : { $all : [userId]}
        })
        const groupsSummaryList = []
        for (const group of groups){
            const transactions = await getTransactions(userId, group._id)
            const groupSummary = {}
            groupSummary.id = group._id
            groupSummary.name = group.name

            let [amountReceived, amountPaid] = [0,0]
            for (const user in transactions.receivedTransactions){
                amountReceived = amountReceived + transactions.receivedTransactions[user].reduce((prev,curr)=>(prev+curr),0)
            }
            for (const user in transactions.paidTransactions){
                amountPaid = amountPaid + transactions.paidTransactions[user].reduce((prev,curr)=>(prev+curr),0)
            }
            groupSummary.amountToReceive = amountPaid - amountReceived
            groupsSummaryList.push(groupSummary)
        }
        res.status(200).json(groupsSummaryList)
    } catch (error){
        res.status(500).json({msg: "Server Error"})
    }
}

const getGroupDetails = async (req,res) => {
// req should contain - UserID and GroupID
    try{
        const userId = req.body.userId
        // const loggedInUser = await User.findById(userId)
        const groupId = req.body.groupId
        if (!groupId) {
            res.status(400).json({msg: "No group ID found"})
        }
    
        const transactions = await getTransactions(userId, groupId)
        // const users = [... new Set(Object.keys(transactions.receivedTransactions).concat(Object.keys(transactions.paidTransactions)))]
        const users = (await Group.findById(groupId)).userList
        const {name, description} = (await Group.findById(groupId, ["name", "description"]))
        const groupDetails = {name,
            description,
            netAmount: {paid:0, received:0},
            userDetails: []}
    
        for (const user of users){
            const userDetails = {}
            userDetails.id = user
            const {name, email} = await User.findById(user, ["name", "email"])
            userDetails.name = name
            userDetails.email = email
            const amountReceived = transactions.receivedTransactions[user]?.reduce((prev,curr)=>(prev+curr),0) || 0
            groupDetails.netAmount.received += amountReceived
            const amoutPaid = transactions.paidTransactions[user]?.reduce((prev,curr)=>(prev+curr),0) || 0
            groupDetails.netAmount.paid += amoutPaid
            userDetails.amountToRecieve = amoutPaid-amountReceived
            groupDetails.userDetails.push(userDetails)
        }
        res.status(200).json(groupDetails)

    } catch (error) {
        res.status(500).json({msg: "Server Error"})
    }
}

const deleteGroup = async (req, res) => {
    const id = req.body.id;
    try {
        const group = await Group.findByIdAndDelete(id)
        
        if (group === null) {
            res.status(400).json({
                msg: "Wrong ID"
            })
        } else {
            res.status(200).json({
                msg: "Successfully deleted group:", name: group.name 
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: "Server error"
        })
    }
}

module.exports = {registerGroup, updateGroup, getGroupsSummary, getGroupDetails, deleteGroup}

