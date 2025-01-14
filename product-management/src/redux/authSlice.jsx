import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    'auth/signIn',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Attempting to sign in with:', userData);
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                console.log('Error response:', error); 
                throw new Error(error.error || 'Sign-in failed');
            }

            const data = await response.json();
            console.log('Sign-in successful:', data); 
            return data;
        } catch (error) {
            console.error('Sign-in failed:', error.message); 
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        error: null,
        loading: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
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
            state.user = action.payload.user;
            state.loading = false;
          })
          .addCase(signIn.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
          });
      },
});