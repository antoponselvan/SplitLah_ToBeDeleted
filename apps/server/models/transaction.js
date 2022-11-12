
const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    paidBy: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    receivedBy: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    amount: Number,
    description: String,
    groupId : {type: mongoose.Schema.Types.ObjectId, ref:"group"}
}, {
    timestamps:true
})

const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel