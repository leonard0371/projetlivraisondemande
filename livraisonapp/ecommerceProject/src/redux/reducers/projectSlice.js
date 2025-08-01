import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    productDetail: {
        productName: '',
        productPrice: '',
        productDescription: '',
        prouctFeature: '',
    },
    showNavbar: true,
};

export const projectSlice = createSlice({
    name: "projectData",
    initialState,
    reducers: {
        saveProductDetail: (state, actions) => {
            state.productDetail = actions.payload;
        },
        setShowNavbar: (state, action) => {
            state.showNavbar = action.payload;
        }
    },
});

export const {
    saveProductDetail,
    setShowNavbar,
} = projectSlice.actions;

export default projectSlice.reducer;
