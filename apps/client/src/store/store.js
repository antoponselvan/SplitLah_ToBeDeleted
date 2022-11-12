import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import userSummaryReducer from './userSummarySlice'
import groupSummaryReducer from './groupSummarySlice'
import selectedGroupReducer from './selectedGroupSlice'
import transactionListReduer from './transactionListSlice'
import selectedTransactionReducer from './selectedTransactionSlice'

const store = configureStore({
    reducer: {
        user:userReducer,
        userSummary: userSummaryReducer,
        groupSummary: groupSummaryReducer,
        selectedGroup: selectedGroupReducer,
        transactionList: transactionListReduer,
        selectedTransaction: selectedTransactionReducer
    }
})

export default store