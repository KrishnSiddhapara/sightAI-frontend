import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Box, AlertCircle } from 'lucide-react';

const ObjectInstanceCard = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!category) return null;

  const isPerson = category.name.toLowerCase() === 'person';
  const instances = category.instances || [];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '1rem',
      overflow: 'hidden'
    }}>
      {/* Category Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '1rem 1.25rem',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isPerson ? (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8B5CF6'
            }}>
              <User size={18} />
            </div>
          ) : (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6366F1'
            }}>
              <Box size={18} />
            </div>
          )}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F8FAFC', textTransform: 'capitalize' }}>
              {category.name}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Confirmed Count: {category.confirmed_count}
              {category.uncertain_count > 0 && ` • (${category.uncertain_count} unconfirmed)`}
            </span>
          </div>
        </div>

        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Instance Content */}
      {isExpanded && (
        <div style={{ padding: '1.25rem' }}>
          {category.uncertain_count > 0 && (
            <div style={{
              background: 'var(--warning-bg)',
              border: '1px solid var(--warning-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 0.85rem',
              color: '#FCD34D',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>Note: {category.uncertain_count} additional instance(s) are partially occluded or unconfirmed.</span>
            </div>
          )}

          {instances.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
              No individual instance attributes extracted.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {instances.map((inst, idx) => {
                const attr = inst.attributes || {};
                return (
                  <div
                    key={inst.id || idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: isPerson ? '#A78BFA' : '#818CF8',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        Instance {inst.id}
                      </span>
                    </div>

                    {inst.uncertainty_reason && (
                      <p style={{ fontSize: '0.8rem', color: '#FCD34D', marginBottom: '0.75rem' }}>
                        ⚠️ {inst.uncertainty_reason}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                      {isPerson ? (
                        <>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Clothing: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.clothing || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Clothing Colors: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.clothing_color || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Pose: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.pose || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Action: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.action || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Accessories: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.accessories || 'none visible'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Color: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.object_color || 'not clearly visible'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Type / Characteristics: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.type_or_subtype || 'unknown'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Visible Details: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.visible_details || 'none noted'}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>Pose / State: </span>
                            <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{attr.pose || 'unknown'}</span>
                          </div>
                        </>
                      )}
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
