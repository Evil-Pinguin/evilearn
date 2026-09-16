import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, Trash2 } from 'lucide-react';

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
      output: 'On branch develop\nYour branch is up to date with \'origin/develop\'.\n\nnothing to commit, working tree clean'
    }
  ]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
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
      out = 'Доступные команды терминала:\n  pwd, ls, ls -la, cd, cat, echo, mkdir, gcc, git status, git log, git diff, clang-format -n, clear, help';
    } else if (lower === 'pwd') {
      out = '/home/breashee/evilearn/src';
    } else if (lower === 'ls') {
      out = '1948.c  char_decode.c  quest3.c  door_functions.c  door_functions_print.c  data';
    } else if (lower === 'ls -la' || lower === 'ls -al' || lower === 'ls -l -a' || lower === 'ls -a -l') {
      out = 'drwxr-xr-x 3 breashee students 4096 Sep 16 06:10 .\ndrwxr-xr-x 4 breashee students 4096 Sep 16 06:08 ..\n-rw-r--r-- 1 breashee students  384 Sep 16 06:09 .clang-format\n-rw-r--r-- 1 breashee students 1420 Sep 16 06:09 1948.c\n-rw-r--r-- 1 breashee students 2100 Sep 16 06:09 char_decode.c\n-rw-r--r-- 1 breashee students 1150 Sep 16 06:09 quest3.c\n-rw-r--r-- 1 breashee students 2400 Sep 16 06:09 door_functions.c\n-rw-r--r-- 1 breashee students 3100 Sep 16 06:09 door_functions_print.c\ndrwxr-xr-x 2 breashee students 4096 Sep 16 06:09 data';
    } else if (lower.startsWith('cat')) {
      if (lower.includes('.clang-format')) {
        out = 'BasedOnStyle: Google\nIndentWidth: 4\nColumnLimit: 110\nLanguage: Cpp';
      } else if (lower.includes('1948.c')) {
        out = '#include <stdio.h>\n// Quest 1: Largest prime divisor using subtract division';
      } else {
        out = 'cat: file content displayed';
      }
    } else if (lower.startsWith('gcc')) {
      if (!lower.includes('-wall') || !lower.includes('-werror')) {
        out = 'Предупреждение: для сдачи проекта в Школе 21 обязательны флаги -Wall -Werror -Wextra -std=c11!';
      } else if (lower.includes('door_functions') && !lower.includes('-lm')) {
        out = '/usr/bin/ld: /tmp/door_functions.o: in function `lemniscate\':\ndoor_functions.c:(.text+0x42): undefined reference to `sqrt\'\ncollect2: error: ld returned 1 exit status\n[ПОДСКАЗКА]: Добавьте -lm в самый конец команды!';
        isErr = true;
      } else {
        out = 'Компиляция успешно завершена (0 errors, 0 warnings). Создан бинарный файл.';
      }
    } else if (lower.startsWith('clang-format')) {
      if (lower.includes('-n')) {
        out = 'Code style check passed! 0 formatting warnings found.';
      } else if (lower.includes('-i')) {
        out = 'Formatted files in-place according to .clang-format';
      } else {
        out = 'Usage: clang-format [-n|-i] <file.c>';
      }
    } else if (lower === 'git status') {
      out = 'On branch develop\nYour branch is up to date with \'origin/develop\'.\n\nnothing to commit, working tree clean';
    } else if (lower.startsWith('git log')) {
      out = '9e2d2b9 (HEAD -> develop, origin/develop) style: apply clang-format\n3d46a93 bonus quest 5: ascii plots\n52972d9 quest 4: door functions table\nbeddbe2 quest 3: recursive fibonacci\n80222ca quest 2: hex encode/decode\nc97598e quest 1: largest prime divisor';
    } else if (lower.startsWith('git diff')) {
      out = 'diff --git a/src/1948.c b/src/1948.c\n(No unstaged changes)';
    } else if (lower.startsWith('echo')) {
      const text = cmd.replace(/^echo\s*/i, '').replace(/^"|"$/g, '');
      out = text;
    } else if (lower.startsWith('mkdir')) {
      out = 'Directory created.';
    } else {
      out = `bash: ${cmd}: команда выполнена успешно в окружении Школы 21.`;
    }

    setHistory(prev => [...prev, { command: cmd, output: out, isError: isErr }]);
    setInput('');
  };

  return (
    <div className={`my-6 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl transition-all ${
      isExpanded ? 'fixed inset-4 z-50 flex flex-col' : 'relative'
    }`}>
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block cursor-pointer" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block cursor-pointer" />
          <span className="ml-2 font-medium text-slate-300 flex items-center gap-1.5">
            <TerminalIcon size={13} className="text-emerald-400" />
            breashee@er-d9: ~/evilearn/src
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistory([])}
            className="hover:text-slate-200 transition-colors p-1"
            title="Очистить консоль"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:text-slate-200 transition-colors p-1"
            title={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className={`p-4 font-mono text-xs overflow-y-auto space-y-3 leading-relaxed text-slate-200 ${
        isExpanded ? 'flex-1' : 'max-h-72 min-h-48'
      }`}>
        <div className="text-slate-500 text-[11px] pb-1 border-b border-slate-900">
          Школа 21 Campus Terminal Simulator — er-d9 (Debian 6.1, GCC 12.2, C11). Введите <code className="text-emerald-400">help</code> для списка команд.
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-emerald-400 font-bold">breashee@er-d9:src$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            {item.output && (
              <pre className={`whitespace-pre-wrap pl-4 text-[11px] ${
                item.isError ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {item.output}
              </pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 font-mono text-xs">
        <span className="text-emerald-400 font-bold select-none">breashee@er-d9:src$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ls -la, gcc, git status, sed -n '13p'..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};
