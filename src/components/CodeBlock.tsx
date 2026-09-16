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
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 shadow-sm">
      {title && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
          <span className="font-medium text-slate-300">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase tracking-wider">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Скопировать"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>
      )}

      {!title && (
        <div className="flex justify-end p-1.5 bg-slate-950/60 border-b border-slate-800/40">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Скопировано</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>Копировать</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200">
        <pre className="m-0 p-0">
          {lines.map((line, idx) => (
            <div key={idx} className="flex hover:bg-slate-800/40 -mx-3.5 px-3.5 py-0.2">
              {showLineNumbers && (
                <span className="inline-block w-6 shrink-0 text-right pr-3 text-slate-500 select-none text-[11px]">
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
