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
            background: 'var(--primary-glow)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 1rem',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          <Tag size={15} color="var(--primary)" />
          <span style={{ color: 'var(--heading)', fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>
            {cat.name}
          </span>
          <span style={{
            background: 'var(--primary)',
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
              background: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              border: '1px solid var(--warning-border)',
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
