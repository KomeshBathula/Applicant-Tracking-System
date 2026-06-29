import React from 'react';
import JobCard from './JobCard';

const JobList = ({ jobs, onView, onEdit, onDelete, showActions }) => {
    if (!jobs || jobs.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                No job postings found matching your search criteria.
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map((job) => (
                <JobCard 
                    key={job.id} 
                    job={job} 
                    onView={onView} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                    showActions={showActions} 
                />
            ))}
        </div>
    );
};

export default JobList;
