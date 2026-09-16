import React, { useRef, useState, useCallback } from 'react';
import { CheckStatus, statusStyles } from '../utils/liveCheck';

interface CodeEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  language?: 'c' | 'bash' | 'text';
  minRows?: number;
  placeholder?: string;
  status?: CheckStatus;
  /** Префикс-промпт для команд (рисуется слева) */
  prompt?: string;
  /** Ctrl/Cmd + Enter */
  onCheck?: () => void;
  /** Alt + Enter — перепрыгнуть к следующему полю ввода */
  onNext?: () => void;
  /** Enter работает как «перейти дальше», а не «новая строка» (для однострочных полей) */
  enterGoesNext?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
}

const INDENT = '    ';

/**
 * Простой редактор с «правильным» Enter:
 *  - Enter  -> новая строка с сохранением/наращиванием отступа;
 *  - Tab    -> 4 пробела (или отступ выделенных строк);
 *  - { / ( / " -> автопара;
 *  - Ctrl+Enter -> проверка, Alt+Enter -> следующее поле.
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  id,
  value,
  onChange,
  language = 'text',
  minRows = 3,
  placeholder,
  status = 'empty',
  prompt,
  onCheck,
  onNext,
  enterGoesNext = false,
  autoFocus,
  ariaLabel
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = useState(false);

  const setValue = useCallback(
    (next: string, selStart: number, selEnd: number = selStart) => {
      onChange(next);
      const apply = () => {
        const el = ref.current;
        if (!el) return;
        el.selectionStart = Math.min(selStart, next.length);
        el.selectionEnd = Math.min(selEnd, next.length);
      };
      // React обновляет контролируемый textarea синхронно для дискретных событий,
      // rAF — страховка на случай батча.
      apply();
      requestAnimationFrame(apply);
    },
    [onChange]
  );

  const indentOfLine = (line: string) => (line.match(/^[ \t]*/) || [''])[0];

  /** Та же логика, что и у клавиши Enter — нужна для экранных «клавиш». */
  const insertNewLine = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.slice(lineStart, start);
    const baseIndent = indentOfLine(currentLine);
    const opensBlock = /(\{|\/\*)\s*$/.test(currentLine);
    const newIndent = opensBlock ? baseIndent + (language === 'bash' ? '  ' : INDENT) : baseIndent;
    const insert = `\n${newIndent}`;
    setValue(value.slice(0, start) + insert + value.slice(end), start + insert.length);
  }, [value, language, setValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;

    // --- модификаторы ---
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onCheck?.();
      return;
    }
    if (e.key === 'Enter' && e.altKey) {
      e.preventDefault();
      onNext?.();
      return;
    }

    if (e.key === 'Enter' && enterGoesNext && !e.shiftKey) {
      e.preventDefault();
      onNext?.();
      return;
    }

    // --- Tab: отступ / блок ---
    if (e.key === 'Tab') {
      e.preventDefault();
      const selected = value.slice(start, end);
      if (e.shiftKey && selected.includes('\n')) {
        const lines = selected.split('\n').map(l => l.replace(/^ {1,4}/, ''));
        setValue(value.slice(0, start) + lines.join('\n') + value.slice(end), start);
        return;
      }
      if (selected.includes('\n')) {
        const lines = selected.split('\n').map(l => INDENT + l);
        setValue(value.slice(0, start) + lines.join('\n') + value.slice(end), start, start + lines.join('\n').length);
        return;
      }
      const indent = language === 'bash' ? '  ' : INDENT;
      setValue(value.slice(0, start) + indent + value.slice(end), start + indent.length);
      return;
    }

    // --- Enter: новая строка с авто-отступом ---
    if (e.key === 'Enter') {
      e.preventDefault();
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);
      const afterCursor = value.slice(start);
      const baseIndent = indentOfLine(currentLine);
      const opensBlock = /(\{|\/\*)\s*$/.test(currentLine) || /[:,]\s*$/.test(currentLine) && language !== 'bash';
      const closesHere = /^\s*\}/.test(afterCursor);

      // Enter внутри "{}" — разворачиваем в три строки
      const around = value.slice(start - 1, start + 1);
      if (around === '{}' || around === '()') {
        const inner = baseIndent + (language === 'bash' ? '  ' : INDENT);
        const insert = `\n${inner}\n${baseIndent}`;
        setValue(value.slice(0, start) + insert + value.slice(start + 1), start + 1 + inner.length);
        return;
      }

      let newIndent = opensBlock ? baseIndent + (language === 'bash' ? '  ' : INDENT) : baseIndent;
      let insert = `\n${newIndent}`;
      // Если следующая строка начинается с } — её тоже не трогаем, но текущую «закрываем»
      if (closesHere && opensBlock) {
        insert = `\n${baseIndent + (language === 'bash' ? '  ' : INDENT)}\n${baseIndent}`;
        setValue(value.slice(0, start) + insert + value.slice(start), start + 1 + (baseIndent + (language === 'bash' ? '  ' : INDENT)).length);
        return;
      }
      setValue(value.slice(0, start) + insert + value.slice(start), start + insert.length);
      return;
    }

    // --- автопара скобок/кавычек ---
    const pairs: Record<string, string> = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key] && start === end) {
      const closing = pairs[e.key];
      const nextCh = value[start] || '';
      // повторяем уже существующую закрывающую, а не вставляем новую
      if (nextCh === closing && (e.key === closing || e.key === '"')) {
        e.preventDefault();
        setValue(value, start + 1);
        return;
      }
      if (/^[\s)\]}"]*$/.test(value.slice(start, start + 1)) || nextCh === '' || /[\s)\]}]/.test(nextCh)) {
        e.preventDefault();
        setValue(value.slice(0, start) + e.key + closing + value.slice(start), start + 1);
        return;
      }
    }
    if ((pairs[value[start - 1]] || value[start - 1] === '"') && value[start] === value[start - 1] && e.key === value[start]) {
      e.preventDefault();
      setValue(value, start + 1);
    }
  };

  const lineCount = Math.max(1, value.split('\n').length);
  const rows = Math.max(minRows, lineCount);
  const style = statusStyles[status];
  const borderColor = focused || status !== 'empty' ? style.border : 'border-slate-200 dark:border-slate-700';

  return (
    <div className="space-y-1">
      <div
        className={`flex items-stretch rounded-md border bg-white dark:bg-slate-950 transition-colors ${borderColor} ${
          status === 'correct' ? 'ring-1 ring-emerald-500/30' : ''
        } ${status === 'wrong' ? 'ring-1 ring-rose-500/20' : ''}`}
      >
        {language !== 'text' && (
          <div className="shrink-0 select-none py-2.5 pl-2.5 pr-1.5 text-right font-mono text-[11px] leading-relaxed text-slate-300 dark:text-slate-600 border-r border-slate-100 dark:border-slate-800">
            {Array.from({ length: rows }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        <div className="flex flex-1 items-start">
          {prompt && (
            <span className="pl-2.5 pt-2.5 font-mono text-xs text-emerald-600 dark:text-emerald-400 select-none">{prompt}</span>
          )}
          <textarea
            ref={ref}
            id={id}
            aria-label={ariaLabel}
            value={value}
            rows={rows}
            autoFocus={autoFocus}
            spellCheck={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-2.5 py-2.5 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
        <span>
          <kbd
            role="button"
            tabIndex={0}
            title={enterGoesNext ? 'Перейти к следующему полю' : 'Вставить перенос строки в текущем поле'}
            onClick={() => (enterGoesNext ? onNext?.() : insertNewLine())}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                enterGoesNext ? onNext?.() : insertNewLine();
              }
            }}
            className="px-1 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-none cursor-pointer hover:border-emerald-500 hover:text-emerald-600"
          >
            ⏎ Enter
          </kbd>
          <span>{enterGoesNext ? ' — следующее поле' : ' — новая строка'}</span>
        </span>
        {onCheck && (
          <span>
            <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">Ctrl+Enter</kbd>
            {' '}проверить
          </span>
        )}
        {onNext && !enterGoesNext && (
          <span>
            <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">Alt+Enter</kbd>
            {' '}следующее поле
          </span>
        )}
        <span>
          <kbd className="px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">Tab</kbd> отступ
        </span>
      </div>
    </div>
  );
};

export default CodeEditor;
