import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const SafetyStatus = ({ safetyResult, onReset }) => {
  if (!safetyResult || safetyResult.is_safe) return null;

  const category = safetyResult.category || 'UNSAFE';
  const reason = safetyResult.error || safetyResult.reasoning || 'Image contains content that violated safety guidelines.';

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      maxWidth: '650px',
      margin: '0 auto 2rem auto',
      textAlign: 'center'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(239, 68, 68, 0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#EF4444',
        marginBottom: '1rem'
      }}>
        <ShieldAlert size={32} />
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>
        Image Cannot Be Analyzed
      </h3>

      <p style={{ fontSize: '0.95rem', color: '#FCA5A5', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {reason}
      </p>

      <div style={{
        display: 'inline-block',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 'var(--radius-full)',
        padding: '0.35rem 1rem',
        fontSize: '0.8rem',
        color: '#F8FAFC',
        marginBottom: '1.5rem',
        fontWeight: 600
      }}>
        Safety Category: <span style={{ color: '#EF4444' }}>{category}</span>
      </div>

      {onReset && (
        <div>
          <button
            onClick={onReset}
            className="btn-secondary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem' }}
          >
            <RefreshCw size={16} /> Choose Another Image
          </button>
        </div>
      )}
    </div>
  );
};

export default SafetyStatus;
