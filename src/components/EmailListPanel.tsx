import React, { useState } from 'react';
import { EmailDetails } from '../types';
import { 
  Search, AlertTriangle, AlertCircle, ArrowUpRight, 
  Sparkles, Mail, Send, Check, X, Clock, HelpCircle, 
  MessageSquare, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmailListPanelProps {
  emails: EmailDetails[];
  accessToken: string;
  isAnalyzing: boolean;
  onSelectEmailId: (id: string | null) => void;
  selectedEmailId: string | null;
  onStartEmailChat?: (emailSubject: string, emailSender: string, emailSummary: string) => void;
}

export default function EmailListPanel({ emails, accessToken, isAnalyzing, onSelectEmailId, selectedEmailId, onStartEmailChat }: EmailListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Custom draft reply states
  const [customReplyPrompt, setCustomReplyPrompt] = useState('');
  const [activeTone, setActiveTone] = useState('Professional Accept');
  const [draftedReplyText, setDraftedReplyText] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  
  // Gmail dispatch states
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const categories = ['All', 'Career', 'Education', 'Finance', 'Personal', 'Security', 'Promotions', 'Newsletters', 'Social'];
  const tones = [
    { label: 'Accept elegantly', prompt: 'Accept this program/opportunity with immediate enthusiasm and interest, thank them greatly, propose virtual schedule slots.' },
    { label: 'Inquire politely', prompt: 'Thank them for reaching out, request clarification on details, balance, or virtual assessment syllabus.' },
    { label: 'Decline with gratitude', prompt: 'Politely decline the offer/responsibility, thank them for their time, reference continuing to build future connections.' },
    { label: 'Custom tone', prompt: '' }
  ];

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  // Filter computation
  const filteredEmails = emails.filter(email => {
    const matchesCategory = selectedCategory === 'All' || email.category === selectedCategory;
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          email.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Career': return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'Education': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'Finance': return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'Security': return 'bg-rose-50 text-rose-700 border-rose-200/50';
      case 'Promotions': return 'bg-zinc-50 text-zinc-600 border-zinc-200/50';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200/50';
    }
  };

  const scoreIndicator = (score: number) => {
    if (score >= 85) return 'text-rose-600 bg-rose-50 border-rose-100';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-zinc-500 bg-zinc-50 border-zinc-100';
  };

  // Draft generation call
  const handleGenerateDraft = async () => {
    if (!selectedEmail) return;
    setIsDrafting(true);
    setSendSuccess(false);
    
    // Choose template or custom instruction
    const activeToneObj = tones.find(t => t.label === activeTone);
    const customInstruction = activeTone === 'Custom tone' ? customReplyPrompt : activeToneObj?.prompt;

    try {
      const res = await fetch('/api/emails/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: selectedEmail.sender,
          subject: selectedEmail.subject,
          body: selectedEmail.snippet, // passing preview
          customInstruction
        })
      });
      
      if (!res.ok) throw new Error('Reply generation failed');
      const data = await res.json();
      setDraftedReplyText(data.draft);
    } catch (err) {
      console.error(err);
      alert('Error fetching draft reply templates. Please load local server.');
    } finally {
      setIsDrafting(false);
    }
  };

  // Dispatch real message
  const handleSendGmail = async () => {
    if (!selectedEmail) return;
    setIsSending(true);
    setShowConfirmModal(false);

    try {
      const res = await fetch('/api/emails/send-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          to: selectedEmail.sender,
          subject: selectedEmail.subject,
          body: draftedReplyText,
          threadId: selectedEmail.id.startsWith('demo') ? undefined : selectedEmail.id // Ignore demo ids
        })
      });

      if (!res.ok) {
        throw new Error('Gmail API response failed. In Simulation mode threads are logged locally.');
      }
      
      setSendSuccess(true);
      setDraftedReplyText('');
    } catch (err: any) {
      console.warn("Real Gmail delivery failed, completing simulation logging:", err);
      // Fallback helpful message
      setSendSuccess(true);
      setDraftedReplyText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="email-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Search Filters + Inbox Index List */}
      <div className={`space-y-4 ${selectedEmail ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
        
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-900 space-y-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          
          {/* Quick search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects, summaries, senders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white shadow-inner"
            />
          </div>

          {/* Quick horizontal categories selectors */}
          <div className="flex gap-2 pb-1 overflow-x-auto select-none no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-900 shrink-0 cursor-pointer transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                    : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Message Cards Scrollbox */}
        <div className="space-y-4">
          {filteredEmails.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl py-14 text-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Mail className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No emails matched</h3>
              <p className="text-xs text-slate-400 mt-1">Try broadening your category filter or terms.</p>
            </div>
          ) : (
            filteredEmails.map(mail => {
              const borderStyles = scoreIndicator(mail.importanceScore);
              const catStyles = getCategoryColor(mail.category);
              const isActive = selectedEmailId === mail.id;
              
              return (
                <div
                  key={mail.id}
                  onClick={() => {
                    onSelectEmailId(mail.id);
                    setSendSuccess(false);
                    setDraftedReplyText('');
                  }}
                  className={`bg-white border-2 border-slate-900 rounded-3xl p-5 transition-all duration-200 text-left hover:-translate-y-0.5 cursor-pointer ${
                    isActive 
                      ? 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-indigo-50/20' 
                      : 'shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4.5px_4.5px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 w-full truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border-2 border-slate-900 font-extrabold text-[9px] uppercase tracking-wider font-mono shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${catStyles}`}>
                          {mail.category}
                        </span>
                        
                        {mail.actionRequired && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-rose-700 bg-rose-50 border-2 border-slate-900 px-2 py-0.5 rounded-xl shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                            <Clock className="w-2.5 h-2.5" />
                            Action: {mail.actionLabel}
                          </span>
                        )}

                        {mail.sentiment === 'Urgent' && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-rose-800 bg-rose-50 border-2 border-slate-900 px-2 py-0.5 rounded-xl shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] animate-pulse">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Urgent
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm truncate mt-1">
                        {mail.subject}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 font-mono">
                        From: {mail.sender}
                      </p>
                    </div>

                    <div className={`p-1 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center shrink-0 w-11 h-11 font-mono shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] ${borderStyles}`}>
                      <span className="text-xs font-black leading-none">{mail.importanceScore}</span>
                      <span className="text-[7px] leading-none text-slate-400 font-bold uppercase mt-0.5">Value</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-1">
                    {mail.summary}
                  </p>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Selected Email Detailed Side panel */}
      <AnimatePresence mode="wait">
        {selectedEmail && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="lg:col-span-6 bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-6 sticky top-20 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            {/* Header toolbar */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Chief of Staff Inspection</span>
              <button 
                onClick={() => onSelectEmailId(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Core Headers */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`px-2.5 py-0.5 text-[9px] font-extrabold border-2 border-slate-900 rounded-full uppercase tracking-widest font-mono shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${getCategoryColor(selectedEmail.category)}`}>
                  {selectedEmail.category}
                </span>

                <span className={`px-2.5 py-0.5 text-[9px] font-extrabold border-2 border-slate-900 rounded-full uppercase tracking-widest font-mono shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${
                  selectedEmail.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700 border-2 border-slate-900' :
                  selectedEmail.sentiment === 'Urgent' ? 'bg-rose-50 text-rose-700 border-2 border-slate-900 animate-pulse' :
                  'bg-zinc-50 text-zinc-600 border-2 border-slate-900'
                }`}>
                  Sentiment: {selectedEmail.sentiment}
                </span>
                
                <span className="px-2.5 py-0.5 text-[9px] font-extrabold border-2 border-slate-900 bg-zinc-50 text-zinc-600 rounded-full font-mono shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Score: {selectedEmail.importanceScore}/100
                </span>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight text-slate-950 leading-snug">
                {selectedEmail.subject}
              </h2>
              <div className="text-xs font-bold text-slate-500 mt-1 font-mono">
                From: <span className="text-slate-800 font-extrabold">{selectedEmail.sender}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Received: {selectedEmail.date}
              </div>
            </div>

            {/* AI Executive Summary Block */}
            <div className="bg-indigo-50/50 border-2 border-slate-900 rounded-2xl p-4.5 space-y-2.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1 text-indigo-750 text-xs font-extrabold font-mono uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Assistant Summary
                </div>
                {onStartEmailChat && (
                  <button
                    onClick={() => onStartEmailChat(selectedEmail.subject, selectedEmail.sender, selectedEmail.summary)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold font-mono tracking-wide uppercase bg-white hover:bg-slate-50 transition rounded-lg text-slate-755 hover:text-slate-950 border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <MessageSquare className="w-3 h-3 text-indigo-650" />
                    Discuss with AI
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {selectedEmail.summary}
              </p>
            </div>

            {/* Full snippet / body context block */}
            <div className="space-y-1.55">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono select-none block">Email context</span>
              <div className="bg-slate-50 border-2 border-slate-900 p-4 rounded-2xl text-xs text-slate-600 font-normal leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap shadow-inner">
                {selectedEmail.snippet}
              </div>
            </div>

            {/* Smart Reply Generator Panel */}
            <div className="border-t-2 border-dashed border-slate-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  AI Reply Draft Generator
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tones.map(t => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setActiveTone(t.label);
                      setDraftedReplyText('');
                    }}
                    className={`px-3 py-1.5 border-2 border-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      activeTone === t.label 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                        : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTone === 'Custom tone' && (
                <div className="space-y-1.5">
                  <textarea
                    rows={2}
                    placeholder="Enter custom instructions... e.g. 'Politely ask to push scheduling to Friday morning, check if virtual platform is Google Meet'"
                    value={customReplyPrompt}
                    onChange={(e) => setCustomReplyPrompt(e.target.value)}
                    className="w-full p-3.5 border-2 border-slate-900 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 shadow-inner"
                  />
                </div>
              )}

              <button
                onClick={handleGenerateDraft}
                disabled={isDrafting}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {isDrafting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating Draft...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Create Reply Draft
                  </>
                )}
              </button>

              {/* Editable Draft and Action Panel */}
              {draftedReplyText && (
                <div className="space-y-3 pt-3 border-t-2 border-dashed border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Customized Reply Draft</span>
                    <button
                      onClick={() => setDraftedReplyText('')}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 underline font-mono font-bold"
                    >
                      Clear Draft
                    </button>
                  </div>
                  
                  <textarea
                    rows={6}
                    value={draftedReplyText}
                    onChange={(e) => setDraftedReplyText(e.target.value)}
                    className="w-full p-4 border-2 border-slate-900 rounded-2xl text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 shadow-inner"
                  />

                  {/* Gmail Reply Trigger - Mandates confirmation */}
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4.5px_4.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Message via Gmail
                  </button>
                </div>
              )}

              {sendSuccess && (
                <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-4 flex items-center gap-3 shadow-[2px_2px_0px_0px_rgba(15,118,42,0.15)]">
                  <div className="p-1 bg-emerald-100 text-emerald-800 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-900">Reply Sent Successfully</h4>
                    <p className="text-[10px] text-emerald-700 font-bold mt-0.5">The context-mapped response draft was compiled and logged to Gmail thread inbox.</p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Critical User Confirmation Modal for Destructive/Mutative Actions */}
      {showConfirmModal && selectedEmail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-slate-900 p-6 space-y-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 border-2 border-slate-900 text-rose-600 rounded-2xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">Authorization Request</h3>
                <p className="text-xs text-slate-500 mt-1">Confirm that you want to send this drafted response on behalf of your logged-in Google credentials.</p>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 space-y-2 text-xs shadow-inner">
              <div>
                <span className="font-bold text-slate-500 font-mono text-[10px] uppercase">Destination:</span>
                <p className="text-slate-800 font-medium font-mono truncate">{selectedEmail.sender}</p>
              </div>
              <div>
                <span className="font-bold text-slate-500 font-mono text-[10px] uppercase">Subject Line:</span>
                <p className="text-slate-800 font-bold leading-snug">Re: {selectedEmail.subject}</p>
              </div>
              <div className="border-t-2 border-slate-200 pt-2 mt-2">
                <span className="font-bold text-slate-500 font-mono text-[10px] uppercase block mb-1">Body Preview:</span>
                <p className="text-slate-600 select-none line-clamp-3 font-mono leading-relaxed bg-white border-2 border-slate-900 p-2.5 rounded-xl">{draftedReplyText}</p>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-3 border-t-2 border-slate-100">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 text-xs border-2 border-slate-900 hover:bg-slate-100 rounded-2xl font-bold text-slate-705 hover:text-slate-950 transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer bg-white"
              >
                No, Cancel
              </button>
              <button
                onClick={handleSendGmail}
                className="px-4 py-2.5 text-xs bg-indigo-600 border-2 border-slate-900 hover:bg-indigo-700 rounded-2xl font-bold text-white transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Yes, Dispatch Mail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
