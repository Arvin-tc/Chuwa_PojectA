import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/authSlice';

const ProtectedRoute = ({ children, role }) => {
    const user = useSelector(selectUser);

    if (!user) {
        return <Navigate to="/signin" replace/>;
    }

    if (role && user.userType !== role) {
        return <Navigate to="/signin" replace/>;
    }

    return children;
};


export default ProtectedRoute;