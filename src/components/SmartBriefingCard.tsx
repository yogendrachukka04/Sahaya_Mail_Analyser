import React from 'react';
import { SmartBriefing } from '../types';
import { Sparkles, Calendar, Award, Reply, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface SmartBriefingCardProps {
  briefing: SmartBriefing;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSimulation: boolean;
}

export default function SmartBriefingCard({ briefing, activeTab, setActiveTab, isSimulation }: SmartBriefingCardProps) {
  const stats = [
    {
      id: 'critical',
      label: 'Critical Mail',
      count: briefing.criticalCount,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      tab: 'inbox'
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      count: briefing.opportunityCount,
      icon: Award,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      tab: 'opportunities'
    },
    {
      id: 'deadlines',
      label: 'Upcoming Deadlines',
      count: briefing.deadlineCount,
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      tab: 'deadlines'
    },
    {
      id: 'replies',
      label: 'Unresolved Actions',
      count: briefing.pendingRepliesCount,
      icon: Reply,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      tab: 'inbox'
    }
  ];

  return (
    <div id="smart-briefing" className="bento-card mb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border-2 border-slate-900 mb-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            AI Daily Briefing
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 font-serif italic">
            Good day, Yogi
          </h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base leading-relaxed">
            {briefing.summary}
          </p>
        </div>
        
        {isSimulationMode(isSimulation)}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.button
              key={stat.id}
              onClick={() => setActiveTab(stat.tab)}
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col text-left p-4 rounded-2xl border-2 border-slate-900 bg-white transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`p-1.5 rounded-xl border-2 border-slate-900 ${stat.color} shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-3xl font-bold font-mono text-slate-900 tracking-tight mt-3">
                {stat.count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Added beautiful Quick redirection CTA to Sahaya AI Chat Desk */}
      <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
        <div className="bg-indigo-50/70 border-2 border-slate-900 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide font-mono">Discuss Inbox with Sahaya AI</h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal max-w-xl">
                Got questions about internship deadlines, tuition balances, or reference requests? Open the Chat Desk inside this workspace to interrogate your parsed mailbox instantly.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4.5 py-2.5 text-xs bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl border-2 border-slate-900 hover:border-slate-950 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            💬 Open Chat Desk
          </button>
        </div>
      </div>

    </div>
  );
}

function isSimulationMode(sim: boolean) {
  if (!sim) return null;
  return (
    <div className="shrink-0 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/50">
      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
      Simulation Enabled
    </div>
  );
}
