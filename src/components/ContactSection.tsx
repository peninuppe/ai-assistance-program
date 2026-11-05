import React from 'react';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowUpRight,
  ExternalLink,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 bg-white text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-blue-700 font-bold mb-2">
            Section 11 · Contact Information
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight [text-wrap:balance]">
            Have Questions? We Are Here to Help.
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Connect with our program admissions and support team for any queries regarding the AI
            Assistant Assessment Program 2026.
          </p>
        </div>

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Email */}
          <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-slate-500 font-semibold mb-1">Official Email</div>
              <div className="text-base font-bold text-slate-900 break-all">
                hr@exposysdata.com
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Response within 24-48 business hours
              </div>
            </div>
            <a
              href="mailto:hr@exposysdata.com"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>Send Email</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-slate-500 font-semibold mb-1">Direct Helpline</div>
              <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                +91 77952 07065
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Mon - Sat · 10:00 AM - 6:00 PM IST
              </div>
            </div>
            <a
              href="tel:+917795207065"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>Call Admissions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Website */}
          <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-slate-500 font-semibold mb-1">Official Portal</div>
              <div className="text-base font-bold text-slate-900">
                exposysdata.in
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Discover internship & tech training programs
              </div>
            </div>
            <a
              href="https://exposysdata.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Location */}
          <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-6 flex flex-col justify-between hover:border-blue-400 hover:bg-white hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-slate-500 font-semibold mb-1">Corporate Office</div>
              <div className="text-sm font-bold text-slate-900 leading-snug">
                Yelahanka, Bengaluru
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Karnataka, India
              </div>
            </div>
            <div className="mt-6 text-xs text-slate-500 font-medium">
              Technology & Research Hub
            </div>
          </div>
        </div>

        {/* Action Buttons & Verified Social Profiles */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href="mailto:hr@exposysdata.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support Team</span>
            </a>
            <a
              href="https://exposysdata.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-xs"
            >
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Visit exposysdata.in</span>
            </a>
          </div>

          {/* Official Social Media Links */}
          <div className="flex items-center gap-3 text-slate-600">
            <span className="text-xs font-mono font-bold text-slate-600">Follow Exposys:</span>
            <a
              href="https://www.linkedin.com/company/exposys-data-labs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-lg bg-white border border-slate-200 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-colors shadow-xs"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/exposysdatalabs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-lg bg-white border border-slate-200 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-colors shadow-xs"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@exposysdatalabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-lg bg-white border border-slate-200 hover:text-white hover:bg-red-600 hover:border-red-600 transition-colors shadow-xs"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/ExposysDataLabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="p-2 rounded-lg bg-white border border-slate-200 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-colors shadow-xs"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
