import React, { useState } from 'react';

const DetectedObjectsPanel = ({
  categories = [],
  selectedCategory = null,
  selectedInstance = null,
  hoveredInstance = null,
  onSelectCategory,
  onSelectInstance,
  onHoverInstance
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategoryExpand = (catName, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="card-glass" style={{ padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-subtle)', uppercase: 'true', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          DETECTED OBJECTS
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
          No verified physical objects detected in this image.
        </p>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.05em' }}>
          DETECTED OBJECTS
        </h4>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          Select to locate
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {categories.map((cat) => {
          const isCategorySelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase() && selectedInstance === null;
          const isExpanded = expandedCategories[cat.name] ?? false;
          const instances = cat.instances || [];

          return (
            <div
              key={cat.name}
              style={{
                borderRadius: 'var(--radius-md)',
                border: isCategorySelected
                  ? '1px solid var(--primary)'
                  : '1px solid var(--border-color)',
                background: isCategorySelected
                  ? 'rgba(99, 102, 241, 0.12)'
                  : 'var(--bg-surface)',
                overflow: 'hidden',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Category Control Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isCategorySelected) {
                      onSelectCategory(null);
                    } else {
                      onSelectCategory(cat.name);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'none',
                    border: 'none',
                    color: '#F8FAFC',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    flex: 1,
                    textAlign: 'left'
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isCategorySelected ? 'var(--primary)' : 'var(--text-subtle)'
                  }} />
                  <span>{cat.name}</span>
                  <span style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: isCategorySelected ? '#A5B4FC' : 'var(--text-muted)',
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {cat.confirmed_count}
                  </span>
                  {cat.uncertain_count > 0 && (
                    <span style={{
                      color: 'var(--warning)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      (+{cat.uncertain_count} unconfirmed)
                    </span>
                  )}
                </button>

                {/* Expand Toggle Button for Instances */}
                {instances.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => toggleCategoryExpand(cat.name, e)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                    aria-label={`Toggle instances for ${cat.name}`}
                  >
                    {isExpanded ? 'Hide' : `Instances (${instances.length})`}
                  </button>
                )}
              </div>

              {/* Nested Instance Selection List */}
              {isExpanded && instances.length > 0 && (
                <div style={{
                  padding: '0.5rem 0.85rem 0.65rem 1.75rem',
                  borderTop: '1px solid var(--border-color)',
                  background: 'rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  {instances.map((inst) => {
                    const isInstanceSelected = selectedInstance === inst.id;
                    const isHovered = hoveredInstance === inst.id;
                    const hasBox = !!inst.bounding_box;

                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => {
                          if (isInstanceSelected) {
                            onSelectInstance(null, null);
                          } else {
                            onSelectInstance(inst.id, cat.name);
                          }
                        }}
                        onMouseEnter={() => onHoverInstance && onHoverInstance(inst.id)}
                        onMouseLeave={() => onHoverInstance && onHoverInstance(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isInstanceSelected
                            ? '1px solid var(--secondary)'
                            : (isHovered ? '1px solid var(--border-hover)' : '1px solid transparent'),
                          background: isInstanceSelected
                            ? 'rgba(139, 92, 246, 0.2)'
                            : (isHovered ? 'var(--bg-secondary)' : 'transparent'),
                          color: isInstanceSelected ? '#DDD6FE' : 'var(--text-main)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-mono)' }}>
                          {inst.id}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          color: hasBox ? 'var(--success)' : 'var(--text-subtle)'
                        }}>
                          {hasBox ? 'Localized' : 'No bbox'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetectedObjectsPanel;
