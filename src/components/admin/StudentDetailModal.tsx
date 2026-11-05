import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import type {
  StudentRegistration,
  PaymentStatus,
  RegistrationStatus,
} from '../../types/index.ts';

interface StudentDetailModalProps {
  student: StudentRegistration;
  token: string;
  onClose: () => void;
  onUpdated: (updated: StudentRegistration) => void;
  onDeleted: (id: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  token,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(student.payment_status);
  const [paymentRef, setPaymentRef] = useState(student.payment_reference || '');
  const [regStatus, setRegStatus] = useState<RegistrationStatus>(student.registration_status);
  const [notes, setNotes] = useState(student.notes || '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      let currentStudent = { ...student };

      const resPayment = await fetch(`/api/admin/registrations/${student.id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_reference: paymentRef,
          notes: notes !== student.notes ? notes : undefined,
        }),
      });

      const dataPayment = await resPayment.json();
      if (!resPayment.ok) throw new Error(dataPayment.error || 'Failed to update payment');
      currentStudent = dataPayment.registration;

      if (regStatus !== currentStudent.registration_status) {
        const resReg = await fetch(`/api/admin/registrations/${student.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            registration_status: regStatus,
          }),
        });
        const dataReg = await resReg.json();
        if (!resReg.ok) throw new Error(dataReg.error || 'Failed to update registration status');
        currentStudent = dataReg.registration;
      }

      setSuccessMsg('Student record updated successfully');
      onUpdated(currentStudent);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${student.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete student');
      onDeleted(student.id);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Deletion failed');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-950">{student.full_name}</h3>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                · {student.degree}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Google Response ID: {student.google_response_id}
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Academic & Contact Details */}
        <div className="py-6 border-b border-slate-200 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            Applicant Profile
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Email Address</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 break-all">
                <Mail className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{student.email}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Mobile Contact</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 font-mono">
                <Phone className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{student.mobile_number}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">College / Institution</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Building className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>{student.college_name}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1 font-medium">Branch & Year</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <GraduationCap className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>
                  {student.engineering_branch} · {student.academic_year}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
              <span className="text-slate-500 block mb-1 font-medium">Submission Timestamp</span>
              <div className="flex items-center gap-2 font-medium text-slate-700 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  {student.registration_timestamp
                    ? new Date(student.registration_timestamp).toUTCString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Status Management */}
        <div className="py-6 border-b border-slate-200 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            Administrative Verification & Payment Status
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Status (₹999 Fee)
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              >
                <option value="pending">Pending Payment Verification</option>
                <option value="paid">Paid & Verified (₹999)</option>
                <option value="failed">Payment Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Registration Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registration Status
              </label>
              <select
                value={regStatus}
                onChange={(e) => setRegStatus(e.target.value as RegistrationStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-700 focus:bg-white font-medium"
              >
                <option value="pending">Pending Review</option>
                <option value="confirmed">Confirmed / Enrolled</option>
                <option value="rejected">Rejected / Invalid</option>
                <option value="completed">Assessment Completed</option>
              </select>
            </div>

            {/* Payment Reference ID */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Reference / Transaction UTR
              </label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="e.g. UPI/20261101/EDL999812 or NEFT/UTR-12345"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-700 focus:bg-white font-mono"
              />
              {student.payment_verified_at && (
                <div className="mt-1 text-[11px] text-slate-500 font-mono">
                  Verified at: {new Date(student.payment_verified_at).toLocaleString()} by{' '}
                  {student.payment_verified_by}
                </div>
              )}
            </div>

            {/* Internal Audit Notes */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Internal Audit Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add audit notes, verification checks, or communication history..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-700 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
                >
                  Confirm Delete Record
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 rounded-xl shadow-md shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
