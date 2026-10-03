import React, { useState } from 'react';
import MarkdownView from './MarkdownView';
import SourceList from './SourceList';

const AskAI = ({
  qaHistory,
  onAskQuestion,
  isAsking,
  apiConfigured,
  userRegion,
  setUserRegion
}) => {
  const [question, setQuestion] = useState('');

  const quickQuestions = [
    "Where can I purchase this book / product?",
    "What is the current price and availability?",
    "What is the official website or publisher?",
    "What color is the object in this image?",
    "Who is the author or manufacturer?"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
            AI Research Agent & Visual Q&A
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Answers visual questions or researches external purchase options, current prices, and official sources
          </span>
        </div>

        {/* Region selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Region:</span>
          <select
            value={userRegion || 'Global'}
            onChange={(e) => setUserRegion && setUserRegion(e.target.value === 'Global' ? '' : e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              fontSize: '0.78rem',
              padding: '2px 6px',
              cursor: 'pointer'
            }}
          >
            <option value="Global">Global</option>
            <option value="United States">United States</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Germany">Germany</option>
          </select>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything (e.g. Where can I purchase this book? / What color is the shirt?)..."
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
            {isAsking ? 'Researching...' : 'Ask Agent'}
          </button>
        </div>
      </form>

      {/* Quick Questions Chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '0.5rem', uppercase: 'true' }}>
          Suggested Research Prompts:
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
              + {q}
            </button>
          ))}
        </div>
      </div>

      {/* Research Loading State Indicator */}
      {isAsking && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A5B4FC', fontWeight: 600, marginBottom: '0.5rem' }}>
            <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            Researching your question...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>✓ Analyzing visual context & entity intent</span>
            <span>● Searching external web sources & checking availability</span>
            <span>○ Synthesizing grounded response with verified links</span>
          </div>
        </div>
      )}

      {/* Chat History List */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        {qaHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-subtle)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              No research queries submitted yet
            </p>
            <span style={{ fontSize: '0.8rem' }}>
              Ask a question above or click a suggestion to start AI research.
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {qaHistory.map((item, idx) => {
              const isResearched = item.requires_research;
              
              return (
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
                    maxWidth: '92%',
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: '#F8FAFC',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${isResearched ? '#10B981' : 'var(--secondary)'}`,
                    fontSize: '0.9rem',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        color: isResearched ? '#6EE7B7' : '#A78BFA',
                        fontWeight: 700,
                        uppercase: 'true',
                        background: isResearched ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${isResearched ? 'rgba(16, 185, 129, 0.25)' : 'rgba(139, 92, 246, 0.25)'}`
                      }}>
                        {isResearched ? 'RESEARCH AGENT (WEB SEARCHED)' : 'VISUAL ANALYSIS'}
                      </span>

                      {item.used_tools && item.used_tools.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                          Tools: {item.used_tools.join(', ')}
                        </span>
                      )}
                    </div>

                    <MarkdownView content={item.answer} collapsible={true} maxLength={400} />

                    {/* Sources Cards */}
                    {item.sources && item.sources.length > 0 && (
                      <SourceList sources={item.sources} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
