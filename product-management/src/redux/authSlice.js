import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCartItems } from "./cartSlice";

const PORT = 3000;

export const signUp = createAsyncThunk(
    'auth/signUp',
    async (userData, { rejectWithValue }) => {
        try {
          const response = await fetch(`http://localhost:${PORT}/api/auth/signup`, {
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

const mergeCarts = (backendCart, guestCart) => {
    const cartMap = new Map();
    backendCart.forEach(item => {
        cartMap.set(item.id, {...item});
    });

    guestCart.forEach(guestItem => {
        if(cartMap.has(guestItem.id)) {
            const existingItem = cartMap.get(guestItem.id);
            existingItem.quantity += guestItem.quantity;
        } else {

            cartMap.set(guestItem.id, {...guestItem});
        }
    });

    return Array.from(cartMap.values());
}

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue, dispatch }) => {
      try {

          const {guestCart, ...credentials} = userData;
          const response = await fetch(`http://localhost:${PORT}/api/auth/signin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
          });

          if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Sign-in failed");
          }

          const data = await response.json();
          
          // merge guest cart
          const cartResponse = await fetch(`http://localhost:${PORT}/api/auth/cart/${data.user.id}`);
          if(!cartResponse.ok){
              console.warn("Failed to fetch cart");
          }

          const backendCartData = await cartResponse.json();
          const mergedCart = mergeCarts(backendCartData.cart || [], guestCart || []);

          dispatch(setCartItems(mergedCart));
          localStorage.setItem("cartItems", JSON.stringify(mergedCart));
          localStorage.removeItem("guestCart");


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
          const response = await fetch(`http://localhost:${PORT}/api/auth/save-cart`, {
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
