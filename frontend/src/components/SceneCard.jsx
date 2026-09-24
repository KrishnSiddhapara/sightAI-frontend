import React from 'react';
import { Compass, Trees, Activity, AlignLeft } from 'lucide-react';

const SceneCard = ({ scene }) => {
  if (!scene) return null;

  return (
    <div className="card-glass" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <Compass size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
          Scene Understanding
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Compass size={14} /> SCENE CATEGORY
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#A5B4FC' }}>
            {scene.category}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Trees size={14} /> ENVIRONMENT
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#F8FAFC' }}>
            {scene.environment}
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
            <Activity size={14} /> PRIMARY ACTIVITY
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#F8FAFC' }}>
            {scene.primary_activity}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          <AlignLeft size={14} /> SCENE SUMMARY
        </div>
        <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.6 }}>
          {scene.summary}
        </p>
      </div>
    </div>
  );
};

export default SceneCard;
