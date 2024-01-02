import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "./wallet/walletSlice";

const store = configureStore({
    reducer: {
        wallet: walletSlice
    }
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
export default store;