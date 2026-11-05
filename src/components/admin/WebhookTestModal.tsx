import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface WebhookTestModalProps {
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const WebhookTestModal: React.FC<WebhookTestModalProps> = ({
  token,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('Siddharth Nair');
  const [email, setEmail] = useState(`siddharth.nair.${Date.now().toString().slice(-4)}@msrit.edu`);
  const [mobile, setMobile] = useState('+91 98450 77123');
  const [college, setCollege] = useState('M.S. Ramaiah Institute of Technology');
  const [branch, setBranch] = useState('Artificial Intelligence and Data Science');
  const [year, setYear] = useState('3rd Year');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/simulate-google-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile_number: mobile,
          college_name: college,
          engineering_branch: branch,
          academic_year: year,
          degree: 'B.E / B.Tech',
          payment_status: paymentStatus,
          payment_reference: paymentStatus === 'paid' ? `SIM/UPI/${Date.now().toString().slice(-6)}` : '',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Simulation failed');

      setResponseMsg('Form submission simulated successfully! Added to live registrations.');
      onSuccess();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error simulating form submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950">
              Google Form Submission Simulator
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Test the synchronization webhook pipeline in real time
            </p>
          </div>
        </div>

        {responseMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{responseMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSimulate} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Student Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">College Name</label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              >
                <option value="Computer Science Engineering">Computer Science</option>
                <option value="Artificial Intelligence and Data Science">AI & Data Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics and Communication Engineering">ECE</option>
                <option value="Electrical and Electronics Engineering">EEE</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Initial Payment</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as 'pending' | 'paid')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              >
                <option value="pending">Pending Payment</option>
                <option value="paid">Paid (₹999 verified)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-xl shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Dispatch Test Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
