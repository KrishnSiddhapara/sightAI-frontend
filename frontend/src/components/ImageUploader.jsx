import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, Search, AlertCircle, FileCheck } from 'lucide-react';

const ImageUploader = ({
  selectedFile,
  imagePreview,
  imageDimensions,
  onFileSelect,
  onRemoveImage,
  onAnalyze,
  isAnalyzing,
  apiConfigured
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
          color: '#FCA5A5',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} shrink={0} />
          <span>{validationError}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--primary)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-lg)',
            background: isDragOver ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: isDragOver ? '0 0 25px var(--primary-glow)' : 'none'
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
          />
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            color: 'var(--primary)'
          }}>
            <UploadCloud size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: '#F8FAFC' }}>
            Drop your image here
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            or <span style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>browse from your device</span>
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-secondary)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
            fontWeight: 500
          }}>
            <ImageIcon size={14} /> JPG, PNG, WEBP • Max 10 MB
          </div>
        </div>
      ) : (
        <div className="card-glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Image Preview Thumbnail */}
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000000',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                src={imagePreview}
                alt="Uploaded preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* File Info */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <FileCheck size={18} color="var(--success)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600, uppercase: 'true' }}>
                  Image Loaded & Ready
                </span>
              </div>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#F8FAFC',
                marginBottom: '0.4rem',
                wordBreak: 'break-all'
              }}>
                {selectedFile.name}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                {imageDimensions && (
                  <span>Dimensions: {imageDimensions.width} × {imageDimensions.height} px</span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  <RefreshCw size={14} /> Replace
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
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || !apiConfigured}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1.05rem' }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={20} className="animate-spin" /> Analyzing Image...
                </>
              ) : (
                <>
                  <Search size={20} /> Analyze Image
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
