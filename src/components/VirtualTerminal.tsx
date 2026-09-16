import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

interface CommandHistoryItem {
  command: string;
  output: string;
  isError?: boolean;
}

export const VirtualTerminal: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'uname -a',
      output: 'Linux er-d9 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux (School 21 Campus)'
    },
    {
      command: 'git status',
      output: 'On branch develop\nYour branch is up to date with \'origin/develop\'.\nnothing to commit, working tree clean'
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    let out = '';
    let isErr = false;
    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (lower === 'help') {
      out = 'Команды: pwd, ls, ls -la, cd, cat, echo, mkdir, gcc, git status, git log, git diff, clang-format -n, clear, help';
    } else if (lower === 'pwd') {
      out = '/home/breashee/evilearn/src';
    } else if (lower === 'ls') {
      out = '1948.c  char_decode.c  quest3.c  door_functions.c  door_functions_print.c  data';
    } else if (lower.startsWith('gcc')) {
      if (lower.includes('door_functions') && !lower.includes('-lm')) {
        out = 'undefined reference to `sqrt\'\n[ОШИБКА]: Добавьте флаг -lm в самый конец команды!';
        isErr = true;
      } else {
        out = 'Компиляция успешно завершена (0 errors, 0 warnings).';
      }
    } else if (lower === 'git status') {
      out = 'On branch develop\nnothing to commit, working tree clean';
    } else {
      out = `bash: ${cmd}: выполнено.`;
    }

    setHistory(prev => [...prev, { command: cmd, output: out, isError: isErr }]);
    setInput('');
  };

  return (
    <div className="my-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <TerminalIcon size={13} className="text-emerald-400" />
          breashee@er-d9: ~/evilearn/src
        </span>
        <button
          onClick={() => setHistory([])}
          className="hover:text-slate-200 transition-colors"
          title="Очистить"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Output */}
      <div className="p-3.5 font-mono text-xs overflow-y-auto space-y-2 max-h-64 min-h-36 text-slate-200">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-white">{item.command}</span>
            </div>
            {item.output && (
              <pre className={`whitespace-pre-wrap pl-3 text-[11px] ${
                item.isError ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 border-t border-slate-800 font-mono text-xs">
        <span className="text-emerald-400 font-bold select-none">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ls, pwd, gcc, git status..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </form>
    </div>
  );
};
