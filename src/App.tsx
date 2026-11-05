import React, { useState, useEffect } from 'react';
import type { ProgramConfig, AdminUser } from './types/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { HighlightsSection } from './components/HighlightsSection.tsx';
import { AssessmentProcess } from './components/AssessmentProcess.tsx';
import { EligibilitySection } from './components/EligibilitySection.tsx';
import { BenefitsSection } from './components/BenefitsSection.tsx';
import { RegistrationInfo } from './components/RegistrationInfo.tsx';
import { RegistrationInstructions } from './components/RegistrationInstructions.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';

const DEFAULT_CONFIG: ProgramConfig = {
  programName: 'AI Assistant Assessment Program 2026',
  organization: 'Exposys Data Labs',
  registrationFee: 999,
  currency: 'INR',
  registrationDeadline: 'To Be Announced',
  assessmentDate: 'To Be Announced',
  submissionPeriodDays: 7,
  contactEmail: 'hr@exposysdata.com',
  contactPhone: '+91 77952 07065',
  officialFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeXFt56qVMU6_fgjJ9dEFvDcAmuNeFnn02LbgmkwP3o16d4TA/viewform?usp=publish-editor',
  benefitsConfirmed: true,
};

export default function App() {
  const [config, setConfig] = useState<ProgramConfig>(DEFAULT_CONFIG);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Check saved admin session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('edl_admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setAdminUser(data.user);
          } else {
            localStorage.removeItem('edl_admin_token');
            setAdminToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {
          // Keep offline session if server is launching
        });
    }

    // Fetch public program config
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.programName) {
          setConfig(data);
        }
      })
      .catch((err) => {
        console.warn('Using default program config:', err);
      });
  }, []);

  const handleOpenAdmin = () => {
    if (adminToken && adminUser) {
      setShowDashboard(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    setShowLoginModal(false);
    setShowDashboard(true);
  };

  const handleLogout = () => {
    if (adminToken) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('edl_admin_token');
    setAdminToken(null);
    setAdminUser(null);
    setShowDashboard(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-700 selection:text-white">
      {/* SECTION 1: Sticky Navigation Bar */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!(adminToken && adminUser)}
        officialFormUrl={config.officialFormUrl}
      />

      <main className="flex-1">
        {/* SECTION 2: Hero Section */}
        <Hero officialFormUrl={config.officialFormUrl} />

        {/* SECTION 3: About The Program */}
        <AboutSection />

        {/* SECTION 4: Program Highlights */}
        <HighlightsSection />

        {/* SECTION 5: Assessment Process */}
        <AssessmentProcess />

        {/* SECTION 6: Eligibility Criteria */}
        <EligibilitySection />

        {/* SECTION 7: Participant Benefits */}
        <BenefitsSection benefitsConfirmed={config.benefitsConfirmed} />

        {/* SECTION 8: Registration Information */}
        <RegistrationInfo config={config} />

        {/* SECTION 9: Registration Instructions */}
        <RegistrationInstructions />

        {/* SECTION 10: Frequently Asked Questions */}
        <FaqSection />

        {/* SECTION 11: Contact Information */}
        <ContactSection />
      </main>

      {/* SECTION 12: Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Admin Login Modal */}
      {showLoginModal && (
        <AdminLogin
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Full Admin Dashboard Overlay */}
      {showDashboard && adminUser && adminToken && (
        <AdminDashboard
          user={adminUser}
          token={adminToken}
          onLogout={handleLogout}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
}
