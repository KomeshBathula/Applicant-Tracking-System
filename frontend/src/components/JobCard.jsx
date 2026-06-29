import React from 'react';

const JobCard = ({ job, onView, onEdit, onDelete, showActions }) => {
    return (
        <div className="dashboard-card" style={{ border: '1px solid var(--border-color)', margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.2rem' }}>{job.title}</h4>
                    <p style={{ margin: '0.2rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {job.company} — {job.location}
                    </p>
                </div>
                <span className="badge" style={{
                    backgroundColor: job.status === 'OPEN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: job.status === 'OPEN' ? 'var(--success-color)' : 'var(--danger-color)',
                    borderColor: job.status === 'OPEN' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                }}>
                    {job.status}
                </span>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
                {job.description && job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...` 
                    : job.description}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <div>
                    <span style={{ marginRight: '1rem' }}>💼 {job.employmentType}</span>
                    <span style={{ marginRight: '1rem' }}>🎓 {job.experienceRequired}</span>
                    <span>💰 {job.salaryRange}</span>
                </div>
                {showActions && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => onView(job)}>View</button>
                        {onEdit && <button className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }} onClick={() => onEdit(job)}>Edit</button>}
                        {onDelete && <button className="btn btn-danger btn-sm" style={{ backgroundColor: 'var(--danger-color)', borderColor: 'var(--danger-color)', color: '#fff' }} onClick={() => onDelete(job.id)}>Delete</button>}
                    </div>
                )}
                {!showActions && onView && (
                    <button className="btn btn-primary btn-sm" onClick={() => onView(job)}>View Details</button>
                )}
            </div>
        </div>
    );
};

export default JobCard;
