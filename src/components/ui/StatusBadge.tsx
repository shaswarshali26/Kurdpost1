import type { ShipmentStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils';

interface Props {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

// Statuses that should pulse (active/moving)
const ACTIVE_STATUSES: ShipmentStatus[] = ['in_transit', 'out_for_delivery', 'accepted'];

export default function StatusBadge({ status, size = 'md' }: Props) {
  const cfg = STATUS_CONFIG[status];
  const isActive = ACTIVE_STATUSES.includes(status);
  const px = size === 'sm' ? 'px-2.5 py-1 text-xs gap-1' : 'px-3.5 py-1.5 text-sm gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border tracking-tight ${cfg.bg} ${cfg.color} ${px}`}
      style={{ letterSpacing: '-0.01em' }}
    >
      <span
        className={`rounded-full shrink-0 ${cfg.dot} ${isActive ? 'pulse-dot' : ''}`}
        style={{ width: size === 'sm' ? 6 : 7, height: size === 'sm' ? 6 : 7 }}
      />
      {cfg.label}
    </span>
  );
}
