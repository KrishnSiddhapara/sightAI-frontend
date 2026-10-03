import React from 'react';

const AnalysisProgress = ({ currentStep }) => {
  const steps = [
    { id: 'validating', label: 'Validating image' },
    { id: 'safety', label: 'Safety screening' },
    { id: 'understanding', label: 'Visual understanding' },
    { id: 'verifying', label: 'Object verification & bounding box extraction' },
    { id: 'preparing', label: 'Preparing results' },
  ];

  const getStepStatus = (index) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="card-glass" style={{
      maxWidth: '560px',
      margin: '0 auto 2rem auto',
      padding: '1.5rem',
      background: 'var(--bg-surface)',
    }}>
      <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Analyzing Image
        </h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Processing with Gemini Grounded Vision Model
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {steps.map((step, idx) => {
          const status = getStepStatus(idx);
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                color: status === 'completed' ? '#6EE7B7' : status === 'active' ? '#A5B4FC' : 'var(--text-subtle)',
                fontWeight: status === 'active' ? 600 : 400,
              }}
            >
              <span>{step.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                {status === 'completed' && '✓'}
                {status === 'active' && '●'}
                {status === 'pending' && '○'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisProgress;
