import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="home-container">
            {/* Header / Navbar */}
            <header className="navbar" style={{ borderBottomColor: 'rgba(239, 68, 68, 0.2)' }}>
                <div className="navbar-brand">
                    <span className="logo-icon" style={{ color: 'var(--danger-color)' }}>▲</span>
                    <span>Admin Control Center</span>
                </div>
                <div className="user-profile-menu">
                    <ThemeToggle />
                    <span className="user-name">{user?.fullName}</span>
                    <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }}>Administrator</span>
                    <button className="btn btn-secondary btn-sm" onClick={logout}>Sign Out</button>
                </div>
            </header>

            {/* Sidebar & Dashboard Layout */}
            <div style={{ display: 'flex', flex: 1, flexDirection: 'row', minHeight: 'calc(100vh - 70px)' }}>
                {/* Admin Navigation Sidebar */}
                <nav style={{ width: '240px', borderRight: '1px solid var(--border-color)', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button 
                        className="btn" 
                        style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'dashboard' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'dashboard' ? '#fff' : 'var(--text-primary)' }}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        📋 Dashboard
                    </button>
                    <button 
                        className="btn" 
                        style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'users' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'users' ? '#fff' : 'var(--text-primary)' }}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                    <button 
                        className="btn" 
                        style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'roles' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'roles' ? '#fff' : 'var(--text-primary)' }}
                        onClick={() => setActiveTab('roles')}
                    >
                        🔑 Roles
                    </button>
                    <button 
                        className="btn" 
                        style={{ justifyContent: 'flex-start', backgroundColor: activeTab === 'settings' ? 'var(--primary-color)' : 'transparent', color: activeTab === 'settings' ? '#fff' : 'var(--text-primary)' }}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ System Settings
                    </button>
                    <button 
                        className="btn" 
                        style={{ justifyContent: 'flex-start', backgroundColor: 'transparent', color: 'var(--danger-color)', marginTop: 'auto' }}
                        onClick={logout}
                    >
                        🚪 Logout
                    </button>
                </nav>

                {/* Dashboard Tab Panels */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {activeTab === 'dashboard' && (
                        <div>
                            <div className="welcome-banner" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(11, 15, 25, 0.5) 100%)' }}>
                                <h1>Welcome, {user?.fullName}</h1>
                                <p>Manage system users, adjust authorizations, and review portal operations.</p>
                            </div>

                            <div className="dashboard-grid">
                                <div className="dashboard-card">
                                    <h3>System Diagnostics</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.2rem', fontSize: '0.9rem' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>Server Status: <strong style={{ color: 'var(--success-color)' }}>Online</strong></p>
                                        <p style={{ color: 'var(--text-secondary)' }}>Database Engine: <strong style={{ color: 'var(--success-color)' }}>MySQL (Connected)</strong></p>
                                        <p style={{ color: 'var(--text-secondary)' }}>Total Jobs Registered: <strong style={{ color: 'var(--text-primary)' }}>N/A (Recruiter Scope)</strong></p>
                                    </div>
                                </div>

                                <div className="dashboard-card">
                                    <h3>Administrator Notice</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                        All actions performed within this console are tracked for audit purposes. Ensure security keys are kept safe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="dashboard-card">
                            <h3>User Management</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>View and configure registered system credentials.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)' }}>admin@ats.com</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Admin account</p>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }}>Active</span>
                                </div>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)' }}>recruiter@ats.com</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Recruiter account</p>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)' }}>Active</span>
                                </div>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)' }}>candidate@ats.com</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Candidate account</p>
                                    </div>
                                    <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-color)' }}>Active</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="dashboard-card">
                            <h3>Role Permissions</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Default mappings for available scopes in the database.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                                    <h4 style={{ color: 'var(--text-primary)' }}>ROLE_ADMIN</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Full authorization to manage users, roles, system parameters, and job listings.</p>
                                </div>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                                    <h4 style={{ color: 'var(--text-primary)' }}>ROLE_RECRUITER</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Authorization to create, view, modify, and delete job postings. Access candidate pipelines.</p>
                                </div>
                                <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', backgroundColor: 'var(--bg-secondary)' }}>
                                    <h4 style={{ color: 'var(--text-primary)' }}>ROLE_CANDIDATE</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Authorization to search open positions, view postings, and submit job applications.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="dashboard-card">
                            <h3>System Settings</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Adjust configurations and session parameters.</p>
                            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                Global configurations are set to defaults. Session expiration is configured via Spring Security context.
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
