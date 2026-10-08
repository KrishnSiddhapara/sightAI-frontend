import React, { useState } from 'react';
import MarkdownView from './MarkdownView';
import SourceList from './SourceList';

const AskAI = ({
  qaHistory = [],
  onAskQuestion,
  isAsking,
  apiConfigured,
  askTimer,
  imagePreview
}) => {
  const [question, setQuestion] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const quickQuestions = [
    "What is this object in the image?",
    "Where can I buy this item in India?",
    "What is its current price and availability?",
    "What processor & technical specs does it have?",
    "Compare price across Amazon India and Flipkart",
    "Describe the key visual elements and colors in this photo"
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
    <div style={{ marginBottom: '2rem' }}>
      {/* 2-Column Responsive Layout: Left Big Image, Right Interactive AI Agent Q&A */}
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '1.5rem' }}>
        
        {/* Left Column: Big Image Display Card for Visual Grounded Q&A */}
        <div className="card-glass" style={{ padding: '1.25rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🖼️</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>
                Uploaded Image Context
              </h3>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
                title="Expand to Fullscreen View"
              >
                <span>🔍</span> Full View
              </button>
            )}
          </div>

          {/* Large Image Frame */}
          <div
            onClick={() => imagePreview && setIsLightboxOpen(true)}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '380px',
              maxHeight: '560px',
              height: '500px',
              background: '#070A11',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: imagePreview ? 'pointer' : 'default'
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded Subject Context"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 0.2s ease'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                <p style={{ fontSize: '0.9rem' }}>No image loaded for visual analysis</p>
              </div>
            )}

            {/* Hover overlay hint */}
            {imagePreview && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(7, 10, 17, 0.85)',
                  border: '1px solid var(--border-color)',
                  color: '#F8FAFC',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>🔍 Click to expand image</span>
              </div>
            )}
          </div>

          {/* Visual AI Status Indicator */}
          <div style={{
            marginTop: '0.85rem',
            padding: '0.65rem 0.85rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
              Visual Context Active
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Gemini Vision Enabled
            </span>
          </div>
        </div>

        {/* Right Column: Q&A Agent Panel */}
        <div className="card-glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--heading)' }}>
                Ask AI Agent
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Ask anything about the uploaded image or research live web specs & prices
              </span>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about this image (e.g. What is this? / Where can I buy this in India? / Specs)..."
                className="input-base"
                style={{ flex: 1, minWidth: '240px' }}
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
                  Completed in {askTimer.finalDuration}s
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
                  Failed after {askTimer.finalDuration}s
                </div>
              )}
            </div>
          </form>

          {/* Quick Questions Chips */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Suggested Image Prompts:
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
                <span>● Evaluating visual context of uploaded image</span>
                <span>○ Searching live web evidence with India-first priority for shopping</span>
                <span>○ Synthesizing comprehensive grounded response</span>
              </div>
            </div>
          )}

          {/* Chat Conversation History List */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', flex: 1 }}>
            {qaHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-subtle)' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  No questions asked yet
                </p>
                <span style={{ fontSize: '0.825rem' }}>
                  Ask any question about your uploaded image above or choose a prompt suggestion.
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
                        maxWidth: '96%',
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

      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {isLightboxOpen && imagePreview && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92vw',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              ✕
            </button>
            <img
              src={imagePreview}
              alt="Uploaded Subject Lightbox View"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            />
            <span style={{ color: '#E2E8F0', marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 500 }}>
              Uploaded Image Full Resolution View (Click outside to close)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAI;

