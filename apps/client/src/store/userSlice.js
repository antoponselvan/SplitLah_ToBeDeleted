import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    id: "",
    name: "",
    email: "",
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateLoggedInUser : (state, action) => {
            // Update state to store details of current logged In user
            console.log("data in action", action.payload)
            state.id = action.payload?.id
            state.name = action.payload?.name
            state.email = action.payload?.email
            // return state
        }
    }
})

export const userActions = userSlice.actions
export default userSlice.reducer
