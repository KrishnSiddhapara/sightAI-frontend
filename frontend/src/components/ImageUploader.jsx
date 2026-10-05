import React, { useState, useRef } from 'react';

const ImageUploader = ({
  selectedFile,
  imagePreview,
  imageDimensions,
  onFileSelect,
  onRemoveImage,
  onAnalyze,
  isAnalyzing,
  apiConfigured,
  analysisTimer
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_MB = 10;

  const validateAndProcessFile = (file) => {
    setValidationError(null);
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setValidationError(`File size (${sizeMB.toFixed(1)} MB) exceeds 10 MB limit. Please choose a smaller image.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto 2rem auto' }}>
      {validationError && (
        <div style={{
          background: 'var(--danger-bg)',
          border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.1rem',
          color: 'var(--danger)',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          <span>{validationError}</span>
        </div>
      )}

      {!imagePreview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            background: isDragOver ? 'var(--primary-glow)' : 'var(--bg-surface)',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
          />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--heading)' }}>
            Upload Image
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Drag and drop your image here or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse files</span>
          </p>
          <div style={{
            display: 'inline-block',
            background: 'var(--bg-secondary)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            JPG • PNG • WEBP — Max 10 MB
          </div>
        </div>
      ) : (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Image Preview Thumbnail */}
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={imagePreview}
                alt="Uploaded preview"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* File Info */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--success-text)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                IMAGE READY FOR ANALYSIS
              </div>
              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--heading)',
                marginBottom: '0.4rem',
                wordBreak: 'break-all'
              }}>
                {selectedFile?.name || 'Uploaded Image'}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedFile?.size && (
                  <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                )}
                {imageDimensions && (
                  <span>Dimensions: {imageDimensions.width} × {imageDimensions.height} px</span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
                >
                  Replace
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={onRemoveImage}
                  className="btn-danger"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Primary CTA Button & Live Timer */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={onAnalyze}
                disabled={isAnalyzing || !apiConfigured}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem 1.5rem', fontSize: '1rem', minWidth: '180px' }}
              >
                {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}
              </button>

              {/* Live Timer Display while analyzing */}
              {analysisTimer && analysisTimer.status === 'running' && (
                <div
                  id="analysis-live-timer"
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
                  <span>{analysisTimer.elapsedSeconds}s</span>
                </div>
              )}

              {/* Final Analysis Time display on completion */}
              {analysisTimer && analysisTimer.status === 'completed' && (
                <div
                  id="analysis-final-timer"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--success-text)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Analysis completed in {analysisTimer.finalDuration}s
                </div>
              )}

              {/* Error duration display on failure */}
              {analysisTimer && analysisTimer.status === 'failed' && (
                <div
                  id="analysis-failed-timer"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--danger-text)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Analysis failed after {analysisTimer.finalDuration}s
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
