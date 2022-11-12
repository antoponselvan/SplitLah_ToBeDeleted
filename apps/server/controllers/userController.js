const User = require("../models/user")
const Group = require("../models/group")
const Transaction = require("../models/transaction")
const bcrypt = require("bcrypt")

const registerUser = async (req,res)=>{
    // req should contain - All schema entries of "User" collection
    const name = req.body.name;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);
    console.log(name, email, password);
    
    if ((!name)||(!email)||(!password)) {
        res.status(400).json({msg: "Inadequate details to register user"})
        return;
    }
    
    try{
        const existingUser = await User.findOne({email}).exec()
        // Check for existing users with the same email
        if (existingUser) {
            res.status(409).json({msg:"Email has already been used"})
            return
        } else {
            const newUser = await User.create({name, email, password})
            req.session.userId = newUser._id
            res.status(201).json({msg:"New user registered",
            id: newUser._id,
            name: newUser.name})
        }
    }catch (error){
        console.log(error)
        res.status(500).json({msg:"Unknown server error"})
    }
}

const loginUser = async (req, res)=>{
// req should contain - email and password
    const email = req.body.email
    const password = req.body.password
    console.log(email, password)

    if (!email) {
        res.status(400).json({msg: "Login Email-ID cannot be blank"})
        return
    }

    try{
        const user = await User.findOne({email}).exec()
        if (!user) {
            res.status(404).json({msg: "User not found"})
            return
        }

        const loginPass = bcrypt.compareSync(password, user.password)
        if (loginPass){
            req.session.userId = user._id
            res.status(202).json({msg: "Successful Login", 
        id: user._id,
        name: user.name})
        } else {
            req.sesssion.userId = null
            res.status(401).json({msg: "Inaccurate Password"})
        }
    } catch (error) {
        res.status(500).json({msg: "Unknown Server Error"})
    }
}


const updateUser = async (req, res) => {
    // req should contain - All schema entries of "User" collection
    const id = req.body.id
    const name = req.body.name
    const email = req.body.email
    const password = bcrypt.hashSync(req.body.password, 10)

    try {
        if ((!id)||(!name)||(!email)||(!password)) {
            res.status(400).json({
                msg: "Inadequate details to update user"
            })
            return
        }
        const user = await User.findById(id)
        if (!user) {
            res.status(400).json({
                msg: "No user found for given ID"
            })
            return
        }
        const existingUser = await User.findOne({ email: email }).exec()
        // Check for existing users with the same email
        if ((existingUser) && user.email != email) {
            res.status(409).json({msg:"Email has already been used"})
            return
        }
        user.name = name
        user.email = email
        user.password = password
        await user.save()
        res.status(202).json({
            msg: "User updated",
            name: user.name
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Server error"
        })
    }
}


const logoutUser = (req, res) => {
    try{
        if (!req.session.userId){
            res.status(400).json({msg: "No user to log-out"})
            return
        }
        req.session.userId = null
        res.status(202).json({msg: "User successfully logged out!"})
    }catch(error){
        console.log(error)
        res.status(500).json({msg: "Unknown erver error"})
    }
}


const getUserSummary = async (req,res) => {
    try {
        const userId = req.session.userId
        const user = await User.findById(userId, ["name"])
        const groupList = await Group.find({userList : {$all: [userId]}},["name"])
        let transactionReceivedListRaw = await Transaction.find({receivedBy:userId},["_id","paidBy","amount","description","updatedAt"],{limit:10, sort:{updatedAt: -1}})
        const transactionReceivedList = []
        for (let transaction of transactionReceivedListRaw){
            const nameRecord = await User.findById(String(transaction.paidBy), ["name"])
            const paidByName = nameRecord.name
            transaction = transaction.toObject()
            transaction["paidByName"] = paidByName
            transactionReceivedList.push(transaction)
        }
        const transactionPaidListRaw = await Transaction.find({paidBy:userId},["_id","receivedBy","amount","description","updatedAt"],{limit:10, sort:{updatedAt: -1}})
        const transactionPaidList = []
        for (const transactionRaw of transactionPaidListRaw) {
            const transaction = transactionRaw.toObject()
            const nameRecord = await User.findById(transaction.receivedBy)
            const receivedByName = nameRecord.name
            transaction.receivedByName = receivedByName
            transactionPaidList.push(transaction)
        }
        const transactionReceivedAmountList = await Transaction.find({receivedBy:userId},["amount"])
        const transactionPaidAmountList = await Transaction.find({paidBy:userId},["amount"])
        const netReceivedAmount = (transactionReceivedAmountList.map((transaction)=>transaction.amount)).reduce((prev,curr)=>(prev+curr),0)
        const netPaidAmount = (transactionPaidAmountList.map((transaction)=>transaction.amount)).reduce((prev,curr)=>(prev+curr),0)
        res.status(200).json({user, groupList, transactionReceivedList, transactionPaidList, netReceivedAmount,netPaidAmount});

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Unknown Server Error"})
    }
}


const checkLogin = async (req, res)=>{
        try{
            const user = await User.findById(req.session.userId).exec()
            if (!user) {
                res.status(404).json({msg: "User not found"})
                return
            }    
            res.status(200).json({msg: "Login", 
            id: user._id,
            name: user.name,
            email: user.email})
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Unknown Server Error"})
        }
    }

const searchUser = async (req,res) => {
    try{
        console.log(req.body.searchText)
        // const userListRaw = await User.find({$text: {
        //     $search: req.body.searchText,
        //     $caseSensitive: false
        // }})
        const searchText = req.body.searchText
        const userListRaw = await User.find({
            $or: [{email:{$regex: searchText}},{name:{$regex: searchText}}]
        }, null, {
            limit:5
        })
        const userList = userListRaw.map((user)=>{
            return {id: user._id, name:user.name, email:user.email}
        })
        res.status(200).json(userList)
    } catch (error){
        console.log(error)
        res.status(500).json({msg:"Unknown Server Error"})
    }
}

module.exports = {registerUser, loginUser, updateUser, logoutUser, getUserSummary, checkLogin, searchUser}