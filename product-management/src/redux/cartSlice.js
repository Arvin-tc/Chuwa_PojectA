import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const PORT = 3000;

// Fetch the cart from the backend
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:${PORT}/api/auth/cart/${userId}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch cart");
            }

            const data = await response.json();

            // Validate each cart item to ensure it still exists
            const validCartItems = await Promise.all(
                data.cart.map(async (item) => {
                    const productResponse = await fetch(`http://localhost:${PORT}/api/products/${item.id}`);
                    if (productResponse.ok) {
                        return item; // Product exists
                    }
                    return null; // Product doesn't exist
                })
            );

            // Filter out null values (deleted products)
            return validCartItems.filter(Boolean);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: JSON.parse(localStorage.getItem("cartItems")) || [],
        subtotal: JSON.parse(localStorage.getItem("cartItems"))?.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        ) || 0,
        discount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addItem: (state, action) => {
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === action.payload.id
            );
            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.subtotal = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.subtotal = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        updateQuantity: (state, action) => {
            const { id, amount } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            if (existingItem) {
                existingItem.quantity += amount;
                if (existingItem.quantity <= 0) {
                    state.items = state.items.filter((item) => item.id !== id);
                }
            }
            state.subtotal = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.subtotal = 0;
            localStorage.removeItem("cartItems");
        },
        removeDeletedItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.subtotal = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },
        setCartItems: (state, action) => {
            state.items = action.payload;
            state.subtotal = state.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            localStorage.setItem("cartItems", JSON.stringify(state.items));
        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload || [];
                state.subtotal = state.items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                localStorage.setItem("cartItems", JSON.stringify(state.items));
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { addItem, removeItem, updateQuantity, clearCart, removeDeletedItem, setCartItems } = cartSlice.actions;

export default cartSlice.reducer;
