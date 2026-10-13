import { createElement, type CSSProperties } from 'react';
import { iconFor } from '../icons';

interface Props {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

/** Renders a lucide icon by catalogue name without creating a component type during render. */
export default function CategoryIcon({ name, size = 16, strokeWidth = 2, className, style }: Props) {
  return createElement(iconFor(name), { size, strokeWidth, className, style });
}
