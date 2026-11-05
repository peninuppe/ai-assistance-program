import React from 'react';
import { Brain, BarChart3, GraduationCap, Target, Terminal } from 'lucide-react';

export const HighlightsSection: React.FC = () => {
  const highlights = [
    {
      num: '01',
      title: 'AI-Based Assessment',
      description:
        'Evaluate technical knowledge and problem-solving capabilities using an AI-supported assessment approach.',
      icon: Brain,
      tag: 'Core Methodology',
    },
    {
      num: '02',
      title: 'Technical Skill Analysis',
      description:
        'Understand existing technical capabilities and identify improvement areas with actionable precision.',
      icon: BarChart3,
      tag: 'Capability Diagnostic',
    },
    {
      num: '03',
      title: 'Personalized Learning Recommendations',
      description:
        'Receive recommendations to improve technical knowledge and practical skills tailored to your submission.',
      icon: GraduationCap,
      tag: 'Tailored Growth',
    },
    {
      num: '04',
      title: 'Career Guidance',
      description:
        'Understand potential career directions and identify suitable next steps in modern tech domains.',
      icon: Target,
      tag: 'Industry Alignment',
    },
    {
      num: '05',
      title: 'AI Tool Exploration',
      description:
        'Explore how Artificial Intelligence tools can support technical problem-solving and rapid engineering prototyping.',
      icon: Terminal,
      tag: 'Practical Application',
    },
  ];

  return (
    <section id="highlights" className="py-20 md:py-28 bg-slate-50/70 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 04 · Program Highlights
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Key Highlights of the 2026 Assessment
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Built from the ground up for engineering students seeking an authentic benchmark of their
            technical capabilities and AI readiness.
          </p>
        </div>

        {/* 5 Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`relative rounded-2xl bg-white border border-slate-200 p-7 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-300' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-mono font-extrabold text-slate-200 group-hover:text-blue-200 transition-colors">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="text-xs font-mono text-blue-700 font-bold mb-2">
                    {item.tag}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  <span>Program Standard 2026</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
