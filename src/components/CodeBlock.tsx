import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'c',
  title,
  showLineNumbers = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-xl">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-medium text-slate-300">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Скопировать код"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      {!title && (
        <div className="flex justify-end p-2 bg-slate-900/40 border-b border-slate-800/50">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-850 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span className="text-[11px]">Копировать</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-200">
        <pre className="m-0 p-0">
          {lines.map((line, idx) => (
            <div key={idx} className="flex hover:bg-slate-900/50 -mx-4 px-4 py-0.5">
              {showLineNumbers && (
                <span className="inline-block w-8 shrink-0 text-right pr-4 text-slate-600 select-none text-xs">
                  {idx + 1}
                </span>
              )}
              <span className="flex-1 whitespace-pre">{line || ' '}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
