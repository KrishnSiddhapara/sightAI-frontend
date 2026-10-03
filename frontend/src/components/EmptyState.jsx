import React from 'react';

const EmptyState = ({ type = 'upload', onAction }) => {
  const configs = {
    upload: {
      title: 'No Image Uploaded',
      description: 'Upload a JPG, PNG, or WEBP image above to perform grounded AI object analysis, spatial bounding box localization, image editing, or visual Q&A.',
    },
    pending_analysis: {
      title: 'Ready for Analysis',
      description: 'Your image is uploaded and pre-screened. Click "Analyze Image" above to run object verification and grounded bounding box detection.',
      actionText: 'Analyze Image'
    },
    version_history: {
      title: 'No Versions Generated Yet',
      description: 'Your image edit history and versions will appear here as you perform multi-version AI image edits.',
    },
    qa: {
      title: 'No Visual Queries Yet',
      description: 'Ask natural language questions about specific objects, spatial arrangements, attributes, or background details in the image.',
    }
  };

  const config = configs[type] || configs.upload;

  return (
    <div style={{
      textAlign: 'center',
      padding: '3rem 1.5rem',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      margin: '1.5rem 0'
    }}>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.4rem' }}>
        {config.title}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
        {config.description}
      </p>

      {config.actionText && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          {config.actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
