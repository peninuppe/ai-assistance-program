import React from 'react';
import { ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { ProgramConfig } from '../types/index.ts';

interface RegistrationInfoProps {
  config: ProgramConfig;
}

export const RegistrationInfo: React.FC<RegistrationInfoProps> = ({ config }) => {
  const details = [
    { label: 'Program', value: config.programName },
    { label: 'Organization', value: config.organization },
    { label: 'Registration Mode', value: 'Online' },
    { label: 'Assessment Mode', value: 'Online' },
    { label: 'Registration Fee', value: `₹${config.registrationFee}` },
    { label: 'Eligibility', value: 'Engineering Students' },
    { label: 'Assessment Submission Period', value: `${config.submissionPeriodDays} Days` },
    { label: 'AI Tools', value: 'Open-source AI models permitted.' },
    { label: 'Registration Deadline', value: config.registrationDeadline },
    { label: 'Assessment Date', value: config.assessmentDate },
  ];

  return (
    <section id="registration-info" className="py-20 md:py-28 bg-slate-50/70 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 08 · Registration Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Your Next Opportunity Begins with One Registration.
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Review program parameters and proceed to the official Google Form application portal.
          </p>
        </div>

        {/* Central Registration Card with 2-column key metrics */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          {/* Subtle ambient light blue blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 pb-10 border-b border-slate-200 text-sm">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between py-2.5 border-b border-slate-100"
              >
                <span className="text-slate-600 font-semibold">{item.label}</span>
                <span className="text-slate-950 font-bold text-right max-w-[60%]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing & CTA Block */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-mono font-bold">
                Standard Student Enrollment
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tabular-nums">
                  ₹{config.registrationFee}
                </span>
                <span className="text-xs text-slate-500 font-medium">All inclusive / One-time fee</span>
              </div>
            </div>

            {/* Official Registration Button */}
            <a
              href={config.officialFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-blue-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center whitespace-nowrap"
            >
              <span>REGISTER NOW – ₹999</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          {/* Trust and Verification Footer Strip */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Direct redirect to official Exposys Data Labs Google Form</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Verified Engineering Assessment Initiative</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
