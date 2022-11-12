import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    paidTransactionsPageNum:1,
    receivedTransactionsPageNum:1,
    paidTransactions:[{}],
    receivedTransactions:[{}] 
}

const transactionListSlice = createSlice({
    name: "transactionList",
    initialState,
    reducers: {
        updatePaidTransactionList : (state, action) =>{
            state.paidTransactions = action.payload
        },
        updateReceivedTransactionList : (state, action) => {
            state.receivedTransactions = action.payload
        },
        updatePaidTransactionPageNum : (state, action) => {
            state.paidTransactionsPageNum = action.payload
        },
        updateReceivedTransactionPageNum : (state, action) => {
            state.receivedTransactionsPageNum = action.payload
        }
    }
})

export const transactionListActions = transactionListSlice.actions
export default transactionListSlice.reducer