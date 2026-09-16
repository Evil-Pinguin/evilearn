/**
 * Живая проверка ответов: используется и в упражнениях, и в экзаменаторе,
 * чтобы подсветка «во время ввода» и итоговая оценка совпадали на 100%.
 */

import { ExamQuestion, Exercise } from '../types';

export type CheckStatus = 'empty' | 'wrong' | 'partial' | 'correct';

export interface CheckResult {
  status: CheckStatus;
  /** 0..1 — насколько близко к эталону */
  score: number;
  /** Короткий вывод: «Совпадает», «Почти», «Не та команда» */
  headline: string;
  /** Конкретные ошибки (опечатки, синтаксис C) */
  problems: string[];
  /** Чего не хватает в ответе */
  missing: string[];
  /** Что уже найдено */
  matched: string[];
}

export interface RequiredPart {
  label: string;
  anyOf: string[];
}

export interface ForbiddenPart {
  label: string;
  anyOf: string[];
}

/* ------------------------------------------------------------------ */
/* Низ-level утилиты                                                   */
/* ------------------------------------------------------------------ */

export const cleanSpace = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const cur = new Array<number>(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

const baseName = (tok: string) => tok.replace(/\/+$/, '').split('/').pop() || tok;
const stripEdgePunct = (tok: string) => tok.replace(/^['"`(]+|['"`),.;:!]+$/g, '');

interface Tok {
  raw: string;
  text: string;
  quoted: boolean;
  isFlag: boolean;
}

const SHELL_NOISE = new Set(['&&', '||', '|', '>', '>>', '<', '2>', '&', ';', '(', ')']);

function tokenizeSegment(seg: string): Tok[] {
  const out: Tok[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seg)) !== null) {
    if (m[1] !== undefined) {
      out.push({ raw: m[1], text: cleanSpace(m[1]), quoted: true, isFlag: false });
    } else if (m[2] !== undefined) {
      out.push({ raw: m[2], text: cleanSpace(m[2]), quoted: true, isFlag: false });
    } else {
      const raw = m[3];
      if (SHELL_NOISE.has(raw)) continue;
      const text = cleanSpace(stripEdgePunct(raw));
      if (!text) continue;
      out.push({ raw, text, quoted: false, isFlag: text.startsWith('-') });
    }
  }
  return out;
}

/** Разбивает ввод на логические строки-команды (учитывает `&&`, `;`, переносы). */
export function splitSegments(text: string): string[] {
  return text
    .replace(/&&/g, '\n')
    .replace(/\|\|/g, '\n')
    .split(/[\n;\r]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

type MatchKind = 'exact' | 'loose' | 'typo' | null;

/** Сопоставление одного эталонного токена с пулом пользовательских токенов. */
function matchToken(req: Tok, pool: Tok[]): MatchKind {
  let best: MatchKind = null;

  for (const user of pool) {
    if (user.text === req.text) return 'exact';

    // -la == -l -a (слитные флаги) и наоборот
    if (req.isFlag && !req.text.includes('=') && req.text.length === 2 && !user.text.includes('=')) {
      if (user.text.startsWith('-') && user.text.length > 1 && user.text !== '-') {
        if (user.text.slice(1).split('').includes(req.text.slice(1))) {
          best = best || 'loose';
          continue;
        }
      }
    }
    // Длинный флаг/путь: допустимо совпадение по окончанию (src/a.c vs ./src/a.c)
    if (!req.isFlag && (req.text.includes('/') || user.text.includes('/'))) {
      if (baseName(user.text) === baseName(req.text) && baseName(req.text).length > 1) {
        best = best || 'loose';
        continue;
      }
    }
    // Текст в кавычках сравниваем «содержит»
    if (req.quoted || user.quoted) {
      if (req.text.length >= 3 && (user.text.includes(req.text) || req.text.includes(user.text))) {
        best = best || 'loose';
        continue;
      }
    }
    if (req.text.length >= 3 && user.text.includes(req.text)) {
      best = best || 'loose';
      continue;
    }
    // Опечатка: одна буква
    if (
      !req.isFlag &&
      Math.min(req.text.length, user.text.length) >= 4 &&
      Math.abs(req.text.length - user.text.length) <= 2 &&
      levenshtein(req.text, user.text) <= 1
    ) {
      best = best || 'typo';
    }
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* known commands                                                      */
/* ------------------------------------------------------------------ */

export const KNOWN_COMMANDS = new Set([
  'pwd', 'ls', 'cd', 'mkdir', 'rmdir', 'touch', 'cp', 'mv', 'rm', 'cat', 'tac', 'less', 'more',
  'head', 'tail', 'wc', 'grep', 'egrep', 'sed', 'awk', 'sort', 'uniq', 'find', 'locate', 'tree',
  'chmod', 'chown', 'ln', 'du', 'df', 'df', 'which', 'whereis', 'file', 'history', 'man', 'info',
  'echo', 'printf', 'clear', 'export', 'source', 'alias', 'unalias', 'env', 'exit', 'true',
  'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'curl', 'wget', 'ssh', 'scp', 'git', 'gh', 'make',
  'cmake', 'gcc', 'g++', 'clang', 'clang-format', 'valgrind', 'gdb', 'nano', 'vim', 'vi', 'neovim',
  'ps', 'top', 'htop', 'kill', 'killall', 'pkill', 'jobs', 'bg', 'fg', 'nohup', 'sleep', 'time',
  'date', 'cal', 'uname', 'id', 'whoami', 'who', 'write', 'diff', 'patch', 'comm', 'cut', 'tr',
  'paste', 'xargs', 'seq', 'basename', 'dirname', 'readlink', 'realpath', 'stat', 'md5sum',
  'sha256sum', 'open', 'python3', 'python', 'node', 'npm', 'npx', 'sh', 'bash', 'zsh', 'sudo',
  'docker', 'systemctl', 'service', 'lsof', 'netstat', 'ping', 'nc', 'tee', 'yes', 'bc', 'expr',
  'test', 'if', 'for', 'while', 'do', 'done', 'then', 'fi', 'else', 'function'
]);

/* ------------------------------------------------------------------ */
/* Проверка терминальных команд                                        */
/* ------------------------------------------------------------------ */

export function checkCommand(userRaw: string, referenceRaw: string): CheckResult {
  const user = (userRaw || '').trim();
  if (!user) {
    return { status: 'empty', score: 0, headline: '', problems: [], missing: [], matched: [] };
  }

  const userPool = splitSegments(user).flatMap(tokenizeSegment);
  const refLines = splitSegments(referenceRaw).map(line => tokenizeSegment(line)).filter(l => l.length);

  const problems: string[] = [];
  const missing: string[] = [];
  const matched: string[] = [];

  // 1. Несуществующие команды — сразу красным
  for (const seg of splitSegments(user)) {
    const toks = tokenizeSegment(seg);
    const binary = toks[0]?.text || '';
    if (!binary) continue;
    const refBinaries = refLines.map(l => l[0]?.text).filter(Boolean) as string[];
    if (!KNOWN_COMMANDS.has(binary) && !refBinaries.includes(binary)) {
      const typoOf = refBinaries.find(rb => rb && levenshtein(rb, binary) <= 2 && Math.abs(rb.length - binary.length) <= 2);
      problems.push(
        typoOf
          ? `Команды \`${binary}\` нет — ты, наверное, имела в виду \`${typoOf}\`.`
          : `Команды \`${binary}\` не существует. Напиши \`man ${binary}\` или начни с \`help\`.`
      );
    }
  }

  // 2. Опасные команды
  if (/\brm\s+(-[a-z]*[rf][a-z]*\s+)+\s*\/(\s|$)/.test(user)) {
    problems.push('`rm -rf /` удалит всю систему. Так делать нельзя.');
  }
  // 3. Сверка построчная: эталон может быть из нескольких команд
  let totalReq = 0;
  let totalOk = 0;
  let linesOk = 0;

  refLines.forEach((refToks, idx) => {
    let lineOk = true;
    for (const req of refToks) {
      totalReq++;
      const kind = matchToken(req, userPool);
      if (kind) {
        totalOk++;
        matched.push(req.raw);
        if (kind === 'typo') {
          const near = userPool.find(u => levenshtein(u.text, req.text) <= 1)?.raw || req.raw;
          problems.push(`Опечатка в \`${near}\` — правильно \`${req.raw}\`.`);
        }
      } else {
        lineOk = false;
        missing.push(idx > 0 || refLines.length > 1 ? `${req.raw}` : req.raw);
      }
    }
    if (lineOk) linesOk++;
  });

  const score = totalReq ? totalOk / totalReq : userPool.length ? 1 : 0;

  if (problems.length) {
    return { status: 'wrong', score, headline: 'Команда введена неправильно', problems, missing, matched };
  }
  if (linesOk === refLines.length && refLines.length > 0) {
    return {
      status: 'correct',
      score: 1,
      headline: `Отлично! Все ${refLines.length > 1 ? `${refLines.length} команды` : 'части команды'} на месте`,
      problems: [],
      missing: [],
      matched
    };
  }
  return {
    status: 'partial',
    score,
    headline: missing.length
      ? `Пока не хватает: ${missing.slice(0, 6).map(t => `\`${t}\``).join(', ')}`
      : 'Проверь порядок команд',
    problems: [],
    missing,
    matched
  };
}

/* ------------------------------------------------------------------ */
/* Разбор синтаксиса C                                                 */
/* ------------------------------------------------------------------ */

export function cSyntaxProblems(code: string): string[] {
  const problems: string[] = [];
  if (!code.trim()) return problems;

  const stripped = code
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const stack: { ch: string; line: number }[] = [];
  let lineNo = 1;
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === '\n') {
      lineNo++;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push({ ch, line: lineNo });
    } else if (ch === ')' || ch === ']' || ch === '}') {
      const open = stack.pop();
      if (!open) {
        problems.push(`Строка ${lineNo}: закрывающая «${ch}» без парной открывающей.`);
      } else if (open.ch !== pairs[ch]) {
        problems.push(`Строка ${lineNo}: «${ch}» закрывает «${open.ch}» со строки ${open.line}. Перепутаны скобки.`);
      }
    }
  }
  if (stack.length) {
    const open = stack[stack.length - 1];
    problems.push(
      stack.length > 1
        ? `Не закрыто ${stack.length} скобок, последняя «${open.ch}» открыта на строке ${open.line}.`
        : `Не закрыта скобка «${open.ch}», открыта на строке ${open.line}.`
    );
  }

  if (/(^|[^\\])\\(?:"[^"]*)$/.test(stripped)) {
    // не закрытая кавычка в строке
  }

  const rawLines = code.split('\n');
  rawLines.forEach((raw, i) => {
    const line = raw.replace(/\/\/.*$/, '').trim();
    if (!line) return;
    if (/^[#{}()\[\];]/.test(line)) return;
    if (/^(case|default|else|do|try|public|private|struct|typedef|#)\b/.test(line)) return;
    if (/[;{}:,)]$/.test(line) || /[+\-*/%=<>?&|^]$/.test(line)) return;
    if (/^(if|while|for|switch)\s*\(/.test(line)) return;
    if (/^(int|void|char|double|float|long|short|unsigned|size_t|bool)\b.*\)\s*$/.test(line)) return;
    if (/(printf|scanf|return|[a-zA-Z_]\w*\s*=|^[a-zA-Z_]\w*\s*\()/.test(line) && line.length < 80) {
      problems.push(`Строка ${i + 1}: похоже, в конце нет «;».`);
    }
  });

  if (!/\bmain\b/.test(stripped)) {
    problems.push('В программе нет функции `main` — код не соберётся как программа.');
  }
  if (/\b(printf|scanf|puts|getchar|putchar)\s*\(/.test(stripped) && !/#include\s*[<"]stdio\.h[>"]/.test(stripped)) {
    problems.push('Используется printf/scanf, но нет `#include <stdio.h>`.');
  }
  if (/\b(sqrt|pow|fabs|floor|ceil|fmod|acos)\s*\(/.test(stripped) && !/#include\s*[<"]math\.h[>"]/.test(stripped)) {
    problems.push('Математические функции требуют `#include <math.h>` (и флаг `-lm` в конце gcc).');
  }
  if (/\bgoto\b/.test(stripped)) {
    problems.push('`goto` запрещён в Школе 21 — перепиши через цикл или условие.');
  }
  if (/^\s*(int|char|double|float)\s+\w+\s*(\([^)]*\))?\s*;?\s*$/m.test(stripped) && /\bextern\b/.test(stripped)) {
    problems.push('Глобальные переменные в Школе 21 запрещены.');
  }

  return [...new Set(problems)].slice(0, 4);
}

/** Вытаскиваем из эталонного решения то, что обязательно должно быть в ответе. */
export function requiredPartsFromSolution(solution: string): RequiredPart[] {
  const low = (solution || '').toLowerCase();
  const parts: RequiredPart[] = [];
  const has = (s: string) => low.includes(s);

  if (/#include/.test(solution)) {
    const includes = [...solution.matchAll(/#include\s*<([^>]+)>/g)].map(m => `#include <${m[1]}>`);
    if (includes.length) parts.push({ label: 'подключение библиотек', anyOf: includes });
  }
  if (has('main')) parts.push({ label: 'int main(void)', anyOf: ['main'] });
  if (has('return')) parts.push({ label: 'return 0;', anyOf: ['return'] });

  const ownFns = [...solution.matchAll(/^\s*(?:static\s+)?(?:int|void|char|double|float|long|size_t|unsigned)\s+(\w+)\s*\([^;]*\)\s*\{/gm)]
    .map(m => m[1])
    .filter(n => n !== 'main');
  for (const fn of [...new Set(ownFns)]) {
    parts.push({ label: `своя функция ${fn}()`, anyOf: [fn] });
  }

  for (const kw of ['for', 'while', 'if', 'else', 'switch', 'do {', 'break']) {
    if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(low)) {
      parts.push({ label: `конструкция ${kw.replace(' {', '')}`, anyOf: [kw] });
    }
  }
  for (const io of ['printf', 'scanf', 'getchar']) {
    if (has(io)) parts.push({ label: `${io}()`, anyOf: [io] });
  }

  const specs = [...new Set([...solution.matchAll(/%[-0-9.]*[a-zA-Z]{1,2}/g)].map(m => m[0]))];
  if (specs.length) parts.push({ label: `формат ${specs.join(', ')}`, anyOf: specs });

  const strings = [...solution.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map(m => m[1].trim())
    .filter(s => s.length >= 3 && !s.includes('%'));
  for (const s of [...new Set(strings)].slice(0, 3)) {
    parts.push({ label: `вывод "${s}"`, anyOf: [s.toLowerCase()] });
  }

  return parts;
}

export function checkParts(userCode: string, parts: RequiredPart[]): { matched: string[]; missing: string[] } {
  const low = cleanSpace(userCode);
  const matched: string[] = [];
  const missing: string[] = [];
  parts.forEach(p => {
    if (p.anyOf.some(alt => low.includes(cleanSpace(alt)))) matched.push(p.label);
    else missing.push(p.label);
  });
  return { matched, missing };
}

/* ------------------------------------------------------------------ */
/* Универсальные точки входа                                           */
/* ------------------------------------------------------------------ */

export function checkExercise(exercise: Exercise, userCode: string): CheckResult {
  const reference = exercise.solution || '';
  if ((userCode || '').trim().length === 0) {
    return { status: 'empty', score: 0, headline: '', problems: [], missing: [], matched: [] };
  }
  if (exercise.taskType === 'c_code') {
    return checkCode(userCode, reference, exercise.requiredParts);
  }
  const res = checkCommand(userCode, reference);
  const refLines = splitSegments(reference).length;
  const userLines = splitSegments(userCode).length;
  if (res.status === 'correct' && refLines > 1 && userLines < refLines) {
    return {
      ...res,
      status: 'partial',
      headline: `Команды угаданы, но их должно быть ${refLines} — жми Enter и дописывай следующую строку`
    };
  }
  return res;
}

export function checkCode(userCode: string, reference: string, requiredParts?: RequiredPart[]): CheckResult {
  const user = (userCode || '').trim();
  if (!user) {
    return { status: 'empty', score: 0, headline: '', problems: [], missing: [], matched: [] };
  }

  const problems = cSyntaxProblems(user);
  const parts =
    requiredParts && requiredParts.length
      ? requiredParts
      : reference
        ? requiredPartsFromSolution(reference)
        : [];

  const { matched, missing } = checkParts(user, parts);
  const score = parts.length ? matched.length / parts.length : user.length > 20 ? 0.9 : 0.3;

  if (problems.length) {
    return { status: 'wrong', score: Math.min(score, 0.5), headline: 'Синтаксис сломан', problems, missing, matched };
  }
  if (missing.length) {
    return {
      status: 'partial',
      score,
      headline: `Есть всё, кроме: ${missing.slice(0, 4).join(', ')}`,
      problems: [],
      missing,
      matched
    };
  }
  return {
    status: 'correct',
    score: 1,
    headline: 'Компилируется и содержит всё нужное ✅',
    problems: [],
    missing: [],
    matched
  };
}

export function checkExamAnswer(q: ExamQuestion, answer: string): CheckResult {
  const user = (answer || '').trim();
  if (!user) {
    return { status: 'empty', score: 0, headline: '', problems: [], missing: [], matched: [] };
  }

  if (q.type === 'number') {
    const parsed = Number(user);
    const target = Number(q.correctAnswer);
    if (Number.isNaN(parsed)) {
      return { status: 'wrong', score: 0, headline: 'Нужно число, а не текст', problems: [], missing: [], matched: [] };
    }
    if (parsed === target) {
      return { status: 'correct', score: 1, headline: 'Число совпало', problems: [], missing: [], matched: [] };
    }
    return {
      status: 'wrong',
      score: 0,
      headline: 'Ответ не совпадает — пересчитай',
      problems: [`Ты написала ${parsed}. Проверь промежуточные шаги (вводимое и крайние значения).`],
      missing: [],
      matched: []
    };
  }

  if (q.type === 'choice' || q.type === 'text') {
    const same = cleanSpace(user) === cleanSpace(String(q.correctAnswer ?? ''));
    return same
      ? { status: 'correct', score: 1, headline: 'Совпадает', problems: [], missing: [], matched: [] }
      : { status: 'partial', score: 0.2, headline: 'Не похоже на ожидаемый ответ', problems: [], missing: [], matched: [] };
  }

  if (q.type === 'command') {
    return checkCommand(user, String(q.correctAnswer ?? ''));
  }

  // code
  const res = checkCode(user, q.referenceSolution || '', q.requiredParts);
  const forbidden = q.forbiddenParts || [];
  const low = cleanSpace(user);
  const violated = forbidden.filter(f => f.anyOf.some(a => low.includes(cleanSpace(a))));
  if (violated.length) {
    return {
      ...res,
      status: 'wrong',
      headline: 'Есть то, что запрещено условием',
      problems: [...res.problems, ...violated.map(v => `Условие запрещает: ${v.label}.`)]
    };
  }
  return res;
}

/** Цветовые классы подсветки — единые для всего сайта. */
export const statusStyles: Record<CheckStatus, { border: string; text: string; bg: string; dot: string; label: string }> = {
  empty: {
    border: 'border-slate-200 dark:border-slate-700',
    text: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-white dark:bg-slate-900',
    dot: 'bg-slate-300 dark:bg-slate-600',
    label: 'пусто'
  },
  wrong: {
    border: 'border-rose-400 dark:border-rose-600',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50/60 dark:bg-rose-950/30',
    dot: 'bg-rose-500',
    label: 'неверно'
  },
  partial: {
    border: 'border-amber-400 dark:border-amber-600',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50/60 dark:bg-amber-950/30',
    dot: 'bg-amber-500',
    label: 'не дописано'
  },
  correct: {
    border: 'border-emerald-500 dark:border-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/30',
    dot: 'bg-emerald-500',
    label: 'верно'
  }
};
