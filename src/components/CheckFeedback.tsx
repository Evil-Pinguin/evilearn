import React from 'react';
import { CheckResult, statusStyles } from '../utils/liveCheck';

/** Индикатор-«светодиод»: зелёный при верном ответе, красный при ошибке. */
export const StatusLed: React.FC<{ status: CheckResult['status']; size?: number }> = ({ status, size = 10 }) => {
  const s = statusStyles[status];
  const glow =
    status === 'correct'
      ? 'shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
      : status === 'wrong'
        ? 'shadow-[0_0_0_3px_rgba(244,63,94,0.18)]'
        : status === 'partial'
          ? 'shadow-[0_0_0_3px_rgba(245,158,11,0.15)]'
          : '';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        key={status}
        className={`inline-block rounded-full transition-all duration-200 ${s.dot} ${glow} ${
          status === 'correct' || status === 'wrong' ? 'led-pulse' : ''
        }`}
        style={{ width: size, height: size }}
      />
      <span className={`text-[10px] font-mono uppercase tracking-wider ${s.text}`}>{s.label}</span>
    </span>
  );
};

/** Живая сводка проверки прямо под полем ввода. */
export const CheckFeedback: React.FC<{
  result: CheckResult;
  /** Показывать «чего не хватает» */
  showMissing?: boolean;
}> = ({ result, showMissing = true }) => {
  if (result.status === 'empty') {
    return (
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        Пиши — проверю и подсвечу сразу, не дожидаясь кнопки.
      </p>
    );
  }

  const s = statusStyles[result.status];
  return (
    <div className={`rounded-md border px-2.5 py-2 text-[11px] leading-relaxed ${s.border} ${s.bg} ${s.text}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${s.dot}`} />
          {result.headline}
        </span>
        {result.score > 0 && result.status !== 'correct' && (
          <span className="font-mono text-[10px] opacity-70">совпало {Math.round(result.score * 100)}%</span>
        )}
      </div>

      {result.problems.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {result.problems.map((p, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="font-mono shrink-0">!</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {showMissing && result.missing.length > 0 && result.status !== 'wrong' && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <span className="opacity-70">не хватает:</span>
          {result.missing.slice(0, 10).map((m, i) => (
            <code key={i} className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-200">
              {m}
            </code>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckFeedback;
