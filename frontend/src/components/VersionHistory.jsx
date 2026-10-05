import React from 'react';

const formatDisplayTime = (record) => {
  if (record.formatted_time) {
    return record.formatted_time;
  }
  if (!record.created_at) return 'Just now';
  
  try {
    const d = new Date(record.created_at);
    if (isNaN(d.getTime())) return record.created_at;

    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const timeStr = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return `${day} ${month} ${year} • ${timeStr}`;
  } catch (e) {
    return record.created_at;
  }
};

const VersionHistory = ({
  versionHistory,
  activeVersionNum,
  onMakeActive,
  onUseAsSource,
  onDownload
}) => {
  if (!versionHistory || versionHistory.length === 0) return null;

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--heading)' }}>
            Version History ({versionHistory.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Immutable edit history with server timestamps & non-destructive image versions
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {versionHistory.map((v) => {
          const isActive = v.version_number === activeVersionNum;
          const isOriginal = v.version_number === 0;
          const displayTime = formatDisplayTime(v);

          return (
            <div
              key={v.version_number}
              style={{
                background: isActive ? 'var(--primary-glow)' : 'var(--bg-surface)',
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Left: Thumbnail & Version Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={v.image_base64 || v.preview_url}
                    alt={`Version ${v.version_number}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: isActive ? 'var(--primary-text)' : 'var(--heading)'
                    }}>
                      Version {v.version_number}
                    </span>

                    {isOriginal ? (
                      <span className="badge-pill badge-primary" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                        Original
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        Based on Version {v.source_version_number ?? 0}
                      </span>
                    )}

                    {isActive && (
                      <span className="badge-pill badge-success" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                        Active
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    {isOriginal ? 'Original Uploaded Image' : `Prompt: "${v.edit_prompt}"`}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{isOriginal ? 'Created:' : 'Edited:'} {displayTime}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {!isActive && (
                  <button
                    onClick={() => onMakeActive(v.version_number)}
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    Make Active
                  </button>
                )}

                <button
                  onClick={() => onUseAsSource(v.version_number)}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Use as Base
                </button>

                <button
                  onClick={() => onDownload(v, 'JPEG')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', color: 'var(--success-text)' }}
                >
                  JPG
                </button>

                <button
                  onClick={() => onDownload(v, 'PNG')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', color: 'var(--primary-text)' }}
                >
                  PNG
                </button>

                <button
                  onClick={() => onDownload(v, 'PDF')}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', color: 'var(--primary-text)' }}
                >
                  PDF
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
