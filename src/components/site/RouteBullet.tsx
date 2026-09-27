import { lineVar, routeLetter, type LineColor } from '@/lib/lines';

const SIZES = {
  sm: 'h-6 w-6 text-[0.8125rem]',
  md: 'h-8 w-8 text-[1rem]',
  lg: 'h-11 w-11 text-[1.375rem]',
};

export function RouteBullet({
  title,
  color,
  size = 'md',
  vtName,
}: {
  title: string;
  color: LineColor | null;
  size?: keyof typeof SIZES;
  /** Shared-element name for page transitions (static), or true to be named on click. */
  vtName?: string | true;
}) {
  return (
    <span
      className={`bullet ${SIZES[size]}`}
      data-line={color ?? undefined}
      data-vt-bullet={vtName === true ? '' : undefined}
      style={{ ...lineVar(color), ...(typeof vtName === 'string' ? { viewTransitionName: vtName } : null) }}
      aria-hidden
    >
      {routeLetter(title)}
    </span>
  );
}
