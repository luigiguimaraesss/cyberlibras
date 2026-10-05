import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Lightbulb, ShieldCheck, Trophy } from 'lucide-react';

export interface ResultStat {
  label: string;
  value: string;
}

interface ResultScreenProps {
  variant: 'success' | 'retry' | 'journey';
  title: string;
  subtitle?: string;
  /** Percentual de aproveitamento (0–100) mostrado no anel. */
  percent: number;
  stats: ResultStat[];
  children?: ReactNode;
  actions: ReactNode;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ScoreRing({ percent, tone }: { percent: number; tone: 'ok' | 'warn' }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div className="relative mx-auto h-40 w-40" role="img" aria-label={`Aproveitamento de ${percent}%`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1E2D47" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={tone === 'ok' ? '#4ADE80' : '#60A5FA'}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold">{percent}%</span>
        <span className="text-xs text-ink-soft">aproveitamento</span>
      </div>
    </div>
  );
}

export function ResultScreen({ variant, title, subtitle, percent, stats, children, actions }: ResultScreenProps) {
  const success = variant !== 'retry';
  const Icon = variant === 'journey' ? Trophy : success ? ShieldCheck : Lightbulb;

  return (
    <section aria-labelledby="screen-title" className="card animate-screen mx-auto w-full max-w-2xl p-6 text-center sm:p-10">
      <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
        {success && <span aria-hidden="true" className="animate-ring absolute inset-0 rounded-full bg-ok-light/40" />}
        <span
          className={`relative flex h-20 w-20 items-center justify-center rounded-full ${
            success ? 'bg-ok text-white' : 'bg-brand text-white'
          }`}
        >
          <Icon className="h-10 w-10" aria-hidden="true" />
        </span>
      </div>

      <h1 id="screen-title" tabIndex={-1} className="text-2xl font-extrabold leading-tight sm:text-3xl">
        {title}
      </h1>
      {subtitle && <p className="mx-auto mt-3 max-w-lg text-lg text-ink-soft">{subtitle}</p>}

      <div className="my-8">
        <ScoreRing percent={percent} tone={success ? 'ok' : 'warn'} />
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-surface-raised p-4">
            <dt className="text-sm text-ink-soft">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-extrabold">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {children && <div className="mt-6 text-left">{children}</div>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">{actions}</div>
    </section>
  );
}
