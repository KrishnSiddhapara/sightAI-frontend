import React from 'react';
import { Image, Search, History, MessageSquare } from 'lucide-react';

const EmptyState = ({ type = 'upload', onAction }) => {
  const configs = {
    upload: {
      icon: Image,
      title: 'No Image Selected',
      description: 'Upload a JPG, PNG, or WEBP image above to perform grounded AI object analysis, natural language editing, or visual Q&A.',
    },
    pending_analysis: {
      icon: Search,
      title: 'Ready to Analyze',
      description: 'Your image has passed pre-screening. Click the "Analyze Image" button above to run Gemini object verification.',
      actionText: 'Analyze Image'
    },
    version_history: {
      icon: History,
      title: 'No Edits Yet',
      description: 'Your AI-generated image versions will appear here immutably as you make edits.',
    },
    qa: {
      icon: MessageSquare,
      title: 'Ask Your First Question',
      description: 'Interact directly with your image by asking natural language questions about objects, people, or background details.',
    }
  };

  const config = configs[type] || configs.upload;
  const Icon = config.icon;

  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1.5rem',
      background: 'rgba(17, 24, 39, 0.4)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--bg-secondary)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-subtle)',
        marginBottom: '1rem'
      }}>
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.5rem' }}>
        {config.title}
      </h3>

      <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
        {config.description}
      </p>

      {config.actionText && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
          {config.actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
