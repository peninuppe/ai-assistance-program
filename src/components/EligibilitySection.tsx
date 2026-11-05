import React from 'react';
import {
  Code,
  BrainCircuit,
  Server,
  Radio,
  Zap,
  Cog,
  Building2,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

export const EligibilitySection: React.FC = () => {
  const branches = [
    {
      title: 'Computer Science Engineering',
      desc: 'Algorithms, Software Architecture & Cloud Systems',
      icon: Code,
    },
    {
      title: 'Artificial Intelligence & Data Science',
      desc: 'Machine Learning, Neural Networks & Deep Learning',
      icon: BrainCircuit,
    },
    {
      title: 'Information Technology',
      desc: 'Web Technologies, Databases & System Design',
      icon: Server,
    },
    {
      title: 'Electronics & Communication',
      desc: 'Signal Processing, Embedded AI & IoT Solutions',
      icon: Radio,
    },
    {
      title: 'Electrical & Electronics',
      desc: 'Control Systems, Power Electronics & Smart Automation',
      icon: Zap,
    },
    {
      title: 'Mechanical Engineering',
      desc: 'Computational Mechanics, CAD/CAM & Robotics',
      icon: Cog,
    },
    {
      title: 'Civil Engineering',
      desc: 'Geospatial Data, Structural Simulation & Smart Infrastructure',
      icon: Building2,
    },
    {
      title: 'Cybersecurity',
      desc: 'Network Defense, Cryptography & Threat Detection',
      icon: ShieldAlert,
    },
    {
      title: 'Other Engineering Disciplines',
      desc: 'Chemical, Biotech, Aerospace, Industrial & allied branches',
      icon: GraduationCap,
    },
  ];

  return (
    <section id="eligibility" className="py-20 md:py-28 bg-slate-50/70 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 06 · Eligibility Criteria
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Who Can Participate?
          </h2>
          <div className="mt-3 text-slate-600 text-base md:text-lg">
            <p>
              Students from any engineering branch are welcome to register. Whether you are in your
              1st, 2nd, 3rd, or final year of B.E / B.Tech or related degrees, this assessment meets
              you where you are.
            </p>
          </div>
        </div>

        {/* 9 Disciplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-xl bg-white border border-slate-200 p-5 hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-100 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inclusivity banner */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Open to undergraduate & postgraduate engineering students across India.</span>
          </div>
          <div className="text-slate-500 font-mono">
            Degree: B.E, B.Tech, M.E, M.Tech, Dual Degree
          </div>
        </div>
      </div>
    </section>
  );
};
