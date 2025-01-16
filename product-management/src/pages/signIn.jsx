import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, selectIsAuthenticated } from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert('Email and Password are required');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            alert('Invalid email format');
            return;
        }
        dispatch(signIn(formData));
    };

    useEffect(() => {
        console.log('isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
            navigate('/products', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-10">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
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
                            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg focus:outline-none">
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don’t have an account? <Link to="/signup" className="text-indigo-500 hover:underline">Sign Up</Link>
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">
                    <Link to="/forgot-password" className="text-indigo-500 hover:underline">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
}
