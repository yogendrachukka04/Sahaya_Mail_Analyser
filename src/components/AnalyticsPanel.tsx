import React from 'react';
import { EmailDetails, Relationship, Trends } from '../types';
import { ShieldAlert, TrendingUp, Users, RefreshCw, BarChart2, CheckCircle } from 'lucide-react';

interface AnalyticsPanelProps {
  emails: EmailDetails[];
  relationships: Relationship[];
  trends: Trends;
  onRefresh: () => void;
  isAnalyzing: boolean;
}

export default function AnalyticsPanel({ emails, relationships, trends, onRefresh, isAnalyzing }: AnalyticsPanelProps) {
  
  // Calculate counts for categories present in the emails array
  const categoryCounts: Record<string, number> = {};
  const sentimentCounts: Record<string, number> = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
    Urgent: 0
  };

  emails.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    if (sentimentCounts[e.sentiment] !== undefined) {
      sentimentCounts[e.sentiment]++;
    } else {
      sentimentCounts[e.sentiment] = 1;
    }
  });

  const categoryEntries = Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]);
  const totalEmails = emails.length || 1;

  // Determine health color styling
  const getHealthColor = (score: number) => {
    if (score >= 85) return { stroke: 'stroke-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 65) return { stroke: 'stroke-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { stroke: 'stroke-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const healthStyle = getHealthColor(trends.healthScore);
  const strokeDashoffset = 339.29 - (339.29 * trends.healthScore) / 100; // SVG circle circumferece is 2 * pi * r (r=54) -> 339.29

  return (
    <div id="analytics-panel" className="space-y-6">
      
      {/* Top section: Health Score and KPI summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Radial Health Score Card */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <h3 className="font-extrabold text-slate-900 text-sm mb-4 self-start font-mono uppercase tracking-wider">Inbox Health Index</h3>
          
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r="54"
                className="stroke-slate-100 fill-transparent"
                strokeWidth="11"
              />
              {/* Foreground circle */}
              <circle
                cx="72"
                cy="72"
                r="54"
                className={`fill-transparent transition-all duration-1000 ${healthStyle.stroke}`}
                strokeWidth="11"
                strokeDasharray="339.29"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono tracking-tight text-slate-950">
                {trends.healthScore}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                Health Level
              </span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-slate-900 text-slate-800 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
            {trends.healthScore >= 85 ? "HABITS: EXCELLENT" : trends.healthScore >= 65 ? "HABITS: STEADY" : "HABITS: ATTN REQUIRED"}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 font-mono uppercase tracking-wider">Category Density</h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal">Volume distribution of automatically categorized emails.</p>
          </div>

          <div className="space-y-4">
            {categoryEntries.slice(0, 4).map(([category, count]) => {
              const pct = Math.round((count / totalEmails) * 100);
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{category}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border-2 border-slate-900 shadow-inner">
                    <div 
                      className="bg-indigo-600 h-full rounded-full border-r border-slate-900" 
                      style={{ width: `${pct}%`, backgroundColor: '#4f46e5' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trends Delta Indicators */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 font-mono uppercase tracking-wider">Weekly Trends</h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal">Algorithmic changes compared to your prior multi-day analysis.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2.5">
              <div className="text-xs">
                <div className="font-extrabold text-slate-800">Career & Academic</div>
                <div className="text-[10px] text-slate-400">High value opportunities</div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                +{trends.careerEmailsPercentChange || 35}%
              </span>
            </div>

            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2.5">
              <div className="text-xs">
                <div className="font-extrabold text-slate-800">Newsletter Noise</div>
                <div className="text-[10px] text-slate-400">Promotions and deals</div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                -{trends.promoEmailsPercentChange || 20}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs">
                <div className="font-extrabold text-slate-800">Unread Backlog</div>
                <div className="text-[10px] text-slate-400">Archived or responded</div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                -{trends.unreadEmailsPercentChange || 45}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Sender Mapping and Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Key Contacts and Relationships (Left 2 Col) */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-slate-950 text-sm font-mono uppercase tracking-wider">Contact & Relationship Mapping</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Top senders grouped by professional relationship patterns.</p>
            </div>
            <Users className="w-5 h-5 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-400 uppercase tracking-widest font-black font-mono text-[10px]">
                  <th className="py-3 px-2">Sender name & address</th>
                  <th className="py-3 px-2">Role label</th>
                  <th className="py-3 px-2 text-center">Relative Freq</th>
                  <th className="py-3 px-2 text-right">Value Score</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {relationships.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No key relationships found yet.
                    </td>
                  </tr>
                ) : (
                  relationships.map((rel, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4.5 px-2">
                        <div className="font-extrabold text-slate-900 leading-normal">{rel.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-medium mt-0.5">{rel.email}</div>
                      </td>
                      <td className="py-4.5 px-2">
                        <span className="inline-block px-2.5 py-1.5 rounded-xl border-2 border-slate-900 bg-white text-slate-700 font-bold font-mono text-[10px] shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                          {rel.relationshipType}
                        </span>
                      </td>
                      <td className="py-4.5 px-2 text-center">
                        <div className="inline-flex items-center justify-center font-mono font-bold bg-slate-50 border-2 border-slate-900 text-slate-700 px-2.5 py-1 rounded-xl shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                          {rel.frequency}/10
                        </div>
                      </td>
                      <td className="py-4.5 px-2 text-right font-black font-mono text-slate-950 text-sm">
                        {rel.importanceScore}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sentiment split right column */}
        <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div>
            <h3 className="font-extrabold text-slate-950 text-sm mb-1.5 font-mono uppercase tracking-wider">Email Sentiment Analysis</h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal">Tone composition of active emails decoded by NLP.</p>
          </div>

          <div className="space-y-4.5">
            {Object.entries(sentimentCounts).map(([sent, count]) => {
              const pct = Math.round((count / totalEmails) * 100);
              let color = 'bg-slate-400';
              let badgeColor = 'bg-zinc-50 border-2 border-slate-900 text-zinc-600';
              
              if (sent === 'Positive') {
                color = 'bg-emerald-500';
                badgeColor = 'bg-emerald-50 border-2 border-slate-900 text-emerald-800';
              } else if (sent === 'Urgent') {
                color = 'bg-rose-500 animate-pulse';
                badgeColor = 'bg-rose-50 border-2 border-slate-900 text-rose-800';
              } else if (sent === 'Negative') {
                color = 'bg-amber-600';
                badgeColor = 'bg-amber-650 border-2 border-slate-900 text-white';
              }
              
              return (
                <div key={sent} className="flex items-center justify-between gap-4">
                  <span className={`inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider font-mono shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] rounded-xl ${badgeColor} shrink-0`}>
                    {sent}
                  </span>
                  
                  <div className="flex-1 max-w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden border-2 border-slate-900 shadow-inner">
                    <div className={`h-full rounded-full border-r border-slate-900 ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  
                  <span className="font-mono text-xs font-bold text-slate-700 shrink-0 w-8 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t-2 border-dashed border-slate-200 pt-5 mt-6 text-center">
            <button
              onClick={onRefresh}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-4 py-3 w-full justify-center border-2 border-slate-900 hover:border-slate-950 font-mono text-xs font-bold rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              Re-Analyze Live Email
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
