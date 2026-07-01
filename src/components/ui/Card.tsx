import React from 'react';
import { clsx } from '../../utils';

interface Props {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export default function Card({ children, className, padding = true, hover = false }: Props) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl border border-slate-200 shadow-card',
        padding && 'p-6',
        hover && 'card-hover cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Gradient icon colors for stat cards
const gradients: Record<string, string> = {
  blue:   'from-blue-600 to-blue-700',
  green:  'from-emerald-500 to-emerald-700',
  amber:  'from-amber-500 to-amber-600',
  red:    'from-red-500 to-red-600',
  purple: 'from-violet-500 to-violet-700',
  gray:   'from-slate-400 to-slate-600',
  gold:   'from-amber-400 to-yellow-500',
  teal:   'from-teal-500 to-cyan-600',
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  color = 'blue',
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}) {
  const grad = gradients[color] ?? gradients.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 card-hover">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-sm shrink-0`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.value >= 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 stat-value tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
