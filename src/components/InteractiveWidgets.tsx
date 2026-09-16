import React, { useState } from 'react';
import { 
  Calculator, 
  Binary, 
  GitFork, 
  Grid, 
  Sparkles, 
  Check, 
  AlertTriangle,
  ArrowRight,
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
      trapNote = `Ловушка квадрата! ${val} = ${facts[0]} × ${facts[0]}. Это составное число, а не простое! Наибольший простой делитель: ${largest}.`;
    } else if (val === 98 || val === 55) {
      isTrap = true;
      trapNote = `Ловушка первого множителя! Первым вынули ${facts[0]} (наименьший), но правильный ответ — ПОСЛЕДНИЙ вынутый: ${largest}!`;
    } else if (val === 75 || val === 45) {
      isTrap = true;
      trapNote = `Ловушка половинного разложения! Не останавливайся на составных кусках. Разложи до простых кирпичиков. Ответ: ${largest}.`;
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
    <div className="my-6 p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="text-emerald-400" size={18} />
          <h4 className="font-semibold text-slate-100 text-sm">
            Интерактивный тренажёр: Методика «Кирпичики»
          </h4>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
          D03T03 Drill
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Быстрый выбор чисел с ревью:</span>
        {sampleNumbers.map(n => (
          <button
            key={n}
            onClick={() => {
              setNumInput(n);
              factorize(n);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              numInput === n
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
          <span className="text-xs text-slate-400 mr-2">Число:</span>
          <input
            type="number"
            value={numInput}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setNumInput(val);
              factorize(val);
            }}
            className="w-full bg-transparent font-mono text-sm text-emerald-400 font-bold focus:outline-none"
          />
        </div>
        <button
          onClick={() => factorize(numInput)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-emerald-900/30"
        >
          Разложить на кирпичики
        </button>
      </div>

      {calculated.isTrap && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-200 text-xs flex items-start gap-2 animate-fadeIn">
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <p>{calculated.trapNote}</p>
        </div>
      )}

      {/* Visual Bricks */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="text-xs text-slate-400 font-medium">Простые кирпичики (множители):</div>
        <div className="flex flex-wrap items-center gap-2">
          {calculated.factors.map((fact, idx) => (
            <React.Fragment key={idx}>
              <div className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-transform transform hover:scale-110 ${
                fact === calculated.largest
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                🧱 {fact} {fact === calculated.largest && '⭐ (MAX)'}
              </div>
              {idx < calculated.factors.length - 1 && (
                <span className="text-slate-500 font-bold">×</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Наибольший простой делитель:</span>
          <span className="font-mono font-bold text-amber-300 text-sm">
            {calculated.largest || '—'}
          </span>
        </div>
      </div>

      {/* Step by step log */}
      <div className="text-[11px] font-mono text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">Пошаговый протокол вычислений:</div>
        {calculated.steps.map((st, i) => (
          <div key={i} className="text-slate-400">↳ {st}</div>
        ))}
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
    <div className="my-6 p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Binary className="text-cyan-400" size={18} />
          <h4 className="font-semibold text-slate-100 text-sm">
            Шестнадцатеричный HEX ↔ ASCII Конвертер
          </h4>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
          Квест 2 char_decode
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => decodeHex('48 45 4C 4C 4F 77 4F 52 4C 44')}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono transition-colors"
        >
          HELLOwORLD
        </button>
        <button
          onClick={() => decodeHex('46 49 42 4F 4E 41 43 43 49 32 31')}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono transition-colors"
        >
          FIBONACCI21
        </button>
        <button
          onClick={() => decodeHex('53 43 48 4F 4F 4C 32 31')}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono transition-colors"
        >
          SCHOOL21
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-mono">HEX байты (через пробел):</label>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => decodeHex(e.target.value)}
            placeholder="48 45 4C 4C 4F"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-mono">Декодированный текст ASCII:</label>
          <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400">
            {asciiResult || '—'}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
        <div className="text-slate-300 font-semibold">Формула сдвига символов:</div>
        <div>Цифра:  <code>c - &apos;0&apos;</code> (например, &apos;4&apos; - &apos;0&apos; = 4)</div>
        <div>Буква:  <code>c - &apos;A&apos; + 10</code> (например, &apos;F&apos; - &apos;A&apos; + 10 = 15)</div>
      </div>
    </div>
  );
};

export const RecursionTreeWidget: React.FC = () => {
  const [nVal, setNVal] = useState<number>(4);

  return (
    <div className="my-6 p-5 rounded-2xl border border-violet-500/30 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitFork className="text-violet-400" size={18} />
          <h4 className="font-semibold text-slate-100 text-sm">
            Визуализатор стека и дерева вызовов Fibonacci
          </h4>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">
          Квест 3 quest3.c
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Вычислить fib(n):</span>
        {[3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setNVal(n)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
              nVal === n
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            fib({n})
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
        <div className="font-semibold text-violet-300">Дерево рекурсивных самовызовов:</div>
        {nVal === 4 && (
          <pre className="text-slate-300 leading-relaxed text-[11px] overflow-x-auto">
{`                  fib(4) = 3
                 /          \\
         fib(3) = 2         fib(2) = 1 (базовый)
        /          \\
  fib(2) = 1   fib(1) = 1 (базовые)
  
Всего вызовов в стеке: 5`}
          </pre>
        )}
        {nVal === 5 && (
          <pre className="text-slate-300 leading-relaxed text-[11px] overflow-x-auto">
{`                              fib(5) = 5
                             /          \\
                   fib(4) = 3            fib(3) = 2
                  /          \\           /          \\
          fib(3) = 2       fib(2)=1  fib(2)=1   fib(1)=1
         /          \\
    fib(2)=1      fib(1)=1
    
Всего вызовов: 9. fib(3) считается дважды!`}
          </pre>
        )}
        {nVal === 3 && (
          <pre className="text-slate-300 leading-relaxed text-[11px]">
{`         fib(3) = 2
        /          \\
   fib(2) = 1   fib(1) = 1 (базовые случаи)`}
          </pre>
        )}
      </div>

      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 flex items-start gap-2">
        <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-rose-300">Почему int переполняется при n = 47? </span>
          После fib(46) = 1,836,311,903 следующее число превышает 2,147,483,647 (лимит 32-битного int). Поэтому в Школе 21 строго используется <code>long long</code>!
        </div>
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
    <div className="my-6 p-5 rounded-2xl border border-amber-500/30 bg-slate-900/90 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid className="text-amber-400" size={18} />
          <h4 className="font-semibold text-slate-100 text-sm">
            Калькулятор сетки: Правило интервалов (42 точки = 41 щель)
          </h4>
        </div>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
          Квест 4 door_functions
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">Количество точек (N):</span>
        {[42, 10, 21].map(p => (
          <button
            key={p}
            onClick={() => setPoints(p)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
              points === p
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {p} точек
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-slate-400">Интервал [a, b]:</div>
          <div className="font-bold text-slate-200 mt-1">[-π, +π] = 2π ≈ 6.2831853</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-slate-400">Промежутков (N - 1):</div>
          <div className="font-bold text-amber-300 mt-1">{points} - 1 = {intervals}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-slate-400">Точный шаг step:</div>
          <div className="font-bold text-emerald-400 mt-1">{step.toFixed(7)}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2">
        <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-300">Почему 0.0 не попадает в сетку? </span>
          π ÷ (2π / 41) = 20.5 шагов. Так как 20.5 не целое число, точный x = 0.0 пропускается, и гипербола 1/x² не делит на ноль в таблице!
        </div>
      </div>
    </div>
  );
};
