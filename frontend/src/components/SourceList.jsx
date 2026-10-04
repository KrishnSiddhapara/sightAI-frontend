import React from 'react';

const getSourceBadgeColor = (sourceType) => {
  switch (sourceType?.toLowerCase()) {
    case 'official':
      return { bg: 'var(--success-bg)', border: 'var(--success-border)', text: 'var(--success)', label: 'Official Source' };
    case 'retailer':
      return { bg: 'var(--primary-glow)', border: 'var(--border-color)', text: 'var(--primary)', label: 'Retailer' };
    case 'publisher':
      return { bg: 'var(--secondary-glow)', border: 'var(--border-color)', text: 'var(--secondary)', label: 'Publisher' };
    case 'reference':
      return { bg: 'var(--warning-bg)', border: 'var(--warning-border)', text: 'var(--warning)', label: 'Reference' };
    default:
      return { bg: 'var(--bg-secondary)', border: 'var(--border-color)', text: 'var(--text-muted)', label: 'Web Result' };
  }
};

const SourceList = ({ sources = [] }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '0.05em' }}>
          VERIFIED SOURCES & LINKS ({sources.length})
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
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
                justifyContent: 'space-between',
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
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {src.domain}
                  </span>
                </div>

                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                  {src.title}
                </h5>

                {src.snippet && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                    {src.snippet.length > 110 ? src.snippet.slice(0, 110) + '...' : src.snippet}
                  </p>
                )}
              </div>

              <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
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
