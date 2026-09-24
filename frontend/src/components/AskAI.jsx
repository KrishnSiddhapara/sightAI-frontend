import React, { useState } from 'react';
import { MessageSquare, Send, RefreshCw, Bot, User, HelpCircle } from 'lucide-react';

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
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <MessageSquare size={22} color="var(--primary)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
          💬 Ask AI About This Image
        </h3>
      </div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Ask questions grounded strictly in the visual evidence of your uploaded image.
      </p>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the image (e.g., What is the person wearing?)..."
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
            {isAsking ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> Thinking...
              </>
            ) : (
              <>
                <Send size={18} /> Ask AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Questions Chips */}
      <div style={{ marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          💡 Suggested Questions:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuestionClick(q)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.85rem',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--secondary)';
                e.currentTarget.style.color = '#F8FAFC';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              ❓ {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat History List */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        {qaHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-subtle)' }}>
            <HelpCircle size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              No questions asked yet
            </p>
            <span style={{ fontSize: '0.8rem' }}>
              Type a question above or click a suggestion to start visual Q&A.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {qaHistory.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* User Question - Right Aligned */}
                <div style={{
                  alignSelf: 'flex-end',
                  maxWidth: '80%',
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  color: '#FFFFFF',
                  padding: '0.75rem 1.1rem',
                  borderRadius: '16px 16px 2px 16px',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', opacity: 0.85, marginBottom: '0.2rem' }}>
                    <User size={12} /> You
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                    {item.question}
                  </div>
                </div>

                {/* AI Answer - Left Aligned */}
                <div style={{
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: '#F8FAFC',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '16px 16px 16px 2px',
                  borderLeft: '4px solid var(--secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, marginBottom: '0.35rem' }}>
                    <Bot size={14} /> Gemini Vision AI
                  </div>
                  <div style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#E2E8F0' }}>
                    {item.answer}
                  </div>
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
