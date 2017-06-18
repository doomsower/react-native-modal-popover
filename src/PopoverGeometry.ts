export class Point {
  constructor(public x: number, public y: number) {}
}

export class Rect {
  constructor(public x: number, public y: number, public width: number, public height: number) {}

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }
}

export class Size {
  constructor(public width: number, public height: number) {}
}

export type Placement = 'top' | 'right' | 'bottom' | 'left' | 'auto';

export interface Geometry {
  origin: Point;
  anchor: Point;
  placement: Placement;
}

interface ComputeGeometry {
  (displayArea: Rect, fromRect: Rect, contentSize: Size, arrowSize: Size): Geometry;
}

export const computeGeometry = (contentSize: Size, placement: Placement, fromRect: Rect, displayArea: Rect, arrowSize: Size): Geometry => {
  const effectiveArrowSize = getArrowSize(arrowSize, placement);

  switch (placement) {
    case 'top':
      return computeTopGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    case 'bottom':
      return computeBottomGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    case 'left':
      return computeLeftGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    case 'right':
      return computeRightGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
    default:
      return computeAutoGeometry(displayArea, fromRect, contentSize, effectiveArrowSize);
  }
};

const getArrowSize = (size: Size, placement: Placement): Size => {
  if (placement === 'left' || placement === 'right') {
    return new Size(size.height, size.width );
  }
  return size;
};

const computeTopGeometry:ComputeGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
  const origin = new Point(
    Math.min(
      displayArea.right - contentSize.width,
      Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2),
    ),
    fromRect.y - contentSize.height - arrowSize.height,
  );

  const anchor = new Point(fromRect.x + fromRect.width / 2, fromRect.y);

  return { origin, anchor, placement: 'top' };
};

const computeBottomGeometry:ComputeGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
  const origin = new Point(
    Math.min(
      displayArea.right - contentSize.width,
      Math.max(displayArea.x, fromRect.x + (fromRect.width - contentSize.width) / 2),
    ),
    fromRect.y + fromRect.height + arrowSize.height,
  );

  const anchor = new Point(fromRect.x + fromRect.width / 2, fromRect.y + fromRect.height);

  return { origin, anchor, placement: 'bottom' };
};

const computeLeftGeometry:ComputeGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
  const origin = new Point(
    fromRect.x - contentSize.width - arrowSize.width,
    Math.min(
      displayArea.bottom - contentSize.height,
      Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2),
    ),
  );

  const anchor = new Point(fromRect.x, fromRect.y + fromRect.height / 2);

  return { origin, anchor, placement: 'left' };
};

const computeRightGeometry: ComputeGeometry = (displayArea, fromRect, contentSize, arrowSize) => {
  const origin = new Point(
    fromRect.right + arrowSize.width,
    Math.min(
      displayArea.bottom - contentSize.height,
      Math.max(displayArea.y, fromRect.y + (fromRect.height - contentSize.height) / 2),
    ),
  );

  const anchor = new Point(fromRect.x + fromRect.width, fromRect.y + fromRect.height / 2);

  return { origin, anchor, placement: 'right' };
};

const computeAutoGeometry = (displayArea: Rect, fromRect: Rect, contentSize: Size, arrowSize: Size): Geometry => {
  let geom: Geometry | null = null;
  const placements: Placement[] = ['left', 'right', 'bottom', 'top'];
  for (let i = 0; i < 4; i += 1) {
    const placement = placements[i];
    geom = computeGeometry(contentSize, placement, fromRect, displayArea, arrowSize);
    const { origin } = geom;

    if (
      origin.x >= displayArea.x &&
      origin.x <= displayArea.right - contentSize.width &&
      origin.y >= displayArea.y &&
      origin.y <= displayArea.bottom - contentSize.height
    )
    {
      break;
    }
  }
  return geom as Geometry;
};