import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button 
                className="btn btn-secondary btn-sm" 
                disabled={currentPage === 0} 
                onClick={() => onPageChange(currentPage - 1)}
            >
                ← Previous
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            <button 
                className="btn btn-secondary btn-sm" 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next →
            </button>
        </div>
    );
};

export default Pagination;
