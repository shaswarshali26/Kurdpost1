import { ArrowRight, Database, Layers, Zap } from 'lucide-react';
import { clsx } from '../../../utils';

interface Props {
  leaving: boolean;
  onEnter: () => void;
}

export default function IntroOverlay({ leaving, onEnter }: Props) {
  return (
    <div className={clsx('xp-intro', leaving && 'is-leaving')} role="dialog" aria-modal="true" aria-labelledby="xp-intro-title">
      <div className="xp-blob xp-float" style={{ width: 520, height: 520, left: '-8%', top: '-10%', background: '#1d4ed8' }} />
      <div className="xp-blob xp-float-2" style={{ width: 460, height: 460, right: '-6%', bottom: '-12%', background: '#0e7490' }} />
      <div className="xp-blob" style={{ width: 300, height: 300, right: '18%', top: '8%', background: '#b45309', opacity: 0.3 }} />
      <div className="xp-ring hidden md:block" />

      <div className="relative max-w-3xl px-6 text-center">
        <p className="xp-micro xp-enter-up mb-5 text-white/60">Kurd Post · Geo Lab · Feasibility prototype</p>
        <h1 id="xp-intro-title" className="xp-headline xp-enter-up xp-delay-1">
          Iraq, mapped live.
        </h1>
        <p className="xp-enter-up xp-delay-2 mt-6 text-[15px] md:text-[17px] leading-relaxed text-white/70 max-w-2xl mx-auto">
          Every hospital, school, post office, road and boundary that OpenStreetMap volunteers have mapped across Iraq,
          pulled straight from the Overpass API and drawn on a living globe. Pick a category, watch it light up.
        </p>

        <div className="xp-enter-up xp-delay-3 mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button type="button" onClick={onEnter} className="xp-cta" autoFocus>
            Enter the map <ArrowRight size={18} />
          </button>
          <span className="text-[12px] text-white/40">or press <kbd className="xp-kbd">Enter</kbd></span>
        </div>

        <ul className="xp-enter-up xp-delay-3 mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <Feature icon={<Layers size={16} />} title="60 categories" body="Health, education, transport, energy, land use and boundaries, grouped and searchable." />
          <Feature icon={<Zap size={16} />} title="Live Overpass" body="Queries are generated on the fly, cached, and fail over across three public mirrors." />
          <Feature icon={<Database size={16} />} title="Open data" body="OpenStreetMap, ODbL. Coverage mirrors what volunteers have mapped, nothing more." />
        </ul>
      </div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <li className="xp-glass !rounded-2xl p-4">
      <div className="flex items-center gap-2 text-white">
        <span className="w-7 h-7 rounded-lg grid place-items-center bg-white/10 text-amber-300">{icon}</span>
        <p className="text-[13.5px] font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-white/55">{body}</p>
    </li>
  );
}
