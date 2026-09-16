import React, { useState } from 'react';
import { 
  Calculator, 
  Binary, 
  GitFork, 
  Grid, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const PrimeFactorWidget: React.FC = () => {
  const [numInput, setNumInput] = useState<number>(91);
  const [calculated, setCalculated] = useState<{
    factors: number[];
    largest: number;
    isPrime: boolean;
    steps: string[];
    isTrap: boolean;
    trapNote?: string;
  }>({
    factors: [7, 13],
    largest: 13,
    isPrime: false,
    steps: ['91 / 7 = 13', '13 — простое число (стоп)'],
    isTrap: false
  });

  const factorize = (val: number) => {
    if (val < 2) {
      setCalculated({
        factors: [],
        largest: 0,
        isPrime: false,
        steps: ['Числа < 2 не имеют простых делителей'],
        isTrap: false
      });
      return;
    }

    let n = val;
    let d = 2;
    const facts: number[] = [];
    const stepLogs: string[] = [];

    while (d * d <= n) {
      while (n % d === 0) {
        facts.push(d);
        const next = n / d;
        stepLogs.push(`${n} ÷ ${d} = ${next} (вынули кирпичик ${d})`);
        n = next;
      }
      d++;
    }
    if (n > 1) {
      facts.push(n);
      stepLogs.push(`Остаток ${n} сам является простым кирпичиком!`);
    }

    const largest = facts.length > 0 ? Math.max(...facts) : val;
    const isPrime = facts.length === 1 && facts[0] === val;

    let isTrap = false;
    let trapNote = '';

    if (val === 9 || val === 25 || val === 49) {
      isTrap = true;
      trapNote = `Ловушка квадрата! ${val} = ${facts[0]} × ${facts[0]}. Это составное число! Наибольший простой делитель: ${largest}.`;
    } else if (val === 98 || val === 55) {
      isTrap = true;
      trapNote = `Ловушка первого множителя! Первым вынули ${facts[0]} (наименьший), а ответ — ПОСЛЕДНИЙ вынутый: ${largest}!`;
    } else if (val === 75 || val === 45) {
      isTrap = true;
      trapNote = `Не останавливайся на 25 или 9! Разложи до простых кирпичиков. Ответ: ${largest}.`;
    }

    setCalculated({
      factors: facts,
      largest,
      isPrime,
      steps: stepLogs,
      isTrap,
      trapNote
    });
  };

  const sampleNumbers = [91, 100, 32, 49, 98, 75, 55, 45, 9, 25, 77, 97];

  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="text-emerald-600 dark:text-emerald-400" size={18} />
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
            Интерактивные «Кирпичики»
          </h4>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-500">Числа:</span>
        {sampleNumbers.map(n => (
          <button
            key={n}
            onClick={() => {
              setNumInput(n);
              factorize(n);
            }}
            className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors ${
              numInput === n
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={numInput}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0;
            setNumInput(val);
            factorize(val);
          }}
          className="w-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => factorize(numInput)}
          className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
        >
          Разложить
        </button>
      </div>

      {calculated.isTrap && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
          <AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
          <p>{calculated.trapNote}</p>
        </div>
      )}

      {/* Visual Bricks */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {calculated.factors.map((fact, idx) => (
            <React.Fragment key={idx}>
              <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                fact === calculated.largest
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                {fact} {fact === calculated.largest && '⭐ (MAX)'}
              </span>
              {idx < calculated.factors.length - 1 && (
                <span className="text-slate-400 font-bold">×</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500">Наибольший простой делитель:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {calculated.largest || '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export const HexAsciiWidget: React.FC = () => {
  const [hexInput, setHexInput] = useState<string>('48 45 4C 4C 4F');
  const [asciiResult, setAsciiResult] = useState<string>('HELLO');

  const decodeHex = (input: string) => {
    setHexInput(input);
    const tokens = input.trim().split(/\s+/);
    let out = '';
    for (const t of tokens) {
      if (t.length === 2) {
        const val = parseInt(t, 16);
        if (!isNaN(val) && val >= 32 && val <= 126) {
          out += String.fromCharCode(val);
        } else {
          out += '?';
        }
      }
    }
    setAsciiResult(out || 'n/a');
  };

  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Binary className="text-cyan-600 dark:text-cyan-400" size={18} />
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
          Hex ↔ ASCII Конвертер
        </h4>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => decodeHex('48 45 4C 4C 4F')}
          className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
        >
          HELLO
        </button>
        <button
          onClick={() => decodeHex('46 49 42 4F 4E 41 43 43 49 32 31')}
          className="px-2 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
        >
          FIBONACCI21
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] text-slate-500 font-mono block mb-1">HEX байты:</label>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => decodeHex(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-500 font-mono block mb-1">ASCII текст:</label>
          <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {asciiResult || '—'}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecursionTreeWidget: React.FC = () => {
  const [nVal, setNVal] = useState<number>(4);

  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <GitFork className="text-violet-600 dark:text-violet-400" size={18} />
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
          Стек вызовов Fibonacci
        </h4>
      </div>

      <div className="flex items-center gap-2">
        {[3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setNVal(n)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              nVal === n
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            fib({n})
          </button>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
        {nVal === 4 && (
          <pre className="leading-relaxed">
{`fib(4) = 3
├── fib(3) = 2
│   ├── fib(2) = 1 (база)
│   └── fib(1) = 1 (база)
└── fib(2) = 1 (база)`}
          </pre>
        )}
        {nVal === 5 && (
          <pre className="leading-relaxed">
{`fib(5) = 5
├── fib(4) = 3
│   ├── fib(3) = 2 -> (fib(2)+fib(1))
│   └── fib(2) = 1
└── fib(3) = 2 -> (fib(2)+fib(1))`}
          </pre>
        )}
        {nVal === 3 && (
          <pre className="leading-relaxed">
{`fib(3) = 2
├── fib(2) = 1 (база)
└── fib(1) = 1 (база)`}
          </pre>
        )}
      </div>
    </div>
  );
};

export const GridCalculatorWidget: React.FC = () => {
  const [points, setPoints] = useState<number>(42);
  const start = -Math.PI;
  const end = Math.PI;
  const intervals = points > 1 ? points - 1 : 1;
  const step = (end - start) / intervals;

  return (
    <div className="my-5 p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Grid className="text-amber-600 dark:text-amber-400" size={18} />
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
          Калькулятор сетки (42 точки = 41 интервал)
        </h4>
      </div>

      <div className="flex items-center gap-2">
        {[42, 21, 10].map(p => (
          <button
            key={p}
            onClick={() => setPoints(p)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              points === p
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {p} точек
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Отрезок:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">[-π, +π] (2π)</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Интервалов (N - 1):</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">{intervals}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block text-[10px]">Шаг step:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{step.toFixed(7)}</span>
        </div>
      </div>
    </div>
  );
};
