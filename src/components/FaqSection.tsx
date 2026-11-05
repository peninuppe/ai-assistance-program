import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Who can participate?',
      a: 'Students from any engineering branch can participate. Whether you are enrolled in Computer Science, AI & DS, Information Technology, ECE, EEE, Mechanical, Civil, Cybersecurity, or any other engineering discipline across undergraduate or postgraduate levels, you are eligible.',
    },
    {
      q: 'What is the registration fee?',
      a: 'The registration fee is ₹999. This covers the evaluation process, performance analysis report, AI learning resources, masterclass access, and verified certificate upon submission.',
    },
    {
      q: 'How do I register?',
      a: 'Click the Register Now button on this website and complete the official Google Form with accurate personal and academic credentials.',
    },
    {
      q: 'When will I receive the assessment problem statement?',
      a: 'Registered participants will receive the problem statement after the registration closing date via their registered email address.',
    },
    {
      q: 'How much time will I receive to complete the assessment?',
      a: 'Participants will receive seven days to complete and submit the assessment solutions.',
    },
    {
      q: 'Can I use AI tools?',
      a: 'Yes. Participants are permitted to use open-source AI models while completing the assessment to explore, build, and optimize their technical solutions.',
    },
    {
      q: 'How will I receive program updates?',
      a: 'Updates will be communicated directly through the contact information (email address and phone number) provided during registration.',
    },
    {
      q: 'Whom should I contact for queries?',
      a: 'For any inquiries or clarifications, reach out to our team at hr@exposysdata.com or call +91 77952 07065.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-50/70 text-slate-900 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 10 · Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Find immediate answers regarding eligibility, deadlines, AI tools, and process guidelines.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all duration-200 shadow-xs hover:border-blue-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-700 bg-blue-50' : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
