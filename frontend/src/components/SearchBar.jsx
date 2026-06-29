import React, { useState } from 'react';

const SearchBar = ({ onSearch, showStatusFilter = false }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [status, setStatus] = useState('ALL');

    const handleClear = () => {
        setTitle('');
        setCompany('');
        setLocation('');
        setEmploymentType('');
        setStatus('ALL');
        onSearch({ title: '', company: '', location: '', employmentType: '', status: 'ALL' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ title, company, location, employmentType, status });
    };

    return (
        <form onSubmit={handleSubmit} className="dashboard-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Job Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search title..." 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                
                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Company</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search company..." 
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)} 
                    />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Location</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search location..." 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.85rem' }}>Employment Type</label>
                    <select 
                        className="form-control" 
                        value={employmentType} 
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                {showStatusFilter && (
                    <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.85rem' }}>Status</label>
                        <select 
                            className="form-control" 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="OPEN">Open</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear Filters</button>
                <button type="submit" className="btn btn-primary">Search Jobs</button>
            </div>
        </form>
    );
};

export default SearchBar;
