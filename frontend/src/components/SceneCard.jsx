import React from 'react';

const SceneCard = ({ scene }) => {
  if (!scene) return null;

  return (
    <div className="card-glass" style={{ padding: '1.25rem' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.05em', marginBottom: '1rem' }}>
        SCENE UNDERSTANDING
      </h4>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.25rem' }}>
            Category
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#A5B4FC' }}>
            {scene.category}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.25rem' }}>
            Environment
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#F8FAFC' }}>
            {scene.environment}
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.25rem' }}>
            Primary Activity
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: '#F8FAFC' }}>
            {scene.primary_activity}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.25rem' }}>
          Scene Summary
        </div>
        <p style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.5 }}>
          {scene.summary}
        </p>
      </div>
    </div>
  );
};

export default SceneCard;
