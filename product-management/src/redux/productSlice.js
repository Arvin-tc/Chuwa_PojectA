import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const PORT = 3000;

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:${PORT}/api/products`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (productData, { rejectWithValue }) => {
      try {
        const response = await fetch(`http://localhost:${PORT}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to create product");
        }
  
        return await response.json();
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);
  
export const updateProduct = createAsyncThunk(
"products/updateProduct",
async ({ id, data }, { rejectWithValue }) => {
    try {
    const response = await fetch(`http://localhost:${PORT}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
    }

    return await response.json();
    } catch (error) {
    return rejectWithValue(error.message);
    }
}
);
  
export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:${PORT}/api/products/${id}`, {
                method: "DELETE",
            });

            if(!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to delete product");
            }
            
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        error: null,
        loading: false,
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload.products;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            // .addCase(createProduct.fulfilled, (state, action) => {
            //     state.products.push(action.payload.product);
            // })
            // .addCase(updateProduct.fulfilled, (state, action) => {
            //     const index = state.products.findIndex(product => product._id === action.payload.product._id);
            //     if(index !== -1) {
            //         state.products[index] = action.payload.product;
            //     }
            // })
            // .addCase(deleteProduct.fulfilled, (state, action) => {
            //     state.products = state.products.filter(product => product._id !== action.payload);
            // });
        }      
});

export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;

export default productSlice.reducer;
