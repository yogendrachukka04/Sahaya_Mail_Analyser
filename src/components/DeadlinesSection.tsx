import React from 'react';
import { Deadline } from '../types';
import { Calendar, AlertCircle, Sparkles, Mail, CheckCircle, TrendingUp } from 'lucide-react';

interface DeadlinesSectionProps {
  deadlines: Deadline[];
  onSelectEmailId: (emailId: string) => void;
}

export default function DeadlinesSection({ deadlines, onSelectEmailId }: DeadlinesSectionProps) {
  
  // Sort deadlines chronologically (approaching first)
  const sortedDeadlines = [...deadlines].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <div id="deadlines-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left panel: Timeline Card */}
      <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-dashed border-slate-200">
          <div>
            <h3 className="font-extrabold text-slate-950 text-lg">Deadlines Tracker</h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological summary of action milestones parsed from your inbox.</p>
          </div>
          <span className="text-xs self-start sm:self-auto bg-indigo-50 border-2 border-slate-900 text-indigo-700 font-extrabold px-3 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
            {deadlines.length} Due Soon
          </span>
        </div>

        {sortedDeadlines.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl py-12 text-center text-slate-500">
            <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">Congratulations! No close pressing deadlines detected.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-900 pl-6 ml-3.5 space-y-6">
            {sortedDeadlines.map((deadline, idx) => {
              const borderStyles = getUrgencyStyles(deadline.urgency);
              
              return (
                <div key={deadline.id} className="relative group">
                  {/* Point Marker */}
                  <span className={`absolute -left-[35px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-extrabold border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] transition ${
                    deadline.urgency === 'High' 
                      ? 'bg-rose-500 text-white' 
                      : deadline.urgency === 'Medium'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-indigo-400 text-white'
                  }`}>
                    {idx + 1}
                  </span>

                  <div className="bg-slate-50/70 p-4 border-2 border-slate-900 rounded-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-mono font-extrabold text-slate-700 bg-white border-2 border-slate-900 px-2 py-0.5 rounded-lg shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                          {deadline.type}
                        </span>
                        
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${borderStyles}`}>
                          {deadline.urgency} Urgency
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-slate-950 text-sm">{deadline.event}</h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto justify-between sm:justify-start w-full sm:w-auto border-t-2 sm:border-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Milestone Date</div>
                        <div className="text-xs font-extrabold font-mono text-slate-900">{deadline.date}</div>
                      </div>
                      
                      <button
                        onClick={() => onSelectEmailId(deadline.emailId)}
                        className="p-1.5 bg-white hover:bg-slate-50 rounded-xl border-2 border-slate-900 hover:border-indigo-600 transition shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-slate-800"
                        title="See original email content"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right panel: Calendar/Tips sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-950 text-white rounded-3xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Sparkles className="w-4 h-4" />
            <h4 className="text-xs font-bold tracking-wider uppercase font-mono">Chief of Staff Tip</h4>
          </div>
          
          <h3 className="text-base font-extrabold tracking-tight">Time Block Your Opportunities</h3>
          <p className="text-xs text-slate-350 mt-2.5 leading-relaxed">
            Yogi, we have identified <strong className="text-indigo-300 font-extrabold">{deadlines.filter(d=>d.urgency==='High').length} High-priority milestones</strong> approaching soon. We recommend dedicating 90 minutes this evening to resolve balances and schedule technical slots to secure competitive placement.
          </p>

          <div className="mt-5 pt-4 border-t-2 border-slate-800 flex items-center justify-between text-[11px] font-mono text-indigo-350 font-semibold">
            <span>Overall Task Health Code</span>
            <span className="bg-indigo-900/40 border border-indigo-700 px-2 py-0.5 rounded-md text-white font-bold">ALPHA-PRIOR</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-3xl p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-dashed border-slate-200">
             <TrendingUp className="w-4 h-4 text-emerald-600" />
             <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Productivity Action Map</h4>
          </div>
          <ul className="space-y-3 mt-3">
            <li className="flex gap-2.5 items-start text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5 border border-slate-900" />
              <span>Prioritize requests with <strong>Invoices/Balances</strong> immediately.</span>
            </li>
            <li className="flex gap-2.5 items-start text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5 border border-slate-900" />
              <span>Draft a generic recommendation letter request to share with academic teachers.</span>
            </li>
            <li className="flex gap-2.5 items-start text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5 border border-slate-900" />
              <span>Block out 3 mock interviews on your calendar.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
