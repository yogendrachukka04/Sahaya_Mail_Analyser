import React, { useState } from 'react';
import { 
  Sparkles, Mail, Award, Calendar, BarChart2, 
  MessageSquare, FileText, ArrowRight, ShieldCheck, 
  Lock, RefreshCw, AlertCircle, CheckCircle, Zap, Cpu, HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLogin: () => void;
  onDemoMode: () => void;
  isLoggingIn: boolean;
  apiError: string | null;
}

type PreviewTab = 'inbox' | 'opportunities' | 'deadlines' | 'chat';

export default function LandingPage({ onLogin, onDemoMode, isLoggingIn, apiError }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('inbox');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const previewTabs = [
    { id: 'inbox', label: 'Priority Mailbox', icon: Mail, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'opportunities', label: 'Opportunity Radar', icon: Award, color: 'bg-emerald-50 text-emerald-700' },
    { id: 'deadlines', label: 'Action Deadlines', icon: Calendar, color: 'bg-rose-50 text-rose-700' },
    { id: 'chat', label: 'AI Discuss Desk', icon: MessageSquare, color: 'bg-amber-50 text-amber-700' },
  ];

  const faqItems = [
    {
      q: "How does Sahaya read my inbox securely?",
      a: "Sahaya integrates directly with official Google API clients. Authenticated queries run in memory as clean secure backend transactions proxying through Google Gemini 3.5 Flash server-side. Your raw emails are processed safely and never sold, leased, or distributed."
    },
    {
      q: "Why do I see a red Google warning during login?",
      a: "Because Sahaya is operating in a sandboxed developer environment, Google flags it as an 'Unverified App'. You can proceed 100% safely by clicking 'Advanced' in the bottom-left of the Google pop-up, then clicking 'Go to Sahaya (unsafe)' to grant consent."
    },
    {
      q: "Can I try Sahaya without linking my actual email account?",
      a: "Yes! We designed a premium fully interactive Demo Sandbox. Click 'Explore Demo Sandbox' in the workspace landing card to instantly enter a state of synthetic mailbox data and run analyses with our integrated Gemini suite."
    },
    {
      q: "Does the AI assistant draft actual mail replies?",
      a: "Yes. From the Sahaya Dashboard view, you can trigger deep discussions regarding any email. The AI drafts and packages responses that you can review and copy-paste directly."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-slate-900 font-sans selection:bg-indigo-150 selection:text-indigo-900 relative overflow-x-hidden">
      
      {/* Decorative Grid Background and Glowing Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[45%] right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Landing Sticky Top Header Grid */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-slate-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-950 text-base leading-none tracking-tight">Sahaya</h1>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-1 block">Mail Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={onDemoMode}
              className="px-3 py-1.5 hidden sm:inline-flex items-center justify-center gap-1.5 border-2 border-slate-900 font-mono text-[11px] font-black rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-950 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Demo Sandbox
            </button>
            <a 
              href="#login-box"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-black rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5"
            >
              Log In
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 relative py-12 sm:py-20 space-y-24">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Big Text Block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-slate-900 rounded-full text-xs font-bold text-slate-700 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider">SECURED BY GEMINI 3.5 FLASH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight font-sans">
              The AI Chief <br />
              of Staff for <br />
              <span className="font-serif italic font-normal text-indigo-700 bg-indigo-50/80 px-2 rounded-2xl border border-indigo-200">Your Gmail</span>
            </h1>

            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              We leverage advanced GenAI parsing to summarize mail, auto-extract hidden research or career opportunities, chronologize deliverable deadlines, and answer inbox prompts via a real-time chatbot container.
            </p>

            <div className="flex flex-wrap items-center gap-4.5 pt-3">
              <a 
                href="#login-box"
                className="px-6 py-3.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-900 border-2 border-slate-950 rounded-2xl shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wide"
              >
                Connect Your Inbox 
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={onDemoMode}
                className="px-6 py-3.5 text-xs font-black font-mono text-indigo-950 bg-indigo-50/70 hover:bg-indigo-100 hover:border-slate-950 border-2 border-slate-900 rounded-2xl shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 uppercase"
              >
                <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" />
                Demo Sandbox
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-dashed border-slate-200 text-left">
              <div>
                <dt className="text-xl sm:text-2xl font-black text-slate-950 font-mono">98/100</dt>
                <dd className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Importance Scoring</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-black text-slate-950 font-mono">Instant</dt>
                <dd className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Deadline Timeline</dd>
              </div>
              <div>
                <dt className="text-xl sm:text-2xl font-black text-slate-950 font-mono">24/7</dt>
                <dd className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">AI Companion Discuss</dd>
              </div>
            </div>
          </div>

          {/* LOGIN & BYPASS ACCESS DRAWER PANEL */}
          <div id="login-box" className="lg:col-span-5 scroll-mt-24">
            <div className="bg-white w-full p-8 border-2 border-slate-900 rounded-3xl space-y-5 flex flex-col items-center shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative">
              
              {/* Highlight ribbon */}
              <span className="absolute -top-3.5 left-6 bg-rose-500 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] animate-bounce">
                Developer Sandbox Mode
              </span>

              <div className="space-y-1.5 text-center pt-2">
                <h3 className="font-extrabold text-slate-950 text-xl font-mono uppercase tracking-wider">Connect Your Inbox</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">
                  Sahaya uses secure, read-only Gmail access to index your latest career transactions and milestones.
                </p>
              </div>

              {/* Warn Instructions box */}
              <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 text-xs shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] space-y-2.5 w-full text-slate-800 font-mono">
                <div className="flex items-center gap-1.5 font-black text-indigo-700 text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>Bypass Google Warning Screen</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-normal font-sans font-semibold">
                  Because this application is in active developer sandbox mode, Google shows an <em>"Unverified App"</em> popup. <strong>It is 100% safe to proceed:</strong>
                </p>
                <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-3 text-[10px] text-slate-700 leading-relaxed font-sans">
                  <div>1️⃣ Click <strong className="text-slate-900 font-bold font-mono">"Advanced"</strong> (bottom-left corner of the Google login popup page).</div>
                  <div className="my-1">2️⃣ Click the link that says <strong className="text-indigo-600 underline">"Go to Sahaya (unsafe)"</strong> to proceed.</div>
                  <div>3️⃣ Mark the checkbox permissions and hit <strong className="text-slate-950 font-bold">"Continue"</strong>.</div>
                </div>
              </div>

              {/* Error messages block */}
              {apiError && (
                <div className="w-full">
                  {apiError === 'POPUP_CLOSED_BY_USER' ? (
                    <div className="bg-amber-50 border-2 border-slate-900 rounded-2xl p-4.5 text-left text-xs shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-3 font-mono">
                      <div className="flex items-center gap-2 font-black text-amber-900 text-[11px] uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 animate-bounce" />
                        <span>Google Login Popup Closed</span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed font-sans font-medium">
                        Did you close the login popup because of Google's warning page? This screen is expected for unregistered testing applications. Follow the steps above to proceed.
                      </p>
                      <div className="text-[10px] text-slate-700 space-y-2 pt-3 border-t-2 border-dashed border-slate-200">
                        <div>🛠️ <span className="font-extrabold text-slate-950 uppercase">Step-by-step:</span> Click Google sign in again &rarr; click <strong className="text-slate-950 font-black">"Advanced"</strong> &rarr; click <strong className="text-indigo-700 underline">"Go to Sahaya (unsafe)"</strong>.</div>
                        <div>👉 <span className="font-extrabold text-indigo-700 uppercase">Direct Bypass:</span> Click <span className="font-bold underline">Explore Demo Sandbox</span> below to explore without auth inside this workspace!</div>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 p-3 bg-rose-50 border-2 border-slate-900 rounded-xl text-left text-xs text-rose-800 font-mono shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] w-full">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{apiError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sign in with Google Button */}
              <button 
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button w-full flex items-center justify-center p-0.5 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 hover:shadow-xs transition duration-150 cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                style={{ minHeight: '44px' }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center gap-3 px-4 py-2">
                  <div className="gsi-material-button-icon shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents text-sm font-extrabold text-slate-800">
                    {isLoggingIn ? "Connecting Google..." : "Connect Google Account"}
                  </span>
                </div>
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center w-full">
                <div className="flex-grow border-t-2 border-slate-200"></div>
                <span className="flex-shrink mx-3 text-slate-400 font-mono text-[9px] font-black uppercase tracking-wider">or try risk-free sandbox</span>
                <div className="flex-grow border-t-2 border-slate-200"></div>
              </div>

              {/* Explore Sandbox Bypass */}
              <button
                onClick={onDemoMode}
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 border-2 border-slate-900 hover:border-slate-950 font-mono text-xs font-black rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer transition-all uppercase tracking-wide"
              >
                <Zap className="w-4 h-4 text-indigo-600 animate-pulse animate-bounce" />
                Explore Demo Sandbox
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero database storage of email bodies.</span>
              </div>
            </div>
          </div>

        </div>

        {/* HIGH-FIDELITY INTERACTIVE DASHBOARD PREVIEW */}
        <div className="space-y-8">
          <div className="text-center space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase font-mono tracking-tight">Interactive Feature Preview</h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium max-w-lg mx-auto leading-relaxed">
              Click the tabs below to preview the exact user intelligence panels Sahaya compiles from incoming Gmail transactions.
            </p>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-3xl p-4 sm:p-8 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] max-w-4xl mx-auto">
            
            {/* Showcase Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b-2 border-slate-150 pb-5">
              {previewTabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as PreviewTab)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] -translate-y-0.5' 
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Window Container */}
            <div className="mt-6 bg-slate-50 border-2 border-slate-900 rounded-2xl min-h-[300px] p-4 sm:p-6 text-left relative overflow-hidden font-mono shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              
              {/* Window Controls UI decorator */}
              <div className="absolute top-3.5 right-4 flex items-center gap-1.5 opacity-60">
                <div className="w-2.5 h-2.5 bg-rose-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </div>

              {/* Tab Content: INBOX */}
              {activeTab === 'inbox' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-400">INDEXED PARSES (3)</span>
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-indigo-700 font-mono text-[9px] font-black">ACTIVE DEMO</span>
                  </div>

                  <div className="space-y-3">
                    {/* Simulated Item 1 */}
                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-950 font-mono">Prof. Roberts (Stanford AI Lab)</span>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-full font-mono text-[9px] font-extrabold tracking-wide">IMPORTANCE: 98/100</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 mt-1">Research Fellow Application Acceptance</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                        <strong>AI Summary:</strong> You are invited to join the Stanford Machine Learning Summer cohort starting June 15. Action needed: Submit paperwork of acceptance by June 5, include financial stipend credentials.
                      </p>
                    </div>

                    {/* Simulated Item 2 */}
                    <div className="bg-white border text-slate-700 p-3.5 rounded-xl">
                      <div className="flex items-center justify-between opacity-80">
                        <span className="font-semibold text-slate-800 font-mono">Financial Services Office</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-mono text-[9px] font-extrabold">IMPORTANCE: 85/100</span>
                      </div>
                      <h4 className="font-bold text-slate-800 mt-1">Outstanding Library and Tuition Balances</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        <strong>AI Summary:</strong> Notice regarding pending library fines ($14.50) and tuition deposit details remaining due by June 12. Unpaid dues may withhold graduation credential releases.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: OPPORTUNITIES */}
              {activeTab === 'opportunities' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-400">AUTOMATED OPPORTUNITY DECK</span>
                    <span className="text-emerald-700 font-mono text-[9px] font-black tracking-wider flex items-center gap-1">&bull; REAL-TIME PARSING</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-[9px] font-black uppercase tracking-wider mb-1.5">
                          <Award className="w-3.5 h-3.5" />
                          Fellowship Match
                        </div>
                        <h4 className="font-black text-slate-950 text-xs">AI Research Fellow (Stanford Lab)</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal">Stipend of $4,500 over 8 weeks, with direct machine learning publications access.</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                        <span className="text-indigo-650 font-bold">Priority Recipient</span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded font-bold font-mono">Acceptance</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between opacity-80">
                      <div>
                        <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-wider mb-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Scholarship Lead
                        </div>
                        <h4 className="font-bold text-slate-950 text-xs">Tech Excellence Foundation Grant</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal">Open application for secondary students majoring in engineering fields ($2,000).</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Deadline Pending</span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-250 rounded font-bold text-slate-600 font-mono">Apply</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: DEADLINES */}
              {activeTab === 'deadlines' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-400">CHRONOLOGICAL DEADLINES TIMELINE</span>
                    <span className="text-rose-700 font-mono text-[9px] font-black uppercase tracking-wider">Urgent deliverables</span>
                  </div>

                  <div className="relative border-l-2 border-slate-200 pl-4.5 ml-3.5 space-y-5">
                    {/* Item 1 */}
                    <div className="relative">
                      <div className="absolute -left-[27.5px] top-0 w-4.5 h-4.5 rounded-full border-2 border-slate-900 bg-rose-500 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-[8px] font-black text-white font-mono">1</div>
                      <div className="bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-rose-700 font-mono text-[10px] uppercase">June 5, 2026</span>
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded text-[8px] font-black uppercase">5 Days Left</span>
                        </div>
                        <h4 className="font-extrabold text-slate-950 mt-1 text-[11px]">Submit Acceptance Documents & Research Paperwork</h4>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Assigned from: Prof. Roberts Research Invitation email.</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="relative opacity-80">
                      <div className="absolute -left-[27.5px] top-0 w-4.5 h-4.5 rounded-full border border-slate-350 bg-white flex items-center justify-center text-[8px] font-bold text-slate-500 font-mono">2</div>
                      <div className="bg-white border border-slate-250 p-3 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-500 font-mono text-[10px] uppercase">June 12, 2026</span>
                          <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[8px] text-slate-500 font-medium">12 Days Left</span>
                        </div>
                        <h4 className="font-bold text-slate-800 mt-1 text-[11px]">Clear Financial Deficits & Tuition Balance</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Assigned from: Registrar Financial Outstanding Outstanding Balances email.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: CHAT */}
              {activeTab === 'chat' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono text-[10px] font-black uppercase text-slate-400">SAHAYA DIALOG ASSISTANT</span>
                    <span className="text-indigo-700 font-mono text-[9px] font-black tracking-wider uppercase">&bull; Connected to Gemini 3.5</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="bg-indigo-50 border border-slate-250 p-3 rounded-2xl max-w-[85%] self-end ml-auto text-left leading-relaxed">
                      <p className="font-semibold text-indigo-900 text-[11px]">
                        Draft a polite response to Prof. Roberts. Accept the position and mention that I will submit the paperwork in 3 days.
                      </p>
                    </div>

                    <div className="bg-white border-2 border-slate-900 p-3.5 rounded-2xl max-w-[88%] mr-auto text-left shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                      <span className="font-bold text-indigo-700 text-[9px] font-mono tracking-wide uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        Sahaya Assistant
                      </span>
                      <p className="text-[11px] text-slate-700 leading-normal mt-1.5 font-semibold">
                        Here is a customized draft for Prof. Roberts:
                      </p>
                      <div className="mt-2.5 bg-slate-50 border border-slate-200 p-3 rounded-lg font-mono text-[10px] text-slate-700 select-all cursor-pointer hover:bg-slate-100 transition whitespace-pre-wrap">
{`Subject: Re: Stanford AI Lab - Research Fellowship Acceptance

Dear Professor Roberts,

Thank you very much for this wonderful opportunity. I am absolutely thrilled to accept the Research Fellowship position in the Stanford Machine Learning Summer cohort!

I am currently finalizing my university approval forms and will submit all signed acceptance paperwork to your office in 3 days (by June 2). 

Extremely excited to join the lab,
Yogi Chukka`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* THREE STEP HOW IT WORKS PIPELINE */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase font-mono tracking-tight">How Sahaya Simplifies Your Workspace</h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">Three automated pipelines working concurrently server-side.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-3.5 text-left relative overflow-hidden">
              <span className="absolute top-4 right-4 text-5xl font-black font-mono text-slate-100 select-none">01</span>
              <div className="p-2.5 w-10 h-10 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl relative z-10 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-950 uppercase font-mono">1-Click Google Auth</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                Gain secure, isolated validation using official Firebase credential mapping. We obtain Google access tokens locally with zero storage retention.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-3.5 text-left relative overflow-hidden">
              <span className="absolute top-4 right-4 text-5xl font-black font-mono text-slate-100 select-none">02</span>
              <div className="p-2.5 w-10 h-10 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl relative z-10 flex items-center justify-center">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="text-sm font-black text-slate-950 uppercase font-mono">Gemini Audit Engine</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                Our secure server API proxies incoming emails to the Google Gemini 3.5 Flash model, mapping structural parameters like timeline urgency, fellowships, and tuition tasks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-3.5 text-left relative overflow-hidden">
              <span className="absolute top-4 right-4 text-5xl font-black font-mono text-slate-100 select-none">03</span>
              <div className="p-2.5 w-10 h-10 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl relative z-10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-black text-slate-950 uppercase font-mono">Discussion Command</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                Unlocks the intelligent Inbox Chat Desk. Ask detailed questions, draft responses instantly, and get tailored insights with contextual memory of your mailbox.
              </p>
            </div>
          </div>
        </div>

        {/* SECURITY & VALUE PROPOSITION BANNER */}
        <div className="bg-slate-950 border-2 border-slate-900 rounded-3xl p-8 sm:p-12 text-slate-100 relative overflow-hidden text-left shadow-[5px_5px_0px_0px_rgba(30,41,59,0.5)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-800/10 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono text-zinc-300">
              Your Data, Fully Protected
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none uppercase font-mono">
              Privacy First. Always.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-semibold">
              Unlike alternative aggregators, Sahaya runs completely non-intrusive operations. We do not store, distribute, or compile databases of your raw text emails. All tokens are isolated inside sandbox contexts, and data indices are deleted immediately when you click Disconnect.
            </p>
            <div className="flex flex-wrap items-center gap-4.5 pt-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Secure SSL Keys</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Google API Compliance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Local Transient Sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-950 uppercase font-mono tracking-tight">Frequently Asked Questions</h2>
            <p className="text-zinc-500 text-xs font-medium">Everything you need to know about Sahaya Mail Intelligence.</p>
          </div>

          <div className="space-y-3.5 text-left">
            {faqItems.map((f, i) => {
              const isOpen = activeFAQ === i;
              return (
                <div 
                  key={i} 
                  className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                >
                  <button
                    onClick={() => setActiveFAQ(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-slate-950 font-bold text-xs sm:text-sm font-mono text-left cursor-pointer hover:bg-slate-50 transition"
                  >
                    <span>{f.q}</span>
                    <HelpCircle className={`w-4 h-4 text-indigo-650 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t-2 border-slate-900 py-10 mt-12 relative z-10 text-center font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="max-w-6xl mx-auto px-4 space-y-3">
          <p>© 2026 Sahaya Mail Intelligence. All Rights Reserved.</p>
          <p className="text-[9px]">Crafted in compliance with cloud native sandbox guidelines and secure OAuth structures.</p>
        </div>
      </footer>

    </div>
  );
}
