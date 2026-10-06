/**
 * Canonical Spatial Bounding Box Coordinate Transformation Utility
 * 
 * Centralized coordinate management:
 * 1. Normalized coordinates (0.0 to 1.0) as canonical representation.
 * 2. Source pixel coordinates (naturalWidth x naturalHeight).
 * 3. Rendered/Displayed image pixel coordinates (clientWidth x clientHeight).
 * 4. CSS object-fit support ('contain' or 'cover') with letterboxing/cropping offset calculations.
 */

/**
 * Validates normalized bounding box coordinates.
 * Returns true if valid, false if invalid or out of bounds.
 */
export function validateBoundingBox(bbox) {
  if (!bbox || typeof bbox !== 'object') return false;

  const x_min = Number(bbox.x_min);
  const y_min = Number(bbox.y_min);
  const x_max = Number(bbox.x_max);
  const y_max = Number(bbox.y_max);

  if (isNaN(x_min) || isNaN(y_min) || isNaN(x_max) || isNaN(y_max)) return false;

  const norm = normalizeBoundingBox(bbox);
  if (!norm) return false;

  const eps = -0.05;
  if (norm.x1 < eps || norm.y1 < eps || norm.x2 > 1.05 || norm.y2 > 1.05) return false;
  if (norm.x2 <= norm.x1 || norm.y2 <= norm.y1) return false;

  return true;
}

/**
 * Converts any bounding box (0-1000 scale or 0-1 scale) into normalized 0.0 -> 1.0 coordinates.
 * Determines scale at the whole-box level to prevent corrupting single coordinates.
 * 
 * @param {Object} bbox - { x_min, y_min, x_max, y_max }
 * @returns {Object|null} { x1, y1, x2, y2 } in 0.0 -> 1.0 scale
 */
export function normalizeBoundingBox(bbox) {
  if (!bbox || typeof bbox !== 'object') return null;

  const raw_x1 = Number(bbox.x_min);
  const raw_y1 = Number(bbox.y_min);
  const raw_x2 = Number(bbox.x_max);
  const raw_y2 = Number(bbox.y_max);

  if (isNaN(raw_x1) || isNaN(raw_y1) || isNaN(raw_x2) || isNaN(raw_y2)) return null;

  // Whole-box scale check: if max value > 1.0, treat as 0-1000 scale
  const maxVal = Math.max(raw_x1, raw_y1, raw_x2, raw_y2);
  const is1000Scale = maxVal > 1.0;

  const divisor = is1000Scale ? 1000.0 : 1.0;

  let x1 = raw_x1 / divisor;
  let y1 = raw_y1 / divisor;
  let x2 = raw_x2 / divisor;
  let y2 = raw_y2 / divisor;

  // Min/Max repair for inversions
  const normX1 = Math.max(0, Math.min(1, Math.min(x1, x2)));
  const normY1 = Math.max(0, Math.min(1, Math.min(y1, y2)));
  const normX2 = Math.max(0, Math.min(1, Math.max(x1, x2)));
  const normY2 = Math.max(0, Math.min(1, Math.max(y1, y2)));

  if (normX2 <= normX1 || normY2 <= normY1) return null;

  return {
    x1: normX1,
    y1: normY1,
    x2: normX2,
    y2: normY2
  };
}

/**
 * Converts normalized bounding box (0-1) to source image pixel coordinates.
 * 
 * @param {Object} bbox
 * @param {number} naturalWidth
 * @param {number} naturalHeight
 * @returns {Object|null} { x1_px, y1_px, x2_px, y2_px, width_px, height_px }
 */
export function denormalizeBoundingBox(bbox, naturalWidth, naturalHeight) {
  const norm = normalizeBoundingBox(bbox);
  if (!norm || naturalWidth <= 0 || naturalHeight <= 0) return null;

  const x1_px = Math.round(norm.x1 * naturalWidth);
  const y1_px = Math.round(norm.y1 * naturalHeight);
  const x2_px = Math.round(norm.x2 * naturalWidth);
  const y2_px = Math.round(norm.y2 * naturalHeight);

  return {
    x1_px,
    y1_px,
    x2_px,
    y2_px,
    width_px: x2_px - x1_px,
    height_px: y2_px - y1_px
  };
}

/**
 * Calculates display metrics for an image rendered inside a container under object-fit contain/cover.
 * 
 * @param {Object} params
 * @param {number} params.containerWidth
 * @param {number} params.containerHeight
 * @param {number} params.naturalWidth
 * @param {number} params.naturalHeight
 * @param {string} [params.objectFit='contain']
 * @returns {Object} { displayedWidth, displayedHeight, offsetX, offsetY, scaleX, scaleY }
 */
export function calculateImageRenderMetrics({
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
  objectFit = 'contain'
}) {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { displayedWidth: 0, displayedHeight: 0, offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 };
  }

  if (!naturalWidth || !naturalHeight || naturalWidth <= 0 || naturalHeight <= 0) {
    return {
      displayedWidth: containerWidth,
      displayedHeight: containerHeight,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1
    };
  }

  if (objectFit === 'cover') {
    return calculateCoverTransform({ containerWidth, containerHeight, naturalWidth, naturalHeight });
  }

  // Default 'contain'
  return calculateContainTransform({ containerWidth, containerHeight, naturalWidth, naturalHeight });
}

export function calculateContainTransform({ containerWidth, containerHeight, naturalWidth, naturalHeight }) {
  const imgAspect = naturalWidth / naturalHeight;
  const containerAspect = containerWidth / containerHeight;

  let displayedWidth = containerWidth;
  let displayedHeight = containerHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imgAspect > containerAspect) {
    displayedWidth = containerWidth;
    displayedHeight = containerWidth / imgAspect;
    offsetX = 0;
    offsetY = (containerHeight - displayedHeight) / 2;
  } else {
    displayedHeight = containerHeight;
    displayedWidth = containerHeight * imgAspect;
    offsetX = (containerWidth - displayedWidth) / 2;
    offsetY = 0;
  }

  const scaleX = displayedWidth / naturalWidth;
  const scaleY = displayedHeight / naturalHeight;

  return {
    displayedWidth,
    displayedHeight,
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    objectFit: 'contain'
  };
}

export function calculateCoverTransform({ containerWidth, containerHeight, naturalWidth, naturalHeight }) {
  const imgAspect = naturalWidth / naturalHeight;
  const containerAspect = containerWidth / containerHeight;

  let displayedWidth = containerWidth;
  let displayedHeight = containerHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imgAspect > containerAspect) {
    displayedHeight = containerHeight;
    displayedWidth = containerHeight * imgAspect;
    offsetX = (containerWidth - displayedWidth) / 2; // negative offset (cropped horizontally)
    offsetY = 0;
  } else {
    displayedWidth = containerWidth;
    displayedHeight = containerWidth / imgAspect;
    offsetX = 0;
    offsetY = (containerHeight - displayedHeight) / 2; // negative offset (cropped vertically)
  }

  const scaleX = displayedWidth / naturalWidth;
  const scaleY = displayedHeight / naturalHeight;

  return {
    displayedWidth,
    displayedHeight,
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    objectFit: 'cover'
  };
}

/**
 * Transforms canonical source bounding box coordinates to displayed pixel coordinates relative to container.
 * 
 * @param {Object} params
 * @param {Object} params.bbox - { x_min, y_min, x_max, y_max }
 * @param {number} params.containerWidth
 * @param {number} params.containerHeight
 * @param {number} params.naturalWidth
 * @param {number} params.naturalHeight
 * @param {string} [params.objectFit='contain']
 * @returns {Object|null}
 */
export function imageCoordinatesToDisplayCoordinates({
  bbox,
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
  objectFit = 'contain'
}) {
  const norm = normalizeBoundingBox(bbox);
  if (!norm || containerWidth <= 0 || containerHeight <= 0) return null;

  const metrics = calculateImageRenderMetrics({
    containerWidth,
    containerHeight,
    naturalWidth,
    naturalHeight,
    objectFit
  });

  const { displayedWidth, displayedHeight, offsetX, offsetY } = metrics;

  const left = offsetX + norm.x1 * displayedWidth;
  const top = offsetY + norm.y1 * displayedHeight;
  const width = (norm.x2 - norm.x1) * displayedWidth;
  const height = (norm.y2 - norm.y1) * displayedHeight;

  // Source pixel coordinates
  const sourcePixels = naturalWidth > 0 && naturalHeight > 0
    ? {
        x1: Math.round(norm.x1 * naturalWidth),
        y1: Math.round(norm.y1 * naturalHeight),
        x2: Math.round(norm.x2 * naturalWidth),
        y2: Math.round(norm.y2 * naturalHeight),
        w: Math.round((norm.x2 - norm.x1) * naturalWidth),
        h: Math.round((norm.y2 - norm.y1) * naturalHeight)
      }
    : null;

  if (typeof window !== 'undefined' && window.__SIGHTAI_DEBUG_BBOX) {
    console.debug('[BBOX_TRANSFORM_RESULT]', {
      sourceDimensions: `${naturalWidth}x${naturalHeight}`,
      containerDimensions: `${containerWidth}x${containerHeight}`,
      renderedDimensions: `${displayedWidth.toFixed(1)}x${displayedHeight.toFixed(1)}`,
      offset: `X=${offsetX.toFixed(1)}, Y=${offsetY.toFixed(1)}`,
      normalized: `[${norm.x1.toFixed(3)}, ${norm.y1.toFixed(3)}, ${norm.x2.toFixed(3)}, ${norm.y2.toFixed(3)}]`,
      finalPixelBox: `left=${left.toFixed(1)}, top=${top.toFixed(1)}, w=${width.toFixed(1)}, h=${height.toFixed(1)}`
    });
  }

  return {
    left,
    top,
    width,
    height,
    displayedWidth,
    displayedHeight,
    offsetX,
    offsetY,
    normX1: norm.x1,
    normY1: norm.y1,
    normX2: norm.x2,
    normY2: norm.y2,
    sourcePixels
  };
}

/**
 * Transforms screen container click/mouse coordinates back to normalized canonical source image coordinates.
 * 
 * @param {Object} params
 * @param {number} params.displayX - Click X inside container
 * @param {number} params.displayY - Click Y inside container
 * @param {number} params.containerWidth
 * @param {number} params.containerHeight
 * @param {number} params.naturalWidth
 * @param {number} params.naturalHeight
 * @param {string} [params.objectFit='contain']
 * @returns {Object|null} { normX, normY, sourceX, sourceY }
 */
export function displayCoordinatesToImageCoordinates({
  displayX,
  displayY,
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
  objectFit = 'contain'
}) {
  const metrics = calculateImageRenderMetrics({
    containerWidth,
    containerHeight,
    naturalWidth,
    naturalHeight,
    objectFit
  });

  const { displayedWidth, displayedHeight, offsetX, offsetY } = metrics;
  if (displayedWidth <= 0 || displayedHeight <= 0) return null;

  const relX = displayX - offsetX;
  const relY = displayY - offsetY;

  const normX = Math.max(0, Math.min(1, relX / displayedWidth));
  const normY = Math.max(0, Math.min(1, relY / displayedHeight));

  const sourceX = naturalWidth > 0 ? Math.round(normX * naturalWidth) : 0;
  const sourceY = naturalHeight > 0 ? Math.round(normY * naturalHeight) : 0;

  return {
    normX,
    normY,
    sourceX,
    sourceY
  };
}
