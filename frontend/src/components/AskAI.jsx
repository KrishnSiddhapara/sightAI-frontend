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
    "Where can I purchase this item / book?",
    "What is the current price and availability?",
    "What processor & technical specs does it have?",
    "Compare this product with alternatives",
    "What color is the object in this image?"
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
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--heading)' }}>
            AI Research Agent & Visual Q&A
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Answers visual queries or researches live market prices, technical specs, purchase options, and verified web sources
          </span>
        </div>

        {/* Region selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Region:</span>
          <select
            value={userRegion || 'Global'}
            onChange={(e) => setUserRegion && setUserRegion(e.target.value === 'Global' ? '' : e.target.value)}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--input-text)',
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
            placeholder="Ask anything (e.g. Where can I purchase this? / What is its price? / Compare with iPhone 17)..."
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
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem', uppercase: 'true' }}>
          Suggested Prompts:
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
                color: 'var(--text-secondary)',
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
          background: 'var(--primary-glow)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
            <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
            Autonomous AI Agent Researching...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>✓ Classifying intent & resolving entity references</span>
            <span>● Searching multi-source web evidence & checking live availability</span>
            <span>○ Synthesizing grounded response with verified citations</span>
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
              const intentTag = item.intent ? item.intent.replace(/_/g, ' ') : (isResearched ? 'WEB RESEARCH' : 'VISUAL ANALYSIS');
              
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

                  {/* AI Answer Card */}
                  <div style={{
                    alignSelf: 'flex-start',
                    maxWidth: '92%',
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${isResearched ? 'var(--success)' : 'var(--secondary)'}`,
                    fontSize: '0.9rem',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        color: isResearched ? 'var(--success)' : 'var(--secondary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: isResearched ? 'var(--success-bg)' : 'var(--primary-glow)',
                        padding: '1px 7px',
                        borderRadius: 'var(--radius-full)',
                        border: `1px solid ${isResearched ? 'var(--success-border)' : 'var(--border-color)'}`
                      }}>
                        {intentTag}
                      </span>

                      {item.used_tools && item.used_tools.length > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                          Tools: {item.used_tools.join(', ')}
                        </span>
                      )}
                    </div>

                    {/* Rendered Answer Content */}
                    <MarkdownView content={item.answer} collapsible={true} maxLength={450} />

                    {/* Verified Source Cards */}
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
