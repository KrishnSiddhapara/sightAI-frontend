import React from 'react';
import { Tag, AlertTriangle } from 'lucide-react';

const ObjectList = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic' }}>
        No physical objects detected or confirmed.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
      {categories.map((cat, idx) => (
        <div
          key={idx}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Tag size={15} color="#A5B4FC" />
          <span style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>
            {cat.name}
          </span>
          <span style={{
            background: '#8B5CF6',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            ×{cat.confirmed_count}
          </span>
          {cat.uncertain_count > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#FCD34D',
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.7rem',
              fontWeight: 600
            }} title={`${cat.uncertain_count} unconfirmed/partially occluded instance(s)`}>
              <AlertTriangle size={12} /> +{cat.uncertain_count}?
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ObjectList;
