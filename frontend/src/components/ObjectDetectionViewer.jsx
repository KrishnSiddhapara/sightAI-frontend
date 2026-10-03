import React, { useState, useEffect, useRef } from 'react';

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
  showObjectDetection = false,
  selectedCategory = null,
  selectedInstance = null,
  hoveredInstance = null,
  onSelectInstance,
  onHoverInstance
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [renderBounds, setRenderBounds] = useState({
    displayedWidth: 0,
    displayedHeight: 0,
    offsetLeft: 0,
    offsetTop: 0,
    isLoaded: false
  });

  // Calculate actual rendered image rectangle inside container (handling object-fit: contain)
  const updateImageBounds = () => {
    const img = imgRef.current;
    const container = containerRef.current;

    if (!img || !container || !img.naturalWidth || !img.naturalHeight) {
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    let displayedWidth = 0;
    let displayedHeight = 0;
    let offsetLeft = 0;
    let offsetTop = 0;

    if (imgRatio > containerRatio) {
      displayedWidth = containerWidth;
      displayedHeight = containerWidth / imgRatio;
      offsetLeft = 0;
      offsetTop = (containerHeight - displayedHeight) / 2;
    } else {
      displayedHeight = containerHeight;
      displayedWidth = containerHeight * imgRatio;
      offsetLeft = (containerWidth - displayedWidth) / 2;
      offsetTop = 0;
    }

    setRenderBounds({
      displayedWidth,
      displayedHeight,
      offsetLeft,
      offsetTop,
      isLoaded: true
    });
  };

  useEffect(() => {
    updateImageBounds();
    window.addEventListener('resize', updateImageBounds);
    return () => window.removeEventListener('resize', updateImageBounds);
  }, [imageSrc]);

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

  return (
    <div className="card-glass" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              const bbox = instance.bounding_box;
              if (!bbox) return null;

              const left = (bbox.x_min / 1000) * renderBounds.displayedWidth;
              const top = (bbox.y_min / 1000) * renderBounds.displayedHeight;
              const width = ((bbox.x_max - bbox.x_min) / 1000) * renderBounds.displayedWidth;
              const height = ((bbox.y_max - bbox.y_min) / 1000) * renderBounds.displayedHeight;

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

              const displayLabel = instance.id.replace('_', ' ');

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
                    left: `${left}px`,
                    top: `${top}px`,
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
                  {/* Instance Badge Label */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-22px',
                      left: '-2px',
                      background: color.labelBg,
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {displayLabel}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetectionViewer;
