import React from 'react';
import {
  Award,
  FileSpreadsheet,
  PieChart,
  MapPin,
  BookOpen,
  Video,
  FileCode,
  Rocket,
  Check,
} from 'lucide-react';

interface BenefitsSectionProps {
  benefitsConfirmed?: boolean;
}

export const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefitsConfirmed = true,
}) => {
  const benefits = [
    {
      num: '01',
      title: 'AI Assessment Certificate',
      desc: 'Official credential verifying your participation and evaluated score by Exposys Data Labs.',
      icon: Award,
    },
    {
      num: '02',
      title: 'Personal AI Performance Report',
      desc: 'Detailed scorecard analyzing quantitative metrics, response quality, and problem efficiency.',
      icon: FileSpreadsheet,
    },
    {
      num: '03',
      title: 'Strengths and Weaknesses Analysis',
      desc: 'Granular diagnosis highlighting competencies you master and key topics needing improvement.',
      icon: PieChart,
    },
    {
      num: '04',
      title: 'Personalized AI Career Roadmap',
      desc: 'Structured recommendations outlining engineering domains matching your tested aptitude.',
      icon: MapPin,
    },
    {
      num: '05',
      title: 'Learning Recommendations',
      desc: 'Curated technical modules, reading lists, and tutorials aligned with your identified areas.',
      icon: BookOpen,
    },
    {
      num: '06',
      title: 'AI Masterclass Access',
      desc: 'Exclusive virtual technical masterclasses delivered by industry data science practitioners.',
      icon: Video,
    },
    {
      num: '07',
      title: 'Python & AI Learning Resources',
      desc: 'Direct repository of high-impact code notebooks, cheat sheets, and practical reference guides.',
      icon: FileCode,
    },
    {
      num: '08',
      title: 'Practical AI Project Exposure',
      desc: 'Real-world problem statement exposure simulating production engineering workflows.',
      icon: Rocket,
    },
  ];

  return (
    <section id="benefits" className="py-20 md:py-28 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 07 · Participant Benefits
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Tangible Outcomes for Every Participant
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Every enrolled student receives comprehensive deliverables designed to boost their resume,
            technical depth, and placement preparedness.
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>
              {benefitsConfirmed
                ? 'Official EDL Program Deliverables · Verified by Organization'
                : 'Subject to official organizational confirmation upon final assessment schedule'}
            </span>
          </div>
        </div>

        {/* 8 Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-blue-700">
                      Benefit {b.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-100 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-800 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed Deliverable</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
