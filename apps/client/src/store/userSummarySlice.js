import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    groupList: [""]
    , transactionReceivedList:[{id:1, paidByName:"",description:"",amount:0}] 
    , transactionPaidList:[{id:1, receivedByName:"",description:"",amount:0}] 
    , netReceivedAmount:0
    , netPaidAmount:0
    , netAmountToReceive: 0
}

const userSummarySlice = createSlice({
    name:"userSummarySlice",
    initialState,
    reducers: {
        updateUserSummary : (state, action) => {
            console.log(action.payload)
            state.groupList = action.payload.groupList
            state.transactionPaidList = action.payload.transactionPaidList
            state.transactionReceivedList = action.payload.transactionReceivedList
            state.netPaidAmount = action.payload.netPaidAmount
            state.netReceivedAmount = action.payload.netReceivedAmount
            state.netAmountToReceive = (action.payload.netPaidAmount - action.payload.netReceivedAmount)
        }
    }
})

export const userSummaryActions = userSummarySlice.actions
export default userSummarySlice.reducer