import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'user',
    });
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            userType: e.target.checked ? 'admin' : 'user',
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert('Email and Password are required');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            alert('Invalid email format');
            return;
        }
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        const resultAction = await dispatch(signUp(formData));
        if (signUp.fulfilled.match(resultAction)) {
            alert("Sign-up successful. Please sign in.");
            navigate("/signin");
        } else {
            alert(resultAction.payload || "Sign-up failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    />
                </div>
                <div className="form-group flex items-center">
                    <input
                    type="checkbox"
                    id="userType"
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                    <label htmlFor="userType" className="ml-2 block text-sm text-gray-700">Sign up as a Vendor</label>
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none"
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link to="/signin" className="text-indigo-500 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>

    );
}
