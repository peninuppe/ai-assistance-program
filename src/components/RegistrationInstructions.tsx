import React from 'react';
import { AlertCircle } from 'lucide-react';

export const RegistrationInstructions: React.FC = () => {
  const steps = [
    { num: '1', text: 'Click the Register Now button on this page to open the official Google Form.' },
    { num: '2', text: 'Complete all required personal, college, degree, and branch fields accurately.' },
    { num: '3', text: 'Verify your contact details (ensure your active email and mobile number are entered correctly).' },
    { num: '4', text: 'Follow the officially communicated payment instructions for the ₹999 fee.' },
    { num: '5', text: 'Submit your registration form before the announced closing deadline.' },
    { num: '6', text: 'Wait for further communication and problem statement release from Exposys Data Labs.' },
  ];

  return (
    <section id="instructions" className="py-20 md:py-28 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 09 · Registration Instructions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Step-by-Step Registration Guide
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Follow these six clear steps to ensure your application is properly received and recorded.
          </p>
        </div>

        {/* 6 Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((s) => (
            <div
              key={s.num}
              className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex items-start gap-4 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {s.num}
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Step 0{s.num}
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Verification Notice Callout */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-amber-50/80 border border-amber-200 p-6 flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide">
              Official Verification Notice
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              Registration is considered subject to the organization’s verification and confirmation
              process. Submitting the Google Form records your academic entry; payment status and
              official enrollment are confirmed only after administrative receipt reconciliation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
