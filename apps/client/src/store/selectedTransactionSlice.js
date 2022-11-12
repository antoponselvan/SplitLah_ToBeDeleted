import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    createdBy:"",
    paidBy:{id:"",name:"",email:""},
    receivedBy:{id:"",name:"",email:""},
    amount:"",
    description:"",
    createdDateTime:"",
    updatedDateTime:"",
    navigatedFromSettleUp: false,
}

const selectedTransactionSlice = createSlice({
    name: "selectedTransaction",
    initialState,
    reducers:{
        updateSelectedTransaction : (state, action) => {

        },
        setNavigationFlagTrue : (state) => {
            state.navigatedFromSettleUp = true
        },
        setNavigationFlagFalse : (state) => {
            state.navigatedFromSettleUp = false
        },
        updatePartialTransaction : (state, action) => {
            state.paidBy = action.payload.paidBy
            state.receivedBy = action.payload.receivedBy
            state.amount = action.payload.amount
            state.description = action.payload.description
        }
    }
})

export const selectedTransactionActions = selectedTransactionSlice.actions
export default selectedTransactionSlice.reducer