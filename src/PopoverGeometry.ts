export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export interface Geometry {
  origin: Point;
  anchor: Point;
  placement: Placement;
}

type ComputeGeometry = (
  displayArea: Rect,
  fromRect: Rect,
  contentSize: Size,
  arrowSize: Size,
) => Geometry;

export const computeGeometry = (
  contentSize: Size,
  placement: Placement | 'auto',
  fromRect: Rect,
  displayArea: Rect,
  arrowSize: Size,
): Geometry => {
  const effectiveArrowSize = getArrowSize(arrowSize, placement);

  switch (placement) {
    case 'top':
      return computeTopGeometry(
        displayArea,
        fromRect,
        contentSize,
        effectiveArrowSize,
      );
    case 'bottom':
      return computeBottomGeometry(
        displayArea,
        fromRect,
        contentSize,
        effectiveArrowSize,
      );
    case 'left':
      return computeLeftGeometry(
        displayArea,
        fromRect,
        contentSize,
        effectiveArrowSize,
      );
    case 'right':
      return computeRightGeometry(
        displayArea,
        fromRect,
        contentSize,
        effectiveArrowSize,
      );
    default:
      return computeAutoGeometry(
        displayArea,
        fromRect,
        contentSize,
        effectiveArrowSize,
      );
  }
};

const getArrowSize = (size: Size, placement: Placement | 'auto'): Size => {
  if (placement === 'left' || placement === 'right') {
    return { width: size.height, height: size.width };
  }
  return size;
};

const computeTopGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  const origin = {
    x: Math.min(
      displayArea.x + displayArea.width - contentSize.width,
      Math.max(
        displayArea.x,
        fromRect.x + (fromRect.width - contentSize.width) / 2,
      ),
    ),
    y: fromRect.y - contentSize.height - arrowSize.height,
  };

  const anchor = { x: fromRect.x + fromRect.width / 2, y: fromRect.y };

  return { origin, anchor, placement: 'top' };
};

const computeBottomGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  const origin = {
    x: Math.min(
      displayArea.x + displayArea.width - contentSize.width,
      Math.max(
        displayArea.x,
        fromRect.x + (fromRect.width - contentSize.width) / 2,
      ),
    ),
    y: fromRect.y + fromRect.height + arrowSize.height,
  };

  const anchor = {
    x: fromRect.x + fromRect.width / 2,
    y: fromRect.y + fromRect.height,
  };

  return { origin, anchor, placement: 'bottom' };
};

const computeLeftGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  const origin = {
    x: fromRect.x - contentSize.width - arrowSize.width,
    y: Math.min(
      displayArea.y + displayArea.height - contentSize.height,
      Math.max(
        displayArea.y,
        fromRect.y + (fromRect.height - contentSize.height) / 2,
      ),
    ),
  };

  const anchor = { x: fromRect.x, y: fromRect.y + fromRect.height / 2 };

  return { origin, anchor, placement: 'left' };
};

const computeRightGeometry: ComputeGeometry = (
  displayArea,
  fromRect,
  contentSize,
  arrowSize,
) => {
  const origin = {
    x: fromRect.x + fromRect.width + arrowSize.width,
    y: Math.min(
      displayArea.y + displayArea.height - contentSize.height,
      Math.max(
        displayArea.y,
        fromRect.y + (fromRect.height - contentSize.height) / 2,
      ),
    ),
  };

  const anchor = {
    x: fromRect.x + fromRect.width,
    y: fromRect.y + fromRect.height / 2,
  };

  return { origin, anchor, placement: 'right' };
};

const computeAutoGeometry = (
  displayArea: Rect,
  fromRect: Rect,
  contentSize: Size,
  arrowSize: Size,
): Geometry => {
  let geom: Geometry | null = null;
  const placements: Placement[] = ['left', 'top', 'right', 'bottom'];
  for (let i = 0; i < 4; i += 1) {
    const placement = placements[i];
    geom = computeGeometry(
      contentSize,
      placement,
      fromRect,
      displayArea,
      arrowSize,
    );
    const { origin } = geom;

    if (
      origin.x >= displayArea.x &&
      origin.x <= displayArea.x + displayArea.width - contentSize.width &&
      origin.y >= displayArea.y &&
      origin.y <= displayArea.y + displayArea.height - contentSize.height
    ) {
      break;
    }
  }
  return geom as Geometry;
};
