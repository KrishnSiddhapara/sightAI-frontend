import React, { useState } from 'react';

const Navbar = ({ activeTab, setActiveTab, apiConnected, apiConfigured }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'analyze', label: 'Analyze' },
    { id: 'edit', label: 'AI Editor' },
    { id: 'ask', label: 'Ask AI' },
    { id: 'history', label: 'Version History' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 23, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '-0.03em'
          }}>
            AI
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                SightAI
              </span>
              <span style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#A5B4FC',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)'
              }}>
                Enterprise Vision
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
              Multimodal image analysis & grounded object detection
            </span>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-full)',
          padding: '0.25rem',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Status Indicator & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: apiConnected ? (apiConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)') : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${apiConnected ? (apiConfigured ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)') : 'rgba(239, 68, 68, 0.25)'}`,
            fontSize: '0.78rem',
            fontWeight: 500,
            color: apiConnected ? (apiConfigured ? '#6EE7B7' : '#FCD34D') : '#FCA5A5'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: apiConnected ? (apiConfigured ? '#10B981' : '#F59E0B') : '#EF4444',
            }} className="animate-pulse" />
            <span>
              {apiConnected ? (apiConfigured ? 'System Active' : 'API Key Missing') : 'Backend Offline'}
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.75rem',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
