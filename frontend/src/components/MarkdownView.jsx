import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownView = ({ content, maxLength = 240, collapsible = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const isLong = collapsible && content.length > maxLength;
  const displayContent = isLong && !isExpanded ? content.slice(0, maxLength) + '...' : content;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          a: ({ node, children, href, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          )
        }}
      >
        {displayContent}
      </ReactMarkdown>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
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
          {isExpanded ? 'Hide Full Analysis' : 'View Full Analysis'}
        </button>
      )}
    </div>
  );
};

export default MarkdownView;
