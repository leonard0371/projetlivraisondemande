import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./reducers/patientSlice";
import projectReducer from "./reducers/projectSlice";
import cartReducer from "./reducers/cartSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
    reducer: {
        show: patientReducer,
        project: projectReducer,
        cart: cartReducer,
        currentUser:userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
