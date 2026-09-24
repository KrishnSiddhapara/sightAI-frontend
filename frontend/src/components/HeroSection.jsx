import React from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '2.5rem 1rem 1.5rem 1rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
        <span className="badge-pill badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} /> AI Vision Analysis
        </span>
      </div>
      
      <h1 style={{
        fontSize: '2.75rem',
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #A5B4FC 50%, #C084FC 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em'
      }}>
        Understand what's inside your image.
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-muted)',
        fontWeight: 400,
        lineHeight: 1.6
      }}>
        Upload an image and let Gemini analyze objects, people, attributes and the complete scene with zero hallucination.
      </p>
    </div>
  );
};

export default HeroSection;
