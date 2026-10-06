import React, { useState, useEffect, useRef } from 'react';
import {
  imageCoordinatesToDisplayCoordinates,
  calculateImageRenderMetrics,
  normalizeBoundingBox
} from '../utils/coordinateTransform';

/**
 * Color palette for object categories/instances
 */
const COLOR_PALETTE = [
  { border: '#6366F1', bg: 'rgba(99, 102, 241, 0.2)', labelBg: '#4F46E5' },
  { border: '#10B981', bg: 'rgba(16, 185, 129, 0.2)', labelBg: '#059669' },
  { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)', labelBg: '#D97706' },
  { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.2)', labelBg: '#DB2777' },
  { border: '#06B6D4', bg: 'rgba(6, 182, 212, 0.2)', labelBg: '#0891B2' },
  { border: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.2)', labelBg: '#7C3AED' },
];

const getCategoryColor = (catIndex) => {
  return COLOR_PALETTE[catIndex % COLOR_PALETTE.length];
};

const ObjectDetectionViewer = ({
  imageSrc,
  categories = [],
  imageMetadata = null,
  showObjectDetection = false,
  selectedCategory = null,
  selectedInstance = null,
  hoveredInstance = null,
  onSelectInstance,
  onHoverInstance
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [isDebugMode, setIsDebugMode] = useState(() => {
    return typeof window !== 'undefined' && !!window.__SIGHTAI_DEBUG_BBOX;
  });

  const [renderBounds, setRenderBounds] = useState({
    containerWidth: 0,
    containerHeight: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    displayedWidth: 0,
    displayedHeight: 0,
    offsetLeft: 0,
    offsetTop: 0,
    scaleX: 1,
    scaleY: 1,
    isLoaded: false
  });

  // Calculate actual rendered image rectangle inside container (handling object-fit: contain)
  const updateImageBounds = () => {
    const img = imgRef.current;
    const container = containerRef.current;

    if (!img || !container) return;

    if (!img.naturalWidth || !img.naturalHeight) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth <= 0 || containerHeight <= 0) return;

    const metrics = calculateImageRenderMetrics({
      containerWidth,
      containerHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      objectFit: 'contain'
    });

    setRenderBounds({
      containerWidth,
      containerHeight,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayedWidth: metrics.displayedWidth,
      displayedHeight: metrics.displayedHeight,
      offsetLeft: metrics.offsetX,
      offsetTop: metrics.offsetY,
      scaleX: metrics.scaleX,
      scaleY: metrics.scaleY,
      isLoaded: true
    });
  };

  useEffect(() => {
    const img = imgRef.current;
    const container = containerRef.current;

    const handleBounds = () => {
      updateImageBounds();
    };

    handleBounds();

    let resizeObserver;
    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        handleBounds();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', handleBounds);

    if (img) {
      if (img.complete) {
        handleBounds();
      } else {
        img.addEventListener('load', handleBounds);
      }
    }

    return () => {
      window.removeEventListener('resize', handleBounds);
      if (resizeObserver) resizeObserver.disconnect();
      if (img) img.removeEventListener('load', handleBounds);
    };
  }, [imageSrc]);

  // Sync window global debug mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__SIGHTAI_DEBUG_BBOX = isDebugMode;
    }
  }, [isDebugMode]);

  // Extract all instances with bounding boxes
  const allInstancesWithBoxes = [];
  categories.forEach((cat, catIdx) => {
    const color = getCategoryColor(catIdx);
    (cat.instances || []).forEach((inst) => {
      if (inst.bounding_box) {
        allInstancesWithBoxes.push({
          categoryName: cat.name,
          catIdx,
          instance: inst,
          color
        });
      }
    });
  });

  // Find active or hovered instance for debug readout
  const activeOrHoveredBox = allInstancesWithBoxes.find(
    item => item.instance.id === hoveredInstance || item.instance.id === selectedInstance
  ) || allInstancesWithBoxes[0];

  return (
    <div className="card-glass" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header bar with Debug Mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Image Subject & Bounding Overlay
        </span>
        <button
          type="button"
          onClick={() => setIsDebugMode(!isDebugMode)}
          style={{
            background: isDebugMode ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: `1px solid ${isDebugMode ? '#6366F1' : 'var(--border-color)'}`,
            color: isDebugMode ? '#818CF8' : 'var(--text-muted)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Toggle Bounding Box Developer Coordinate Debug HUD"
        >
          <span>🐛</span> {isDebugMode ? 'Debug Mode ON' : 'Debug Mode'}
        </button>
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: '#070A11',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Analysis Subject"
          onLoad={updateImageBounds}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            display: 'block'
          }}
        />

        {/* Bounding Box Overlay Layer - Rendered ONLY when showObjectDetection is ON */}
        {showObjectDetection && renderBounds.isLoaded && (
          <div
            style={{
              position: 'absolute',
              left: `${renderBounds.offsetLeft}px`,
              top: `${renderBounds.offsetTop}px`,
              width: `${renderBounds.displayedWidth}px`,
              height: `${renderBounds.displayedHeight}px`,
              pointerEvents: 'none'
            }}
          >
            {allInstancesWithBoxes.map(({ categoryName, instance, color }) => {
              const transform = imageCoordinatesToDisplayCoordinates({
                bbox: instance.bounding_box,
                containerWidth: renderBounds.containerWidth,
                containerHeight: renderBounds.containerHeight,
                naturalWidth: renderBounds.naturalWidth,
                naturalHeight: renderBounds.naturalHeight,
                objectFit: 'contain'
              });

              if (!transform) return null;

              // Position relative to rendered image overlay
              const relLeft = transform.normX1 * renderBounds.displayedWidth;
              const relTop = transform.normY1 * renderBounds.displayedHeight;
              const width = (transform.normX2 - transform.normX1) * renderBounds.displayedWidth;
              const height = (transform.normY2 - transform.normY1) * renderBounds.displayedHeight;

              const isInstanceActive = selectedInstance === instance.id;
              const isCategoryActive = selectedCategory?.toLowerCase() === categoryName.toLowerCase();
              const isHovered = hoveredInstance === instance.id;

              const hasActiveSelection = selectedInstance !== null || selectedCategory !== null;

              let opacity = 1;
              let borderWidth = '2px';
              let zIndex = 10;
              let bgTint = 'rgba(0, 0, 0, 0.05)';
              let boxShadow = 'none';

              if (hasActiveSelection) {
                if (isInstanceActive) {
                  opacity = 1;
                  borderWidth = '3px';
                  zIndex = 30;
                  bgTint = color.bg;
                  boxShadow = `0 0 16px ${color.border}`;
                } else if (isCategoryActive) {
                  opacity = 1;
                  borderWidth = '2px';
                  zIndex = 20;
                  bgTint = color.bg;
                } else {
                  opacity = 0.2;
                  borderWidth = '1px';
                }
              }

              if (isHovered) {
                opacity = 1;
                borderWidth = '3px';
                zIndex = 40;
                boxShadow = `0 0 20px ${color.border}`;
              }

              const displayLabel = instance.id ? instance.id.replace('_', ' ') : (categoryName || 'object');
              const labelWidthEst = Math.min(180, Math.max(60, displayLabel.length * 7.5 + 20));

              // Dynamic Boundary-Aware Positioning
              const isNearTopEdge = relTop < 26;
              const isNearRightEdge = (relLeft + labelWidthEst) > renderBounds.displayedWidth;

              const labelStyle = {
                position: 'absolute',
                background: 'rgba(15, 23, 42, 0.94)',
                color: '#F8FAFC',
                border: `1px solid ${color.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                maxWidth: `${Math.min(180, Math.max(100, renderBounds.displayedWidth - 16))}px`,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                pointerEvents: 'none',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 15
              };

              // Vertical placement logic
              if (isNearTopEdge) {
                if (height >= 30) {
                  labelStyle.top = '4px';
                } else {
                  labelStyle.top = `${height + 4}px`;
                }
              } else {
                labelStyle.top = '-24px';
              }

              // Horizontal placement logic
              if (isNearRightEdge) {
                labelStyle.left = 'auto';
                labelStyle.right = '0px';
              } else {
                labelStyle.left = Math.max(0, relLeft < 0 ? -relLeft : -2) + 'px';
              }

              return (
                <div
                  key={instance.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectInstance) {
                      onSelectInstance(instance.id, categoryName);
                    }
                  }}
                  onMouseEnter={() => onHoverInstance && onHoverInstance(instance.id)}
                  onMouseLeave={() => onHoverInstance && onHoverInstance(null)}
                  style={{
                    position: 'absolute',
                    left: `${relLeft}px`,
                    top: `${relTop}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    border: `${borderWidth} solid ${color.border}`,
                    backgroundColor: bgTint,
                    boxShadow: boxShadow,
                    opacity: opacity,
                    zIndex: zIndex,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Dynamic Boundary-Safe Instance Label */}
                  <div style={labelStyle}>
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: color.border,
                      flexShrink: 0
                    }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {displayLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Developer Debug HUD Overlay */}
        {isDebugMode && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              background: 'rgba(7, 10, 17, 0.92)',
              border: '1px solid #6366F1',
              borderRadius: '6px',
              padding: '8px 12px',
              color: '#38BDF8',
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              pointerEvents: 'none',
              zIndex: 100,
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontWeight: 700, color: '#A5B4FC', borderBottom: '1px solid #312E81', paddingBottom: '3px' }}>
              📐 SIGHTAI BOUNDING BOX DEBUG HUD
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              <div>
                <span style={{ color: '#94A3B8' }}>Source Image:</span> {renderBounds.naturalWidth} × {renderBounds.naturalHeight} px
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Container:</span> {renderBounds.containerWidth} × {renderBounds.containerHeight} px
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Rendered Image:</span> {renderBounds.displayedWidth.toFixed(1)} × {renderBounds.displayedHeight.toFixed(1)} px
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Scale Factor:</span> {renderBounds.scaleX.toFixed(4)}
              </div>
              <div>
                <span style={{ color: '#94A3B8' }}>Offset (X,Y):</span> ({renderBounds.offsetLeft.toFixed(1)}, {renderBounds.offsetTop.toFixed(1)}) px
              </div>
              {imageMetadata && (
                <div>
                  <span style={{ color: '#94A3B8' }}>VLM Preprocessed:</span> {imageMetadata.analysis_width} × {imageMetadata.analysis_height} px
                </div>
              )}
            </div>

            {activeOrHoveredBox && (
              <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #334155', color: '#F1F5F9' }}>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>Target [{activeOrHoveredBox.instance.id}]: </span>
                <span>Raw: [{activeOrHoveredBox.instance.bounding_box?.x_min}, {activeOrHoveredBox.instance.bounding_box?.y_min}, {activeOrHoveredBox.instance.bounding_box?.x_max}, {activeOrHoveredBox.instance.bounding_box?.y_max}] </span>
                {(() => {
                  const norm = normalizeBoundingBox(activeOrHoveredBox.instance.bounding_box);
                  if (!norm) return null;
                  const transform = imageCoordinatesToDisplayCoordinates({
                    bbox: activeOrHoveredBox.instance.bounding_box,
                    containerWidth: renderBounds.containerWidth,
                    containerHeight: renderBounds.containerHeight,
                    naturalWidth: renderBounds.naturalWidth,
                    naturalHeight: renderBounds.naturalHeight,
                    objectFit: 'contain'
                  });
                  return (
                    <span>
                      | Norm: [{norm.x1.toFixed(3)}, {norm.y1.toFixed(3)}, {norm.x2.toFixed(3)}, {norm.y2.toFixed(3)}]
                      {transform && transform.sourcePixels && ` | SourcePx: [${transform.sourcePixels.x1}, ${transform.sourcePixels.y1}] -> [${transform.sourcePixels.x2}, ${transform.sourcePixels.y2}]`}
                      {transform && ` | RenderPx: left=${transform.left.toFixed(1)}, top=${transform.top.toFixed(1)}, w=${transform.width.toFixed(1)}, h=${transform.height.toFixed(1)}`}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetectionViewer;
