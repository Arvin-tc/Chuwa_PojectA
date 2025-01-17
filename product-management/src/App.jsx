import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';
import ForgotPassword from './pages/forgotPassword';
import ProtectedRoute from './components/protectedRoute';
import ProductList from './pages/productList';
import ProductForm from './components/productFrom';
import ProductDetail from './pages/productDetail';
import Layout from './components/layout';
import NotFound from './pages/notFound';

function App() {
  return (
    //<Layout>
      <Router>
        <Layout>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path = "/forgot-password" element={<ForgotPassword />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          <Route path="/" element={<SignIn />} />


          <Route
            path = "/products/create"
            element = {
              <ProtectedRoute role="admin">
                <ProductForm isEditing = {false} />
              </ProtectedRoute>
            }
          />
          <Route
            path = "/products/:id/edit"
            element = {
              <ProtectedRoute role="admin">
                <ProductForm isEditing = {true} />
              </ProtectedRoute>
            }
          />
          <Route path = "*" element = {<NotFound />} />
        </Routes>
        </Layout>
      </Router>
    //</Layout>
  );
}

export default App;
