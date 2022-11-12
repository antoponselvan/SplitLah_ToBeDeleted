
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Group = require('../models/group')
const Transaction = require('../models/transaction')

const userData = require('../misc/seedData/userData')
const groupData = require('../misc/seedData/groupData')
const transactionData = require('../misc/seedData/transactionData')

const seedDbdata = async (req,res) => {

    // Populate User collection
    try {
        await User.deleteMany({})
        userData.forEach((user)=>{user.password=bcrypt.hashSync(user.password,10)})
        await User.create(userData)
        // res.json(updatedData)
    } catch (error) {
        res.status(500).json({msg: "Failed at User Collection seeding",
            error})
    }  

    try {
        const userA = await User.findOne({name: "A"}).exec()
        const userB = await User.findOne({name: "B"}).exec()
        const userC = await User.findOne({name: "C"}).exec()
        // Populate Group Collection
        try {
            // populate groupData with user id
            groupData[0].userList = [userA._id, userB._id]
            groupData[1].userList = [userB._id, userC._id]
            groupData[2].userList = [userC._id, userA._id]

            // console.log(groupData, userA.name)
            // res.json({msg: "UserA"})
            await Group.deleteMany({})
            await Group.create(groupData)
            // res.json({msg: "DataBase Seeding Done"})
        } catch (error){
            res.status(500).json({msg: "Failed at group collection seeding"})
        }


        // Populate Transaction Collection
        try {
            // populate transactionData with groupID and userID
            const groupAB = await Group.findOne({name: "AB"})
            const groupBC = await Group.findOne({name: "BC"})
            const groupCA = await Group.findOne({name: "CA"})

            transactionData[0].groupId= groupAB._id
            transactionData[1].groupId= groupAB._id
            transactionData[2].groupId= groupAB._id
            transactionData[3].groupId= groupBC._id
            transactionData[4].groupId= groupBC._id
            transactionData[5].groupId= groupBC._id
            transactionData[6].groupId= groupCA._id
            transactionData[7].groupId= groupCA._id
            transactionData[8].groupId= groupCA._id

            transactionData[0].createdBy = userA._id
            transactionData[0].paidBy = userA._id
            transactionData[0].receivedBy = userB._id
            transactionData[1].createdBy = userB._id
            transactionData[1].paidBy = userB._id
            transactionData[1].receivedBy = userA._id
            transactionData[2].createdBy = userA._id
            transactionData[2].paidBy = userA._id
            transactionData[2].receivedBy = userB._id

            transactionData[3].createdBy = userB._id
            transactionData[3].paidBy = userB._id
            transactionData[3].receivedBy = userC._id
            transactionData[4].createdBy = userC._id
            transactionData[4].paidBy = userC._id
            transactionData[4].receivedBy = userB._id
            transactionData[5].createdBy = userB._id
            transactionData[5].paidBy = userB._id
            transactionData[5].receivedBy = userC._id

            transactionData[6].createdBy = userC._id
            transactionData[6].paidBy = userC._id
            transactionData[6].receivedBy = userA._id
            transactionData[7].createdBy = userA._id
            transactionData[7].paidBy = userA._id
            transactionData[7].receivedBy = userC._id
            transactionData[8].createdBy = userC._id
            transactionData[8].paidBy = userC._id
            transactionData[8].receivedBy = userA._id

            await Transaction.deleteMany({})
            await Transaction.create(transactionData)
            res.status(201).json({msg: "Seeding Completed!"})
        }catch (error) {
            res.status(500).json({msg: "Failed at Transaction Collection creation"})
        }
    } catch (error) {
        res.status(500).json({msg: "Error while finding userID based on name"})
    }
}

module.exports = seedDbdata