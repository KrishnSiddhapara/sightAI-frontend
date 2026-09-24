import React from 'react';
import { Sparkles, FileText } from 'lucide-react';

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="card-glass" style={{
      marginBottom: '1.5rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(23, 32, 51, 0.9) 100%)',
      borderLeft: '4px solid var(--primary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileText size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
            AI Executive Summary
          </h3>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          color: '#A5B4FC',
          fontWeight: 600
        }}>
          <Sparkles size={12} /> Gemini 2.5 Grounded
        </div>
      </div>

      <p style={{
        fontSize: '1rem',
        color: '#E2E8F0',
        lineHeight: 1.7,
        fontStyle: 'italic'
      }}>
        "{summary}"
      </p>
    </div>
  );
};

export default SummaryCard;
