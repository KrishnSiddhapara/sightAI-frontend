import React from 'react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card-glass" style={{
      padding: '1.25rem',
      background: 'var(--bg-surface)',
      borderLeft: '3px solid var(--primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.05em' }}>
          EXECUTIVE SUMMARY
        </h4>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-subtle)',
          fontFamily: 'var(--font-mono)'
        }}>
          Grounded VLM
        </span>
      </div>

      <p style={{
        fontSize: '0.95rem',
        color: '#F8FAFC',
        lineHeight: 1.6,
      }}>
        {summary}
      </p>
    </div>
  );
};

export default SummaryCard;
