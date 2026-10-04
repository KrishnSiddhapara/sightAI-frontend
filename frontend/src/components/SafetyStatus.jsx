import React from 'react';

const SafetyStatus = ({ safetyResult, onReset }) => {
  if (!safetyResult || safetyResult.is_safe) return null;

  const category = safetyResult.category || 'UNSAFE';
  const reason = safetyResult.error || safetyResult.reasoning || 'Image contains content that violated safety guidelines.';

  return (
    <div style={{
      background: 'var(--danger-bg)',
      border: '1px solid var(--danger-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      maxWidth: '650px',
      margin: '0 auto 2rem auto',
      textAlign: 'center'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.5rem' }}>
        Safety Gate Flag
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--danger-text)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {reason}
      </p>

      <div style={{
        display: 'inline-block',
        background: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        borderRadius: 'var(--radius-full)',
        padding: '0.35rem 1rem',
        fontSize: '0.8rem',
        color: 'var(--heading)',
        marginBottom: '1.5rem',
        fontWeight: 600
      }}>
        Category: <span style={{ color: 'var(--danger-text)' }}>{category}</span>
      </div>

      {onReset && (
        <div>
          <button
            onClick={onReset}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}
          >
            Choose Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default SafetyStatus;
