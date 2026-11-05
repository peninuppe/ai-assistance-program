import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-white text-base shadow-sm">
                EDL
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                EXPOSYS DATA LABS
              </span>
            </div>
            <p className="text-base font-bold text-blue-400">
              Learn. Build. Grow.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering students through technology, innovation and industry-focused learning.
              Bridging academia and modern technology through structured assessments and practical
              guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Quick Links
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#highlights" className="hover:text-blue-400 transition-colors">Highlights</a>
              <a href="#process" className="hover:text-blue-400 transition-colors">Assessment Process</a>
              <a href="#eligibility" className="hover:text-blue-400 transition-colors">Eligibility</a>
              <a href="#benefits" className="hover:text-blue-400 transition-colors">Benefits</a>
              <a href="#faq" className="hover:text-blue-400 transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Official Communication
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div>
                Email:{' '}
                <a href="mailto:hr@exposysdata.com" className="text-blue-400 hover:underline">
                  hr@exposysdata.com
                </a>
              </div>
              <div>
                Website:{' '}
                <a
                  href="https://exposysdata.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  https://exposysdata.in
                </a>
              </div>
              <div className="text-slate-400 pt-1">
                Yelahanka, Bengaluru, Karnataka, India
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
              >
                <span>Administrative Access Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Exposys Data Labs. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>AI Assistant Assessment Program 2026</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
