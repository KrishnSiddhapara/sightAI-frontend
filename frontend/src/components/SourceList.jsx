import React from 'react';

const getSourceBadgeColor = (sourceType) => {
  switch (sourceType?.toLowerCase()) {
    case 'official':
      return { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)', text: '#6EE7B7', label: 'Official Source' };
    case 'retailer':
      return { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)', text: '#A5B4FC', label: 'Retailer' };
    case 'publisher':
      return { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', text: '#DDD6FE', label: 'Publisher' };
    case 'reference':
      return { bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.3)', text: '#67E8F9', label: 'Reference' };
    default:
      return { bg: 'rgba(100, 116, 139, 0.15)', border: 'rgba(100, 116, 139, 0.3)', text: '#94A3B8', label: 'Web Result' };
  }
};

const SourceList = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, uppercase: 'true', letterSpacing: '0.05em' }}>
          VERIFIED SOURCES & LINKS ({sources.length})
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Click to open external page
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
        {sources.map((src, idx) => {
          const badge = getSourceBadgeColor(src.source_type);
          
          return (
            <div
              key={idx}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: badge.text,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {badge.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                    {src.domain}
                  </span>
                </div>

                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                  {src.title}
                </h5>

                {src.snippet && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                    {src.snippet.length > 110 ? src.snippet.slice(0, 110) + '...' : src.snippet}
                  </p>
                )}
              </div>

              <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    textDecoration: 'none'
                  }}
                >
                  Open Source ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourceList;
