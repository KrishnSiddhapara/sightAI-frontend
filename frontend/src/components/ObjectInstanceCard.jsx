import React, { useState } from 'react';

const ObjectInstanceCard = ({ category, selectedInstance = null, onSelectInstance = null }) => {
  // Attributes closed by default per requirement 9
  const [isExpanded, setIsExpanded] = useState(false);

  if (!category) return null;

  const isPerson = category.name.toLowerCase() === 'person';
  const instances = category.instances || [];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '0.85rem',
      overflow: 'hidden'
    }}>
      {/* Category Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '0.75rem 1.1rem',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--heading)', textTransform: 'capitalize' }}>
            {category.name}
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            ({category.confirmed_count} confirmed{category.uncertain_count > 0 ? `, ${category.uncertain_count} unconfirmed` : ''})
          </span>
        </div>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          {isExpanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Instance Content - Collapsed by default */}
      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          {category.uncertain_count > 0 && (
            <div style={{
              background: 'var(--warning-bg)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.75rem',
              color: 'var(--warning-text)',
              fontSize: '0.8rem',
              marginBottom: '0.85rem'
            }}>
              Note: {category.uncertain_count} additional instance(s) are partially occluded or unconfirmed.
            </div>
          )}

          {instances.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
              No individual instance attributes extracted.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {instances.map((inst, idx) => {
                const attr = inst.attributes || {};
                const isSelected = selectedInstance === inst.id;
                const hasBox = !!inst.bounding_box;

                return (
                  <div
                    key={inst.id || idx}
                    style={{
                      background: isSelected ? 'var(--primary-glow)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.6rem',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '0.4rem'
                    }}>
                      <span style={{
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        color: 'var(--primary-text)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        Instance {inst.id}
                      </span>

                      {onSelectInstance && (
                        <button
                          type="button"
                          onClick={() => onSelectInstance(inst.id, category.name)}
                          style={{
                            background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? 'Selected' : 'View on Image'}
                        </button>
                      )}
                    </div>

                    {inst.uncertainty_reason && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--warning-text)', marginBottom: '0.5rem' }}>
                        Uncertainty: {inst.uncertainty_reason}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem' }}>
                      {isPerson ? (
                        <>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Clothing: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.clothing || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Clothing Colors: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.clothing_color || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Pose: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.pose || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Action: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.action || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Accessories: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.accessories || 'none visible'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Color: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.object_color || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Type / Characteristics: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.type_or_subtype || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Visible Details: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.visible_details || 'none noted'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Pose / State: </span>
                            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{attr.pose || 'unknown'}</span>
                          </div>
                        </>
                      )}

                      <div style={{ marginTop: '0.25rem', paddingTop: '0.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        Bounding Box: {hasBox ? `[${inst.bounding_box.x_min}, ${inst.bounding_box.y_min}, ${inst.bounding_box.x_max}, ${inst.bounding_box.y_max}]` : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectInstanceCard;
