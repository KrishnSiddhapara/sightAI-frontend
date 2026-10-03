import React, { useState } from 'react';
import MarkdownView from './MarkdownView';

const SceneCard = ({ scene }) => {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  if (!scene) return null;

  return (
    <div className="card-glass" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-subtle)', uppercase: 'true', letterSpacing: '0.05em' }}>
          SCENE UNDERSTANDING
        </h4>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--primary)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)'
        }}>
          {scene.category || 'General Scene'}
        </span>
      </div>

      {/* Short Scene Summary */}
      <div style={{ marginBottom: '0.85rem' }}>
        <MarkdownView content={scene.summary} />
      </div>

      {/* Collapsible Full Scene Details */}
      {showFullAnalysis && (
        <div style={{
          marginTop: '0.85rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.2rem' }}>
              Environment
            </div>
            <MarkdownView content={scene.environment} />
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 600, uppercase: 'true', marginBottom: '0.2rem' }}>
              Primary Activity
            </div>
            <MarkdownView content={scene.primary_activity} />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setShowFullAnalysis(!showFullAnalysis)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginTop: '0.5rem',
          textDecoration: 'underline'
        }}
      >
        {showFullAnalysis ? 'Hide Full Scene Analysis' : 'View Full Scene Analysis'}
      </button>
    </div>
  );
};

export default SceneCard;
