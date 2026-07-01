import type { ShipmentStatus } from '../types';

export function generateTrackingNumber(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
  return `KP-${year}-${num}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatCurrency(amount: number, currency = 'IQD'): string {
  return new Intl.NumberFormat('en-IQ', { style: 'currency', currency }).format(amount);
}

export const STATUS_CONFIG: Record<ShipmentStatus, { label: string; color: string; bg: string; dot: string }> = {
  accepted:         { label: 'Accepted',          color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500' },
  in_transit:       { label: 'In Transit',         color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  out_for_delivery: { label: 'Out for Delivery',   color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500' },
  delivered:        { label: 'Delivered',           color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  delayed:          { label: 'Delayed',             color: 'text-red-700',     bg: 'bg-red-50 border-red-200',     dot: 'bg-red-500' },
  returned:         { label: 'Returned',            color: 'text-gray-600',    bg: 'bg-gray-50 border-gray-200',   dot: 'bg-gray-400' },
};

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{10,}$/.test(phone);
}
