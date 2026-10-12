import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from '../../../utils';

interface SwitchProps {
  on: boolean;
  color: string;
  label: string;
  onChange: () => void;
}

export function Switch({ on, color, label, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={clsx('xp-switch', on && 'is-on')}
      style={on ? { background: color, boxShadow: `0 0 18px ${color}66`, borderColor: 'transparent' } : undefined}
    >
      <span className="xp-switch-knob" />
    </button>
  );
}

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: ReactNode; title?: string }[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  ariaLabel: string;
}

export function Segmented<T extends string>({ value, options, onChange, size = 'md', ariaLabel }: SegmentedProps<T>) {
  return (
    <div className={clsx('xp-seg', size === 'sm' && 'xp-seg-sm')} role="radiogroup" aria-label={ariaLabel}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={clsx('xp-seg-btn', value === o.value && 'is-active')}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean };

export function IconButton({ active, className, children, ...rest }: IconButtonProps) {
  return (
    <button type="button" {...rest} className={clsx('xp-iconbtn', active && 'is-active', className)}>
      {children}
    </button>
  );
}
