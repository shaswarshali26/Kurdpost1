import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastTone } from '../useLayers';
import { clsx } from '../../../utils';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface Props {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function Toasts({ toasts, onDismiss }: Props) {
  if (!toasts.length) return null;
  return (
    <div className="xp-toasts" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={clsx('xp-toast xp-glass !rounded-2xl', t.tone === 'error' && 'xp-toast-error', t.tone === 'success' && 'xp-toast-success')}>
          <span className={clsx('mt-0.5 shrink-0', t.tone === 'error' ? 'text-rose-300' : t.tone === 'success' ? 'text-emerald-300' : 'text-sky-300')}>
            {t.tone === 'error' ? <AlertTriangle size={14} /> : t.tone === 'success' ? <CheckCircle2 size={14} /> : <Info size={14} />}
          </span>
          <p className="flex-1 text-white/85">{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} className="text-white/40 hover:text-white" aria-label="Dismiss">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
