export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type RegistrationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';
export type SyncStatus = 'success' | 'failed' | 'pending';

export interface StudentRegistration {
  id: string;
  google_response_id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  college_name: string;
  degree: string;
  engineering_branch: string;
  academic_year: string;
  registration_timestamp: string;
  payment_status: PaymentStatus;
  payment_reference?: string;
  payment_verified_at?: string;
  payment_verified_by?: string;
  registration_status: RegistrationStatus;
  synchronization_status: SyncStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  google_response_id?: string;
  payload_summary: string;
  status: 'success' | 'failed';
  error_message?: string;
  ip_address?: string;
  created_at: string;
  retried_at?: string;
  retry_count: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'reviewer';
  name: string;
}

export interface ProgramConfig {
  programName: string;
  organization: string;
  registrationFee: number;
  currency: string;
  registrationDeadline: string;
  assessmentDate: string;
  submissionPeriodDays: number;
  contactEmail: string;
  contactPhone: string;
  officialFormUrl: string;
  benefitsConfirmed: boolean;
}

export interface DashboardStats {
  totalRegistrations: number;
  verifiedPayments: number;
  pendingPayments: number;
  confirmedRegistrations: number;
  pendingRegistrations: number;
  failedSynchronizations: number;
  totalRevenue: number;
  branchDistribution: Record<string, number>;
  dailyTrend: { date: string; count: number }[];
}
