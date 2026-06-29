import React, { useState, useEffect } from 'react';

const JobForm = ({ initialData, onSubmit, onCancel, titleText }) => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [employmentType, setEmploymentType] = useState('Full-time');
    const [experienceRequired, setExperienceRequired] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [status, setStatus] = useState('OPEN');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setCompany(initialData.company || '');
            setLocation(initialData.location || '');
            setDescription(initialData.description || '');
            setEmploymentType(initialData.employmentType || 'Full-time');
            setExperienceRequired(initialData.experienceRequired || '');
            setSalaryRange(initialData.salaryRange || '');
            setStatus(initialData.status || 'OPEN');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !company.trim() || !location.trim() || !description.trim() || !experienceRequired.trim() || !salaryRange.trim()) {
            setError('All fields are required.');
            return;
        }
        setError('');
        onSubmit({
            title,
            company,
            location,
            description,
            employmentType,
            experienceRequired,
            salaryRange,
            status
        });
    };

    return (
        <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{titleText}</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Senior Java Engineer" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Company Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Software Services Corp" 
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Austin, TX (or Remote)" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Employment Type</label>
                    <select 
                        className="form-control" 
                        value={employmentType} 
                        onChange={(e) => setEmploymentType(e.target.value)}
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Experience Required</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. 5+ years" 
                        value={experienceRequired} 
                        onChange={(e) => setExperienceRequired(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Salary Range</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. $100k - $120k" 
                        value={salaryRange} 
                        onChange={(e) => setSalaryRange(e.target.value)} 
                    />
                </div>

                <div className="form-group">
                    <label>Job Status</label>
                    <select 
                        className="form-control" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        className="form-control" 
                        rows="6" 
                        placeholder="Enter full job description..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }}>Save Job Posting</button>
                </div>
            </form>
        </div>
    );
};

export default JobForm;
