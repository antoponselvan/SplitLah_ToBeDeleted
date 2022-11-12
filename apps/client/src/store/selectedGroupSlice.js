import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    groupId: "",
    name:"",
    description:"",
    netAmount: {paid:0, received:0, netToReceive:0},
    userList:[{id:"",name:"",email:"" ,amountToReceive:0}],
    
}

const selectedGroupSlice = createSlice({
    name: "selectedGroup",
    initialState,
    reducers: {
        updateSelectedGroup: (state, action) => {
            state.groupId = action.payload.groupId
            state.name = action.payload.name
            state.description = action.payload.description
            state.netAmount = action.payload.netAmount
            state.netAmount.netToReceive = (action.payload.netAmount.paid) - (action.payload.netAmount.received)
            state.userList = action.payload.userList
        }
    }
})

export const selectedGroupActions = selectedGroupSlice.actions
export default selectedGroupSlice.reducer