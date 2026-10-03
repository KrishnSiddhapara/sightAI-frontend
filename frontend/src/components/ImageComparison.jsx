import React, { useState } from 'react';

const ImageComparison = ({ originalImage, activeVersion }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('side-by-side');

  if (!activeVersion) return null;

  const activeImgUrl = activeVersion.image_base64 || activeVersion.preview_url;
  const isOriginalActive = activeVersion.version_number === 0;

  return (
    <div className="card-glass" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
            Image Comparison
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Compare original upload against active edited version
          </span>
        </div>

        {!isOriginalActive && (
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('side-by-side')}
              style={{
                background: viewMode === 'side-by-side' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'side-by-side' ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('slider')}
              style={{
                background: viewMode === 'slider' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'slider' ? '#FFFFFF' : 'var(--text-muted)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Slider Overlay
            </button>
          </div>
        )}
      </div>

      {viewMode === 'side-by-side' || isOriginalActive ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* LEFT: Original Upload */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '0.75rem' }}>
              Original Image (Version 0)
            </div>
            <div style={{
              height: '320px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#070A11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={originalImage}
                alt="Original Upload"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* RIGHT: Active Version */}
          <div style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${isOriginalActive ? 'var(--border-color)' : 'var(--primary)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isOriginalActive ? '#A5B4FC' : '#6EE7B7', marginBottom: '0.75rem' }}>
              {isOriginalActive ? 'Active Image (Version 0)' : `Active Result (Version ${activeVersion.version_number}: "${activeVersion.edit_prompt}")`}
            </div>
            <div style={{
              height: '320px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#070A11',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={activeImgUrl}
                alt={`Version ${activeVersion.version_number}`}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Slider Overlay View */
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            overflow: 'hidden',
            borderRadius: 'var(--radius-md)',
            background: '#070A11',
            userSelect: 'none'
          }}>
            {/* Active Image (Bottom Layer) */}
            <img
              src={activeImgUrl}
              alt="Active Edit"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />

            {/* Original Image (Clipped Top Layer) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${sliderPos}%`,
              height: '100%',
              overflow: 'hidden',
              borderRight: '2px solid #FFFFFF'
            }}>
              <img
                src={originalImage}
                alt="Original"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Overlay Labels */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: '#FFF',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Original (v0)
            </div>

            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: '#6EE7B7',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Active (v{activeVersion.version_number})
            </div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Edited</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageComparison;
