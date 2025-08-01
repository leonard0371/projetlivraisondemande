import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: {
    }
    
};

export const userSlice = createSlice({
    name: "currentUser",
    initialState,
    reducers: {
        setUserDtails: (state, action) => {
            // console.log(state,action,"inputValueinputValueinputValue")
            state.user = action.payload;
        },
    },
});

export const {
    setUserDtails,
} = userSlice.actions;

export default userSlice.reducer;