import React, { useState } from 'react';
import { FileText, Copy, Check, Printer } from 'lucide-react';

interface WeeklyReportPanelProps {
  markdownReport: string;
}

export default function WeeklyReportPanel({ markdownReport }: WeeklyReportPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Safe lightweight regex-driven Markdown-to-JSX renderer
  const renderMarkdown = (text: string) => {
    if (!text) return <p className="text-zinc-500 italic">No report available yet.</p>;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 1
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-3xl font-extrabold text-slate-950 mt-6 mb-3 border-b-2 border-slate-900 pb-2 tracking-tight font-serif italic">
            {trimmed.substring(2)}
          </h1>
        );
      }
      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl font-black text-slate-900 mt-5 mb-2.5 tracking-tight flex items-center gap-2 font-serif italic">
            <span className="w-1.5 h-3.5 bg-slate-950 rounded-xs" />
            {trimmed.substring(3)}
          </h2>
        );
      }
      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-extrabold text-slate-800 mt-4 mb-2 tracking-tight">
            {trimmed.substring(4)}
          </h3>
        );
      }
      // Blockquote
      if (trimmed.startsWith('>')) {
        return (
          <blockquote key={idx} className="border-l-4 border-indigo-600 bg-indigo-50/50 p-4 my-3 rounded-r-2xl border border-slate-900 text-xs leading-relaxed text-indigo-950 shadow-inner">
            {trimmed.substring(1).trim()}
          </blockquote>
        );
      }
      // Bullets
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Parse bold markers inside bullets
        const parsedContent = parseInlineStyles(trimmed.substring(2));
        return (
          <ul key={idx} className="list-disc pl-5 my-1.5 text-xs text-slate-700 leading-relaxed">
            <li>{parsedContent}</li>
          </ul>
        );
      }

      // Empty space
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Default paragraph with bold support
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed my-2">
          {parseInlineStyles(trimmed)}
        </p>
      );
    });
  };

  // Inline formatting helper (only **xx** bolding parse)
  const parseInlineStyles = (rawText: string) => {
    const parts = rawText.split('**');
    return parts.map((part, i) => {
      // Odd indices are bolded
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-slate-950">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div id="weekly-report" className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-slate-900 p-4 rounded-3xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 rounded-xl text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider">Executive Inbox Report</h4>
            <p className="text-[10px] text-slate-500 font-bold">Copied summary dashboard configured for academic review boards.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="bento-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 bg-white border-2 border-slate-900 hover:bg-slate-100 rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 print:hidden select-none cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleCopy}
            className="bento-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 bg-indigo-600 border-2 border-slate-900 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 print:hidden select-none cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Markdown
              </>
            )}
          </button>
        </div>
      </div>

      {/* Styled Paper Container */}
      <div className="bg-white border-2 border-slate-900 rounded-3xl p-8 md:p-12 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] max-w-4xl mx-auto font-sans leading-relaxed select-text print:border-0 print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8 uppercase tracking-widest font-mono text-[10px] text-slate-400 font-bold">
          <span>Sahaya Intelligence Executive Summary</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="prose prose-slate max-w-none">
          {renderMarkdown(markdownReport)}
        </div>

        <div className="mt-12 pt-6 border-t-2 border-slate-200 flex justify-between items-center text-[10px] font-mono font-bold text-slate-450 uppercase select-none">
          <span>Report Generated by Sahaya Assistant</span>
          <span>SEC-CODE: CLOUD-NATIVE-MIND</span>
        </div>
      </div>

    </div>
  );
}
