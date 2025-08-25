import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const AuthWrapper = ({ children }) => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);
    return (
        <div className="auth-wrapper">
            {children}
        </div>
    )
}

export default AuthWrapper