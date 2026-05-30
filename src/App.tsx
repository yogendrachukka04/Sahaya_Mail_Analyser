import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { AnalysisResults } from './types';
import { 
  Sparkles, Mail, Award, Calendar, BarChart2, 
  MessageSquare, FileText, Compass, ExternalLink, 
  Check, LogOut, Users, RefreshCw, AlertCircle, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

// Subcomponents
import SmartBriefingCard from './components/SmartBriefingCard';
import EmailListPanel from './components/EmailListPanel';
import OpportunitiesSection from './components/OpportunitiesSection';
import DeadlinesSection from './components/DeadlinesSection';
import AnalyticsPanel from './components/AnalyticsPanel';
import EmailChatAssistant from './components/EmailChatAssistant';
import WeeklyReportPanel from './components/WeeklyReportPanel';
import LandingPage from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Dashboard indicators
  const [activeTab, setActiveTab] = useState('inbox');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedResults, setAnalyzedResults] = useState<AnalysisResults | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Navigation drill-down state (letting deadlines/opps jump back to inbox selected item)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [initialChatQuery, setInitialChatQuery] = useState<string | null>(null);

  // Initialize Firebase Auth listener on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
        // Automatically start fetching & analyzing inbox
        fetchAndAnalyzeInbox(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // API Call: Fetch Gmail and digest through Gemini 3.5 Flash securely
  const fetchAndAnalyzeInbox = async (accessToken: string, force: boolean = false) => {
    setIsAnalyzing(true);
    setApiError(null);
    try {
      const res = await fetch('/api/emails/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, forceRefresh: force })
      });
      
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      
      const data = await res.json();
      setAnalyzedResults(data);
    } catch (err: any) {
      console.error("Error analyzing workspace inbox:", err);
      setApiError("Authentication session expired or Gemini server index busy. Please reconnect or click 'Retry Live Connection'.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Login handler
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setApiError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
        await fetchAndAnalyzeInbox(result.accessToken);
      }
    } catch (err: any) {
      console.error("Google Signin failure:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("popup-closed-by-user") || errMsg.includes("popup_closed_by_user")) {
        setApiError("POPUP_CLOSED_BY_USER");
      } else {
        setApiError(err?.message || "Sign in cancelled or rejected. Access domain must match registered GCP OAuth Web Credentials.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Demo Sandbox handler
  const handleDemoMode = async () => {
    setIsAnalyzing(true);
    setApiError(null);
    try {
      // Mock user object matching Firebase User type safely
      const mockDemoUser = {
        uid: 'demo-u1',
        displayName: 'Yogi (Demo Sandbox)',
        email: 'yogi.workspace.demo@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
        emailVerified: true
      } as any;
      
      setUser(mockDemoUser);
      setToken('demo-sandbox-token');
      setNeedsAuth(false);
      // Brief simulated loading delay for visual satisfaction
      await new Promise(resolve => setTimeout(resolve, 800));
      await fetchAndAnalyzeInbox('demo-sandbox-token');
    } catch (err) {
      console.error("Demo Mode error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
    setAnalyzedResults(null);
    setSelectedEmailId(null);
  };

  // Drill down jumper
  const handleJumpToEmail = (emailId: string) => {
    setSelectedEmailId(emailId);
    setActiveTab('inbox');
  };

  // Jump to Chat helper with contextual email summary
  const handleStartEmailChat = (emailSubject: string, emailSender: string, emailSummary: string) => {
    const formattedPrompt = `I want to ask a question about the email from ${emailSender} with the subject "${emailSubject}".

The AI Summary of this email is: "${emailSummary}".

Please provide key insights or draft responses regarding this email, or tell me anything important I should look out for.`;
    setInitialChatQuery(formattedPrompt);
    setActiveTab('chat');
  };

  // Landing Page view if unauthenticated
  if (needsAuth) {
    return (
      <LandingPage 
        onLogin={handleLogin}
        onDemoMode={handleDemoMode}
        isLoggingIn={isLoggingIn}
        apiError={apiError}
      />
    );
  }

  // Loader screen while server-side Gemini 3.5 analyzes
  if (isAnalyzing && !analyzedResults) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md space-y-6">
          <div className="relative flex items-center justify-center w-16 h-16 mx-auto bg-white rounded-2xl border border-zinc-200/80 shadow-md">
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 absolute top-2 right-2 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-zinc-950 font-black text-lg tracking-tight">AI Chief of Staff is Indexing Your Mail...</h2>
            <div className="text-zinc-500 text-xs leading-relaxed max-w-sm mx-auto space-y-1">
              <p>Fetching active messages directly from Gmail via secure OAuth endpoint...</p>
              <p className="text-[10px] text-indigo-650 font-bold font-mono">Running sentiment audits, extracting deadlines, and detecting internships with Gemini 3.5 Flash.</p>
            </div>
          </div>

          {/* Friendly informative message loop */}
          <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-indigo-800 font-semibold leading-relaxed max-w-xs mx-auto">
             Note: This high-fidelity parse occurs incrementally. Initial load may take up to 10 seconds of analysis processing.
          </div>
        </div>
      </div>
    );
  }

  // Active Authenticated and Loaded Dashboard Display
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-12 select-text">
      
      {/* Top sticky Brand bar */}
      <header className="bg-white border-b-2 border-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-950 text-base leading-none tracking-tight">Sahaya</h1>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-1 block">Mail Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 bg-white border-2 border-slate-900 p-1.5 pr-3.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Yogi Avatar" className="w-8 h-8 rounded-full border-2 border-slate-900 shadow-2xs animate-fade-in" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 bg-slate-800 text-white font-extrabold rounded-full flex items-center justify-center text-xs border-2 border-slate-900">Y</div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.displayName || "Yogi"}</div>
                  <div className="text-[10px] text-slate-400 font-mono leading-none">{user.email}</div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl border-2 border-slate-900 hover:border-rose-600 text-slate-500 transition shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              title="Disconnect OAuth Inbox"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Render intelligent dynamic daily briefing card at the top level */}
        {analyzedResults && (
          <SmartBriefingCard 
            briefing={analyzedResults.briefing} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isSimulation={analyzedResults.isSimulation || false}
          />
        )}

        {/* Display inline API retry bar if connection is lost */}
        {apiError && (
          <div className="bg-rose-50 border-2 border-slate-900 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-start gap-2.5 text-xs text-rose-800 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => token && fetchAndAnalyzeInbox(token, true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-slate-900 hover:bg-rose-100 text-xs font-bold rounded-xl text-rose-700 bg-white transition shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Live Connection
            </button>
          </div>
        )}

        {/* Dashboard Tabs Routing Hub */}
        <div className="space-y-6">
          <div className="flex border-b-2 border-slate-900 select-none overflow-x-auto no-scrollbar gap-1.5 pb-0 flex-nowrap">
            {[
              { id: 'inbox', label: 'Priority Inbox', icon: Mail },
              { id: 'opportunities', label: 'Opportunities Tracker', icon: Award },
              { id: 'deadlines', label: 'Timeline Deadlines', icon: Calendar },
              { id: 'analytics', label: 'Trends & Analytics', icon: BarChart2 },
              { id: 'chat', label: 'Sahaya Chat Desk', icon: MessageSquare },
              { id: 'weekly-report', label: 'Chief of Staff Report', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 relative border-b-2 font-black text-xs shrink-0 cursor-pointer transition-all -mb-[2px] ${
                    isActive 
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10' 
                      : 'border-transparent text-slate-500 hover:text-slate-950'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel routing */}
          <div className="min-h-[400px]">
            {analyzedResults ? (
              <>
                {activeTab === 'inbox' && (
                  <EmailListPanel 
                    emails={analyzedResults.emails} 
                    accessToken={token || ''}
                    isAnalyzing={isAnalyzing}
                    selectedEmailId={selectedEmailId}
                    onSelectEmailId={setSelectedEmailId}
                    onStartEmailChat={handleStartEmailChat}
                  />
                )}
                
                {activeTab === 'opportunities' && (
                  <OpportunitiesSection 
                    opportunities={analyzedResults.opportunities} 
                    onSelectEmailId={handleJumpToEmail}
                  />
                )}

                {activeTab === 'deadlines' && (
                  <DeadlinesSection 
                    deadlines={analyzedResults.deadlines} 
                    onSelectEmailId={handleJumpToEmail}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsPanel 
                    emails={analyzedResults.emails}
                    relationships={analyzedResults.relationships}
                    trends={analyzedResults.trends}
                    onRefresh={() => token && fetchAndAnalyzeInbox(token, true)}
                    isAnalyzing={isAnalyzing}
                  />
                )}

                {activeTab === 'chat' && (
                  <EmailChatAssistant 
                    analyzedContext={analyzedResults}
                    isAnalyzing={isAnalyzing}
                    initialQuery={initialChatQuery}
                    onClearInitialQuery={() => setInitialChatQuery(null)}
                  />
                )}

                {activeTab === 'weekly-report' && (
                  <WeeklyReportPanel 
                    markdownReport={analyzedResults.weeklyReport}
                  />
                )}
              </>
            ) : (
              <div className="bg-white border text-center p-12 rounded-xl">
                <RefreshCw className="w-10 h-10 text-zinc-300 mx-auto mb-3 animate-spin" />
                <h3 className="text-zinc-800 text-sm font-semibold">Aligning workspace components...</h3>
              </div>
            )}
          </div>

        </div>

      </main>

    </div>
  );
}
