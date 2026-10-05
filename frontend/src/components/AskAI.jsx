import React, { useState } from 'react';
import MarkdownView from './MarkdownView';
import SourceList from './SourceList';

const AskAI = ({
  qaHistory = [],
  onAskQuestion,
  isAsking,
  apiConfigured,
  askTimer
}) => {
  const [question, setQuestion] = useState('');

  const quickQuestions = [
    "What is this object in the image?",
    "Where can I buy this item in India?",
    "What is its current price and availability?",
    "What processor & technical specs does it have?",
    "Compare price across Amazon India and Flipkart",
    "Explain how RAG works in AI"
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
            Ask AI Agent
          </h3>

        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything (e.g. What is this? / Where can I buy this in India? / Compare prices / Explain technical concept)..."
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
            {isAsking ? 'Agent Thinking...' : 'Ask Agent'}
          </button>

          {/* Live Ask AI Agent Timer Display */}
          {askTimer && askTimer.status === 'running' && (
            <div
              id="ask-live-timer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.55rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid var(--primary)',
                color: 'var(--primary-text)',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 0 8px var(--primary)'
              }} />
              <span>{askTimer.elapsedSeconds}s</span>
            </div>
          )}

          {/* Final Agent Completion Timer Display */}
          {askTimer && askTimer.status === 'completed' && (
            <div
              id="ask-final-timer"
              style={{
                fontSize: '0.875rem',
                color: 'var(--success-text)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap'
              }}
            >
              Research completed in {askTimer.finalDuration}s
            </div>
          )}

          {/* Agent Failure Duration Display */}
          {askTimer && askTimer.status === 'failed' && (
            <div
              id="ask-failed-timer"
              style={{
                fontSize: '0.875rem',
                color: 'var(--danger-text)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap'
              }}
            >
              Query failed after {askTimer.finalDuration}s
            </div>
          )}
        </div>
      </form>

      {/* Quick Questions Chips */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
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

      {/* Agent Processing Loading State Indicator */}
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
            Gemini AI Agent Executing Query Plan...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>✓ Classifying intent & resolving conversation entity references</span>
            <span>● Evaluating visual context & high-quality image details</span>
            <span>○ Searching live web evidence with India-first priority for shopping</span>
            <span>○ Synthesizing comprehensive grounded response</span>
          </div>
        </div>
      )}

      {/* Chat Conversation History List */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
        {qaHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-subtle)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
              No agent queries submitted yet
            </p>
            <span style={{ fontSize: '0.8rem' }}>
              Ask a question above or click a prompt suggestion to start Gemini AI Agent conversation.
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
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `3px solid ${isResearched ? 'var(--success)' : 'var(--primary)'}`,
                    fontSize: '0.9rem',
                    lineHeight: 1.65
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        color: isResearched ? 'var(--success)' : 'var(--primary)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: isResearched ? 'var(--success-bg)' : 'var(--primary-glow)',
                        padding: '2px 8px',
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
                    <MarkdownView content={item.answer} collapsible={false} />

                    {/* Source Cards */}
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
