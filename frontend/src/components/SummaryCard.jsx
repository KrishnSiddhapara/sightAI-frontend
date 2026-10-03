import React from 'react';
import MarkdownView from './MarkdownView';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card-glass" style={{
      padding: '1.25rem',
      background: 'var(--bg-surface)',
      borderLeft: '3px solid var(--primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-subtle)', uppercase: 'true', letterSpacing: '0.05em' }}>
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

      <MarkdownView content={summary} collapsible={true} maxLength={300} />
    </div>
  );
};

export default SummaryCard;
