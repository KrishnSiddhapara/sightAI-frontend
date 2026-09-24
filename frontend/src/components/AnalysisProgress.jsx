import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

const AnalysisProgress = ({ currentStep }) => {
  const steps = [
    { id: 'validating', label: 'Validating image' },
    { id: 'safety', label: 'Safety screening' },
    { id: 'understanding', label: 'Understanding image' },
    { id: 'verifying', label: 'Verifying objects & counts' },
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
      maxWidth: '600px',
      margin: '0 auto 2rem auto',
      padding: '1.75rem',
      background: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(99, 102, 241, 0.4)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <Loader2 size={22} className="animate-spin" color="var(--primary)" />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
          Analyzing Image...
        </h4>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {steps.map((step, idx) => {
          const status = getStepStatus(idx);
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                fontSize: '0.95rem',
                color: status === 'completed' ? '#6EE7B7' : status === 'active' ? '#A5B4FC' : 'var(--text-subtle)',
                fontWeight: status === 'active' ? 600 : 400,
                transition: 'all 0.2s ease'
              }}
            >
              {status === 'completed' && <CheckCircle2 size={18} color="var(--success)" />}
              {status === 'active' && <Loader2 size={18} className="animate-spin" color="var(--primary)" />}
              {status === 'pending' && <Circle size={18} color="var(--border-hover)" />}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisProgress;
