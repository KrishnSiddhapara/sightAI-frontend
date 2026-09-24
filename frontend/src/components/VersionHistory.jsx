import React from 'react';
import { History, Eye, Download, CheckCircle, ArrowRight, Layers, FileText } from 'lucide-react';

const VersionHistory = ({
  versionHistory,
  activeVersionNum,
  onMakeActive,
  onUseAsSource,
  onDownload
}) => {
  if (!versionHistory || versionHistory.length === 0) return null;

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <History size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F8FAFC' }}>
            🕘 Version History ({versionHistory.length} {versionHistory.length === 1 ? 'version' : 'versions'})
          </h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          All edits are immutable & non-destructive
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {versionHistory.map((v) => {
          const isActive = v.version_number === activeVersionNum;
          const isOriginal = v.version_number === 0;

          return (
            <div
              key={v.version_number}
              style={{
                background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 15px var(--primary-glow)' : 'none'
              }}
            >
              {/* Left: Thumbnail & Version Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: '#000000',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0
                }}>
                  <img
                    src={v.image_base64 || v.preview_url}
                    alt={`Version ${v.version_number}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isActive ? '#A5B4FC' : '#F8FAFC'
                    }}>
                      Version {v.version_number}
                    </span>
                    {isOriginal ? (
                      <span className="badge-pill badge-primary" style={{ fontSize: '0.68rem', padding: '1px 8px' }}>
                        Original
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        (Based on v{v.source_version_number})
                      </span>
                    )}
                    {isActive && (
                      <span className="badge-pill badge-success" style={{ fontSize: '0.68rem', padding: '1px 8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle size={12} /> Active
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 500, marginBottom: '0.2rem' }}>
                    {isOriginal ? 'Original Uploaded Image' : `"${v.edit_prompt}"`}
                  </p>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                    Created at {v.created_at || 'Just now'}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                {!isActive && (
                  <button
                    onClick={() => onMakeActive(v.version_number)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                    title="Set this version as active result"
                  >
                    Make Active
                  </button>
                )}

                <button
                  onClick={() => onUseAsSource(v.version_number)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                  title="Use as base image for next edit"
                >
                  <Layers size={14} /> Use as Base
                </button>

                <button
                  onClick={() => onDownload(v, 'JPEG')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: '#6EE7B7', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <Download size={14} /> JPG
                </button>

                <button
                  onClick={() => onDownload(v, 'PDF')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: '#A5B4FC', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                >
                  <FileText size={14} /> PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VersionHistory;
