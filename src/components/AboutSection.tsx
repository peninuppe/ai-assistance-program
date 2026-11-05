import React from 'react';
import {
  Code2,
  Bot,
  Activity,
  Compass,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const cards = [
    {
      icon: Code2,
      title: 'Technical Knowledge Evaluation',
      description:
        'Rigorous assessment of core engineering concepts, algorithmic thinking, software foundations, and analytical reasoning.',
    },
    {
      icon: Bot,
      title: 'AI Tool Exploration',
      description:
        'Hands-on problem statement testing practical ability to utilize modern open-source AI models and frameworks productively.',
    },
    {
      icon: Activity,
      title: 'Strengths and Weaknesses Analysis',
      description:
        'Comprehensive breakdown across technical proficiencies, identifying exactly where your capabilities shine and where to focus next.',
    },
    {
      icon: Compass,
      title: 'Personalized Learning Recommendations',
      description:
        'Tailored curated roadmaps, learning resources, and recommended technical modules based on your individual assessment score.',
    },
    {
      icon: Briefcase,
      title: 'Career Development Guidance',
      description:
        'Actionable pathways to prepare for modern AI and engineering roles with industry-grounded expectations and skill profiles.',
    },
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 03 · About The Program
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            A Smarter Way to Understand Your Technical Potential.
          </h2>
          <div className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed space-y-3">
            <p>
              The Exposys Data Labs AI Assistant Assessment Program 2026 is designed to help
              engineering students evaluate their technical knowledge, analytical abilities,
              problem-solving skills, and understanding of Artificial Intelligence tools.
            </p>
            <p className="text-slate-500 text-sm md:text-base">
              Through a structured assessment process, participants can identify their strengths,
              recognize improvement areas, and receive personalized learning and career guidance.
            </p>
          </div>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`relative rounded-2xl bg-slate-50/80 border border-slate-200/90 p-7 hover:border-blue-400 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 group-hover:scale-105 group-hover:bg-blue-100/60 transition-all mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-xs font-mono text-blue-700/80 font-bold mb-1">
                    Evaluation Pillar 0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-800 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="text-slate-600">Included in Program</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
