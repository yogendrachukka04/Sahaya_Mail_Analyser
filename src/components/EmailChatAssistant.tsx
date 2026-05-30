import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AnalysisResults } from '../types';
import { Send, Sparkles, MessageSquare, HelpCircle, CornerDownLeft, RefreshCw, Bot } from 'lucide-react';

interface EmailChatAssistantProps {
  analyzedContext: AnalysisResults;
  isAnalyzing: boolean;
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

export default function EmailChatAssistant({ analyzedContext, isAnalyzing, initialQuery, onClearInitialQuery }: EmailChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hi Yogi! I'm Sahaya, your email chief of staff. Since I have parsed and structured your inbox, you can ask me anything! E.g., 'Do I have any internship deadlines coming up?' or 'Did I receive any scholarship updates?'",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSendingQuery, setIsSendingQuery] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textQuery = customText || inputValue.trim();
    if (!textQuery || isSendingQuery) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: textQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSendingQuery(true);

    try {
      const res = await fetch('/api/emails/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.text,
          analyzedContext,
        })
      });

      if (!res.ok) throw new Error('API query fail');
      const data = await res.json();

      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: "I couldn't reach the secure chat processor. Please confirm your internet connection or check back once database indexes resolve.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsSendingQuery(false);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSend(undefined, initialQuery);
    }
  }, [initialQuery]);

  const presetQueries = [
    "List internship opportunities.",
    "Do I have any pending finances?",
    "Show scholarship and reference deadlines.",
    "Summarize critical action items."
  ];

  return (
    <div id="email-chat-assistant" className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch min-h-[500px]">
      
      {/* Suggestions and Preset Prompts */}
      <div className="lg:col-span-1 bg-white border-2 border-slate-900 rounded-3xl p-5 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wider font-mono">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Quick Assistants
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 mb-4 leading-relaxed">Click any preset prompt to ask Sahaya to filter, parse, or evaluate your emails instantly.</p>
          
          <div className="flex flex-col gap-2.5">
            {presetQueries.map(q => (
              <button
                key={q}
                onClick={() => {
                  setInputValue(q);
                }}
                className="text-left text-xs bg-white hover:bg-slate-50 p-3 rounded-xl border-2 border-slate-900 transition font-bold hover:border-slate-950 text-slate-700 hover:text-slate-900 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50/50 border-2 border-slate-900 p-4 rounded-2xl mt-5 shadow-inner">
          <span className="text-[9px] uppercase font-bold font-mono tracking-widest text-indigo-700 block">LLM Processing Core</span>
          <p className="text-[10px] text-indigo-900 font-bold mt-1 leading-normal">Sahaya relies on Gemini 3.5 Flash server-side integration combined with real-time Gmail indexing.</p>
        </div>
      </div>

      {/* Main Conversational Box (Right 3 cols) */}
      <div className="lg:col-span-3 bg-white border-2 border-slate-900 rounded-3xl flex flex-col h-[540px] overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        
        {/* Banner/Header */}
        <div className="p-4 border-b-2 border-slate-900 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600 animate-bounce" />
            <div>
              <h3 className="text-sm font-black text-slate-950">Inbox Chat Assistant</h3>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Inbox Index active
              </span>
            </div>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/15 select-text">
          {messages.map((msg, idx) => {
            const isAsst = msg.sender === 'assistant';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`p-1.5 rounded-xl border-2 border-slate-900 h-8 w-8 shrink-0 flex items-center justify-center font-bold shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${
                  isAsst ? 'bg-indigo-50 text-indigo-750' : 'bg-slate-100 text-slate-800'
                }`}>
                  {isAsst ? <Bot className="w-4 h-4" /> : 'Y'}
                </div>

                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl border-2 border-slate-900 text-xs leading-relaxed whitespace-pre-wrap shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] ${
                    isAsst 
                      ? 'bg-white text-slate-800' 
                      : 'bg-slate-950 text-white'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`text-[9px] font-mono font-bold text-slate-400 ${isAsst ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isSendingQuery && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="p-1.5 rounded-xl border-2 border-slate-900 h-8 w-8 bg-indigo-50 text-indigo-700 shrink-0 flex items-center justify-center animate-pulse shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl flex items-center gap-2 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-650 animate-spin" />
                <span className="text-xs text-slate-500 font-bold">Sahaya is reading emails...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t-2 border-slate-900 bg-white flex gap-2.5">
          <input
            type="text"
            placeholder="Ask Sahaya e.g., 'What are my top 3 academic tasks this week?'"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-slate-900 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-inner"
            disabled={isSendingQuery}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSendingQuery}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 border-2 border-slate-900 hover:border-slate-950 text-white text-xs font-bold rounded-2xl transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
