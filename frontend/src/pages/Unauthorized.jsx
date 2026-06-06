import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-card-container">
            <div className="auth-card" style={{ textAlign: 'center', borderColor: '#ff4d4d' }}>
                <h1 style={{ color: '#ff4d4d', fontSize: '3rem', margin: '0 0 1rem 0' }}>403</h1>
                <h2>Access Denied</h2>
                <p style={{ color: '#aaa', margin: '1rem 0 2rem 0' }}>
                    You do not have the required permissions to view this resource.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
