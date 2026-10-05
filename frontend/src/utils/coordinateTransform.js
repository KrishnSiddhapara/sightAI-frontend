/**
 * Canonical Spatial Bounding Box Coordinate Transformation Utility
 * 
 * Maps normalized bounding box coordinates (0-1000 or 0-1 scale)
 * onto actual displayed image pixel dimensions inside a container,
 * accounting for CSS object-fit modes ('contain' or 'cover') and letterboxing offsets.
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

  // Normalize scale to [0, 1]
  const normX1 = x_min > 1.0 ? x_min / 1000 : x_min;
  const normY1 = y_min > 1.0 ? y_min / 1000 : y_min;
  const normX2 = x_max > 1.0 ? x_max / 1000 : x_max;
  const normY2 = y_max > 1.0 ? y_max / 1000 : y_max;

  // Allow minor floating point tolerance
  const eps = -0.05;
  if (normX1 < eps || normY1 < eps || normX2 > 1.05 || normY2 > 1.05) return false;
  if (normX2 <= normX1 || normY2 <= normY1) return false;

  return true;
}

/**
 * Converts source normalized coordinates to displayed pixel coordinates relative to container.
 * 
 * @param {Object} params
 * @param {Object} params.bbox - { x_min, y_min, x_max, y_max }
 * @param {number} params.containerWidth - Width of the image container element
 * @param {number} params.containerHeight - Height of the image container element
 * @param {number} params.naturalWidth - Original width of the image (naturalWidth)
 * @param {number} params.naturalHeight - Original height of the image (naturalHeight)
 * @param {string} [params.objectFit='contain'] - CSS object-fit mode ('contain' | 'cover')
 * @returns {Object|null} { left, top, width, height, displayedWidth, displayedHeight, offsetX, offsetY, normX1, normY1, normX2, normY2 }
 */
export function imageCoordinatesToDisplayCoordinates({
  bbox,
  containerWidth,
  containerHeight,
  naturalWidth,
  naturalHeight,
  objectFit = 'contain'
}) {
  if (!bbox || containerWidth <= 0 || containerHeight <= 0) return null;

  const raw_x1 = Number(bbox.x_min);
  const raw_y1 = Number(bbox.y_min);
  const raw_x2 = Number(bbox.x_max);
  const raw_y2 = Number(bbox.y_max);

  if (isNaN(raw_x1) || isNaN(raw_y1) || isNaN(raw_x2) || isNaN(raw_y2)) {
    if (typeof window !== 'undefined' && window.__SIGHTAI_DEBUG_BBOX) {
      console.warn('[BBOX_TRANSFORM_INVALID_NUMBERS]', bbox);
    }
    return null;
  }

  // Convert to 0.0 - 1.0 normalized bounds with clamping of minor float drift
  const normX1 = Math.max(0, Math.min(1, raw_x1 > 1.0 ? raw_x1 / 1000.0 : raw_x1));
  const normY1 = Math.max(0, Math.min(1, raw_y1 > 1.0 ? raw_y1 / 1000.0 : raw_y1));
  const normX2 = Math.max(0, Math.min(1, raw_x2 > 1.0 ? raw_x2 / 1000.0 : raw_x2));
  const normY2 = Math.max(0, Math.min(1, raw_y2 > 1.0 ? raw_y2 / 1000.0 : raw_y2));

  if (normX2 <= normX1 || normY2 <= normY1) {
    if (typeof window !== 'undefined' && window.__SIGHTAI_DEBUG_BBOX) {
      console.warn('[BBOX_TRANSFORM_ZERO_AREA]', { normX1, normY1, normX2, normY2 });
    }
    return null;
  }

  let displayedWidth = containerWidth;
  let displayedHeight = containerHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (naturalWidth > 0 && naturalHeight > 0) {
    const imgAspect = naturalWidth / naturalHeight;
    const containerAspect = containerWidth / containerHeight;

    if (objectFit === 'contain') {
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
    } else if (objectFit === 'cover') {
      if (imgAspect > containerAspect) {
        displayedHeight = containerHeight;
        displayedWidth = containerHeight * imgAspect;
        offsetX = (containerWidth - displayedWidth) / 2;
        offsetY = 0;
      } else {
        displayedWidth = containerWidth;
        displayedHeight = containerWidth / imgAspect;
        offsetX = 0;
        offsetY = (containerHeight - displayedHeight) / 2;
      }
    }
  }

  const left = offsetX + normX1 * displayedWidth;
  const top = offsetY + normY1 * displayedHeight;
  const width = (normX2 - normX1) * displayedWidth;
  const height = (normY2 - normY1) * displayedHeight;

  if (typeof window !== 'undefined' && window.__SIGHTAI_DEBUG_BBOX) {
    console.debug('[BBOX_TRANSFORM_RESULT]', {
      sourceDimensions: `${naturalWidth}x${naturalHeight}`,
      containerDimensions: `${containerWidth}x${containerHeight}`,
      renderedDimensions: `${displayedWidth.toFixed(1)}x${displayedHeight.toFixed(1)}`,
      offset: `X=${offsetX.toFixed(1)}, Y=${offsetY.toFixed(1)}`,
      normalized: `[${normX1.toFixed(3)}, ${normY1.toFixed(3)}, ${normX2.toFixed(3)}, ${normY2.toFixed(3)}]`,
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
    normX1,
    normY1,
    normX2,
    normY2
  };
}
