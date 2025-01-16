import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';

const store = configureStore({
    reducer: {
        auth : authReducer,
        products : productReducer,
        cart: cartReducer,
    },
});

export default store;