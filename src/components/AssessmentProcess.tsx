import React from 'react';
import {
  FileText,
  CreditCard,
  FileCode2,
  Calendar,
  Send,
  Sparkles,
} from 'lucide-react';

export const AssessmentProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'ONLINE REGISTRATION',
      description:
        'Complete the registration form with accurate personal and academic information.',
      icon: FileText,
    },
    {
      step: '02',
      title: 'REGISTRATION FEE',
      description:
        'Pay the registration fee of ₹999 through the officially communicated payment process.',
      icon: CreditCard,
    },
    {
      step: '03',
      title: 'PROBLEM STATEMENT',
      description:
        'After the registration closing date, registered participants will receive the assessment problem statement.',
      icon: FileCode2,
    },
    {
      step: '04',
      title: 'SEVEN-DAY ASSESSMENT',
      description:
        'Participants will have seven days to complete and submit the assessment.',
      icon: Calendar,
    },
    {
      step: '05',
      title: 'SUBMISSION',
      description:
        'Complete the assessment and submit the solution within the specified deadline.',
      icon: Send,
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 05 · Assessment Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Your Journey from Registration to Assessment.
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            A clear, structured, five-stage pathway designed to test your real-world technical
            abilities.
          </p>
        </div>

        {/* Timeline: Desktop Horizontal / Mobile Vertical */}
        <div className="relative mb-14">
          {/* Desktop Connecting Line */}
          <div
            className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-8 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 relative group"
                >
                  <div>
                    {/* Step Number & Icon badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-sm flex items-center justify-center">
                        {item.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-blue-700 transition-colors shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold mb-1">
                      Step {item.step}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 font-medium">
                    Phase {index + 1} of 5
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlighted Information Box (Mandatory Requirement) */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border border-blue-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-700/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800">
                  Official Assessment Guideline
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-600 font-semibold">Open-Source AI Policy</span>
              </div>
              <h4 className="text-lg font-bold text-slate-950">
                Participants are permitted to use open-source AI models while completing the assessment.
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                You are encouraged to leverage modern open-source AI models (such as LLaMA, Mistral,
                Qwen, or Hugging Face toolkits) to explore solutions, code prototypes, and optimize
                engineering architectures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
