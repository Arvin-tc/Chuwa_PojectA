import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCartItems } from "./cartSlice";

export const signUp = createAsyncThunk(
    'auth/signUp',
    async (userData, { rejectWithValue }) => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
    
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Sign-up failed');
          }
    
          return await response.json();
        } catch (error) {
          return rejectWithValue(error.message);
        }
    }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue, dispatch }) => {
      try {
          const response = await fetch("http://localhost:5000/api/auth/signin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
          });

          if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Sign-in failed");
          }

          const data = await response.json();

          // Fetch the user's cart
          const cartResponse = await fetch(`http://localhost:5000/api/auth/cart/${data.user.id}`);
          const cartData = await cartResponse.json();

          if (cartResponse.ok) {
              dispatch(setCartItems(cartData.cart || [])); // Initialize cart in Redux
              console.log("Cart data:", cartData);
              localStorage.setItem("cartItems", JSON.stringify(cartData.items || [])); // Sync with localStorage
          }

          return data;
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);


export const saveCart = createAsyncThunk(
  "auth/saveCart",
  async ({ userId, cartItems }, { rejectWithValue }) => {
      try {
          const response = await fetch("http://localhost:5000/api/auth/save-cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId, cartItems }),
          });

          if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to save cart");
          }

          return await response.json();
      } catch (error) {
          return rejectWithValue(error.message);
      }
  }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
      user: JSON.parse(localStorage.getItem("user")) || null, 
      token: localStorage.getItem("token") || null, 
      error: null,
      loading: false,
    },
    reducers: {
        logout: (state, action) => {
            state.user = null;
            state.token = null;
            state.error = null;

            localStorage.removeItem('user');
            localStorage.removeItem('token');

            //action.asyncDispatch(clearCart());
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(signUp.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(signUp.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.loading = false;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
          })
          .addCase(signUp.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
          })
          .addCase(signIn.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(signIn.fulfilled, (state, action) => {
            console.log('Sign-in successful:', action.payload);
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
          })
          .addCase(signIn.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
          });
      },
});

export const { logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;

export default authSlice.reducer;