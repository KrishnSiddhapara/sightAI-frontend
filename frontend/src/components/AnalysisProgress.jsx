import React from 'react';

const AnalysisProgress = ({ currentStep, analysisTimer }) => {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Analyzing Image
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Processing with Gemini Grounded Vision Model
          </span>
        </div>

        {analysisTimer && (analysisTimer.status === 'running' || analysisTimer.elapsedSeconds !== '0.0') && (
          <div style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: 'var(--primary-text)',
            background: 'rgba(99, 102, 241, 0.12)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)'
            }} />
            <span>{analysisTimer.elapsedSeconds}s</span>
          </div>
        )}
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
                color: status === 'completed' ? 'var(--success-text)' : status === 'active' ? 'var(--primary-text)' : 'var(--text-subtle)',
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
