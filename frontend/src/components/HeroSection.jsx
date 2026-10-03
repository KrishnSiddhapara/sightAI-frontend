import React from 'react';

const HeroSection = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 1rem 1.5rem 1rem',
      maxWidth: '720px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'inline-flex', marginBottom: '0.85rem' }}>
        <span className="badge-pill badge-primary">
          INTERACTIVE COMPUTER VISION
        </span>
      </div>
      
      <h1 style={{
        fontSize: '2.4rem',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: '0.75rem',
        color: '#F8FAFC',
        letterSpacing: '-0.03em'
      }}>
        Precision Object Identification & Visual Spatial Grounding
      </h1>

      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-muted)',
        fontWeight: 400,
        lineHeight: 1.5
      }}>
        Upload an image to perform grounded physical instance verification, spatial bounding box localization, multi-version editing, and visual query processing.
      </p>
    </div>
  );
};

export default HeroSection;
