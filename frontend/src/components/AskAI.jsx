import React, { useState } from 'react';

const AskAI = ({
  qaHistory,
  onAskQuestion,
  isAsking,
  apiConfigured
}) => {
  const [question, setQuestion] = useState('');

  const quickQuestions = [
    "What is the person wearing?",
    "How many people are visible?",
    "What is happening in the background?",
    "What main colors are present in the image?",
    "Is there any vehicle visible?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || isAsking || !apiConfigured) return;
    onAskQuestion(question.trim());
    setQuestion('');
  };

  const handleQuickQuestionClick = (q) => {
    setQuestion(q);
  };

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
          Grounded Visual Q&A
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Ask natural language questions answered strictly from visible image evidence
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the image..."
            className="input-base"
            style={{ flex: 1, minWidth: '260px' }}
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim() || !apiConfigured}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
          >
            {isAsking ? 'Processing...' : 'Ask AI'}
          </button>
        </div>
      </form>

      {/* Quick Questions Chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '0.5rem', uppercase: 'true' }}>
          Suggested Questions:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestionClick(q)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History List */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        {qaHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-subtle)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              No visual queries submitted yet
            </p>
            <span style={{ fontSize: '0.8rem' }}>
              Type a question above or click a suggestion to analyze image details.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {qaHistory.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* User Question */}
                <div style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}>
                  {item.question}
                </div>

                {/* AI Answer */}
                <div style={{
                  alignSelf: 'flex-start',
                  maxWidth: '90%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: '#F8FAFC',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.25rem', uppercase: 'true' }}>
                    Gemini Vision AI
                  </div>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
