import React, { useState } from 'react';
import { Opportunity } from '../types';
import { Award, Briefcase, GraduationCap, Code, Trophy, HelpCircle, AlignLeft, Calendar, Mail, Search } from 'lucide-react';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
  onSelectEmailId: (emailId: string) => void;
}

export default function OpportunitiesSection({ opportunities, onSelectEmailId }: OpportunitiesSectionProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const types = ['All', 'Internship', 'Scholarship', 'Job', 'Hackathon', 'Competition', 'Other'];

  const getIcon = (type: string) => {
    switch (type) {
      case 'Internship':
        return Briefcase;
      case 'Scholarship':
        return GraduationCap;
      case 'Hackathon':
        return Code;
      case 'Competition':
        return Trophy;
      default:
        return Award;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'Internship':
        return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'Scholarship':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'Hackathon':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/50';
      case 'Competition':
        return 'bg-amber-50 text-amber-700 border-amber-200/50';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200/50';
    }
  };

  // Filtering list
  const filtered = opportunities.filter(op => {
    const matchesFilter = filterType === 'All' || op.type === filterType;
    const matchesSearch = op.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          op.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          op.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="opportunities-section" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border-2 border-slate-900 rounded-3xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex flex-wrap gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-900 whitespace-nowrap transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-900 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No opportunities detected</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try resetting your filters or check back later once more emails are processed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((op) => {
            const Icon = getIcon(op.type);
            const classes = getColor(op.type);
            
            return (
              <div
                key={op.id}
                className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${classes}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {op.type}
                    </span>
                    
                    {op.deadline && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-extrabold bg-rose-50 border-2 border-slate-900 px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)]">
                        <Calendar className="w-3 h-3" />
                        Due: {op.deadline}
                      </div>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-950 text-base tracking-tight leading-snug">
                    {op.title}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-wider font-mono">
                    Offered by: {op.entity}
                  </p>
                  
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900 shadow-inner">
                    {op.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-end">
                  <button
                    onClick={() => onSelectEmailId(op.emailId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-slate-900 hover:border-slate-950 text-xs font-bold rounded-xl text-slate-800 bg-slate-100 hover:bg-slate-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[3.5px_3.5px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Open Source Email
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
