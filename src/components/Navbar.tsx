import React, { useState } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  officialFormUrl: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  officialFormUrl,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Highlights', href: '#highlights' },
    { label: 'Process', href: '#process' },
    { label: 'Eligibility', href: '#eligibility' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-3 group text-slate-900 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
              EDL
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                EXPOSYS DATA LABS
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                AI Assessment 2026
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-blue-700 after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                isAdminLoggedIn
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'text-slate-700 border-slate-300 hover:text-blue-700 hover:border-blue-400 bg-slate-50/80 hover:bg-white'
              }`}
              title="Organization Administration Portal"
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{isAdminLoggedIn ? 'Admin Console' : 'Admin Login'}</span>
            </button>

            <a
              href={officialFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md shadow-blue-700/20 hover:shadow-blue-700/35 hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <span>Register Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 bg-slate-50"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="px-3 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{isAdminLoggedIn ? 'Open Admin Console' : 'Administrator Portal'}</span>
            </button>

            <a
              href={officialFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-md"
            >
              <span>Register Now — ₹999</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
