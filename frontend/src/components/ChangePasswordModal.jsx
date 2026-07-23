import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const ChangePasswordModal = () => {
    const { user, changePassword, logout } = useContext(AuthContext);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Password criteria checklist
    const [pwdChecks, setPwdChecks] = useState({
        length: false,
        capital: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        setPwdChecks({
            length: newPassword.length >= 8,
            capital: /[A-Z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
        });
    }, [newPassword]);

    const isPasswordValid = pwdChecks.length && pwdChecks.capital && pwdChecks.number && pwdChecks.special;

    if (!user || !user.passwordChangeRequired) {
        return null; // Do not display if user doesn't require password change
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!oldPassword) {
            setError('Please enter your current (default) password.');
            return;
        }

        if (!isPasswordValid) {
            setError('New password does not meet all security requirements.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        const result = await changePassword(oldPassword, newPassword);
        setLoading(false);

        if (result.success) {
            setSuccess('Password changed successfully! Access granted.');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
        }}>
            <div className="card" style={{
                maxWidth: '440px',
                width: '100%',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.3)'
            }}>
                <div className="card-body" style={{ padding: '2.5rem 2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                            Mandatory Password Update
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                            For account security, you must update your default password before accessing the system.
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '1.25rem' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label" htmlFor="oldPassword">Current (Default) Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                className="form-control"
                                placeholder="Enter current default password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                placeholder="Enter new strong password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            {/* Password Requirements Checklist */}
                            <div style={{
                                marginTop: '0.6rem',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '0.4rem',
                                fontSize: '0.78rem'
                            }}>
                                <div style={{ color: pwdChecks.length ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: pwdChecks.length ? 600 : 400 }}>
                                    Min 8 characters
                                </div>
                                <div style={{ color: pwdChecks.capital ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: pwdChecks.capital ? 600 : 400 }}>
                                    1 Capital letter (A-Z)
                                </div>
                                <div style={{ color: pwdChecks.number ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: pwdChecks.number ? 600 : 400 }}>
                                    1 Number (0-9)
                                </div>
                                <div style={{ color: pwdChecks.special ? 'var(--success-color)' : 'var(--text-secondary)', fontWeight: pwdChecks.special ? 600 : 400 }}>
                                    1 Special character
                                </div>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={logout}
                                style={{ flex: 1 }}
                            >
                                Sign Out
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
                                style={{ flex: 2, fontWeight: 700 }}
                            >
                                {loading ? 'Updating...' : 'Update Password & Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
