
import {createSlice} from '@reduxjs/toolkit'

const initialState = [{id:"",name:"",amountToReceive:0}]


const groupSummarySlice = createSlice({
    name: "groupSummary",
    initialState,
    reducers: {
        updateGroupSummary : (state, action) => {            
            return [...action.payload]
        }
    }
})

export const groupSummaryActions = groupSummarySlice.actions
export default groupSummarySlice.reducer