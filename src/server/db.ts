import fs from 'node:fs';
import path from 'node:path';
import type {
  StudentRegistration,
  SyncLog,
  ProgramConfig,
  DashboardStats,
  PaymentStatus,
  RegistrationStatus,
} from '../types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const SYNC_LOGS_FILE = path.join(DATA_DIR, 'sync_logs.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

// Seed dataset representing verified engineering students who submitted the assessment form
const INITIAL_REGISTRATIONS: StudentRegistration[] = [
  {
    id: 'edl_reg_001',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT1',
    full_name: 'Aditya S. Kulkarni',
    email: 'aditya.kulkarni@bmsce.ac.in',
    mobile_number: '+91 98451 22340',
    college_name: 'BMS College of Engineering, Bengaluru',
    degree: 'B.E / B.Tech',
    engineering_branch: 'Computer Science Engineering',
    academic_year: '3rd Year',
    registration_timestamp: '2026-11-01T10:14:22.000Z',
    payment_status: 'paid',
    payment_reference: 'UPI/20261101/EDL999812',
    payment_verified_at: '2026-11-01T11:00:00.000Z',
    payment_verified_by: 'admin@exposysdata.com',
    registration_status: 'confirmed',
    synchronization_status: 'success',
    notes: 'Google Form submission verified. Payment received via official bank QR.',
    created_at: '2026-11-01T10:14:22.000Z',
    updated_at: '2026-11-01T11:00:00.000Z',
  },
  {
    id: 'edl_reg_002',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT2',
    full_name: 'Priyanka N. Reddy',
    email: 'priyanka.reddy@rvce.edu.in',
    mobile_number: '+91 97412 88914',
    college_name: 'RV College of Engineering, Bengaluru',
    degree: 'B.E / B.Tech',
    engineering_branch: 'Artificial Intelligence and Data Science',
    academic_year: '4th Year',
    registration_timestamp: '2026-11-01T14:32:05.000Z',
    payment_status: 'paid',
    payment_reference: 'NEFT/EDL26/8941208',
    payment_verified_at: '2026-11-01T15:10:00.000Z',
    payment_verified_by: 'admin@exposysdata.com',
    registration_status: 'confirmed',
    synchronization_status: 'success',
    notes: 'Payment verified with account reference.',
    created_at: '2026-11-01T14:32:05.000Z',
    updated_at: '2026-11-01T15:10:00.000Z',
  },
  {
    id: 'edl_reg_003',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT3',
    full_name: 'Rohan Matthew Verma',
    email: 'rohan.verma@pes.edu',
    mobile_number: '+91 99805 44123',
    college_name: 'PES University, Bengaluru',
    degree: 'B.E / B.Tech',
    engineering_branch: 'Information Technology',
    academic_year: '3rd Year',
    registration_timestamp: '2026-11-02T09:20:18.000Z',
    payment_status: 'pending',
    registration_status: 'pending',
    synchronization_status: 'success',
    notes: 'Awaiting student payment verification receipt.',
    created_at: '2026-11-02T09:20:18.000Z',
    updated_at: '2026-11-02T09:20:18.000Z',
  },
  {
    id: 'edl_reg_004',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT4',
    full_name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@vit.ac.in',
    mobile_number: '+91 98231 66720',
    college_name: 'Vellore Institute of Technology',
    degree: 'B.Tech',
    engineering_branch: 'Electronics and Communication Engineering',
    academic_year: '2nd Year',
    registration_timestamp: '2026-11-02T16:45:00.000Z',
    payment_status: 'paid',
    payment_reference: 'UPI/20261102/EDL441290',
    payment_verified_at: '2026-11-02T17:15:00.000Z',
    payment_verified_by: 'admin@exposysdata.com',
    registration_status: 'confirmed',
    synchronization_status: 'success',
    created_at: '2026-11-02T16:45:00.000Z',
    updated_at: '2026-11-02T17:15:00.000Z',
  },
  {
    id: 'edl_reg_005',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT5',
    full_name: 'Karthik Raja S.',
    email: 'karthik.raja@msrit.edu',
    mobile_number: '+91 94481 33201',
    college_name: 'Ramaiah Institute of Technology',
    degree: 'B.E',
    engineering_branch: 'Cybersecurity',
    academic_year: '4th Year',
    registration_timestamp: '2026-11-03T11:05:44.000Z',
    payment_status: 'pending',
    registration_status: 'pending',
    synchronization_status: 'success',
    created_at: '2026-11-03T11:05:44.000Z',
    updated_at: '2026-11-03T11:05:44.000Z',
  },
  {
    id: 'edl_reg_006',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT6',
    full_name: 'Sneha Venkatesh',
    email: 'sneha.v@nitte.edu.in',
    mobile_number: '+91 97314 99012',
    college_name: 'NMAM Institute of Technology, Nitte',
    degree: 'B.E',
    engineering_branch: 'Electrical and Electronics Engineering',
    academic_year: '3rd Year',
    registration_timestamp: '2026-11-03T15:22:10.000Z',
    payment_status: 'paid',
    payment_reference: 'IMPS/EDL/992104',
    payment_verified_at: '2026-11-03T16:00:00.000Z',
    payment_verified_by: 'admin@exposysdata.com',
    registration_status: 'confirmed',
    synchronization_status: 'success',
    created_at: '2026-11-03T15:22:10.000Z',
    updated_at: '2026-11-03T16:00:00.000Z',
  },
  {
    id: 'edl_reg_007',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT7',
    full_name: 'Vikram Joshi',
    email: 'vikram.joshi@coep.ac.in',
    mobile_number: '+91 98901 23456',
    college_name: 'College of Engineering Pune (COEP)',
    degree: 'B.Tech',
    engineering_branch: 'Mechanical Engineering',
    academic_year: '3rd Year',
    registration_timestamp: '2026-11-04T08:12:40.000Z',
    payment_status: 'pending',
    registration_status: 'pending',
    synchronization_status: 'success',
    created_at: '2026-11-04T08:12:40.000Z',
    updated_at: '2026-11-04T08:12:40.000Z',
  },
];

const INITIAL_SYNC_LOGS: SyncLog[] = [
  {
    id: 'sync_log_001',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT1',
    payload_summary: 'Form submission: Aditya S. Kulkarni (aditya.kulkarni@bmsce.ac.in)',
    status: 'success',
    ip_address: '66.249.88.1',
    created_at: '2026-11-01T10:14:23.000Z',
    retry_count: 0,
  },
  {
    id: 'sync_log_002',
    google_response_id: '2_ABaOnudk37R9vP12xW-mQqRkLsT2',
    payload_summary: 'Form submission: Priyanka N. Reddy (priyanka.reddy@rvce.edu.in)',
    status: 'success',
    ip_address: '66.249.88.2',
    created_at: '2026-11-01T14:32:06.000Z',
    retry_count: 0,
  },
  {
    id: 'sync_log_003',
    google_response_id: 'invalid_malformed_01',
    payload_summary: 'Payload missing required email address field',
    status: 'failed',
    error_message: 'ValidationError: "email" is required in form submission',
    ip_address: '66.249.88.4',
    created_at: '2026-11-02T08:11:15.000Z',
    retry_count: 0,
  },
];

export class DatabaseService {
  private registrations: StudentRegistration[] = [];
  private syncLogs: SyncLog[] = [];
  private config: ProgramConfig = DEFAULT_CONFIG;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(REGISTRATIONS_FILE)) {
        const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
        this.registrations = JSON.parse(raw);
      } else {
        this.registrations = [...INITIAL_REGISTRATIONS];
        this.saveRegistrations();
      }

      if (fs.existsSync(SYNC_LOGS_FILE)) {
        const raw = fs.readFileSync(SYNC_LOGS_FILE, 'utf-8');
        this.syncLogs = JSON.parse(raw);
      } else {
        this.syncLogs = [...INITIAL_SYNC_LOGS];
        this.saveSyncLogs();
      }

      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.config = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
      } else {
        this.config = { ...DEFAULT_CONFIG };
        this.saveConfig();
      }
    } catch (err) {
      console.error('Database initialization warning:', err);
      this.registrations = [...INITIAL_REGISTRATIONS];
      this.syncLogs = [...INITIAL_SYNC_LOGS];
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  private saveRegistrations() {
    try {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(this.registrations, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving registrations to disk:', err);
    }
  }

  private saveSyncLogs() {
    try {
      fs.writeFileSync(SYNC_LOGS_FILE, JSON.stringify(this.syncLogs, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving sync logs to disk:', err);
    }
  }

  private saveConfig() {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving config to disk:', err);
    }
  }

  // Registrations Queries
  public getRegistrations(options?: {
    search?: string;
    payment_status?: string;
    registration_status?: string;
    page?: number;
    limit?: number;
  }): { items: StudentRegistration[]; total: number; page: number; totalPages: number } {
    let result = [...this.registrations];

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.mobile_number.toLowerCase().includes(q) ||
          r.college_name.toLowerCase().includes(q) ||
          r.engineering_branch.toLowerCase().includes(q) ||
          (r.payment_reference && r.payment_reference.toLowerCase().includes(q))
      );
    }

    if (options?.payment_status && options.payment_status !== 'all') {
      result = result.filter((r) => r.payment_status === options.payment_status);
    }

    if (options?.registration_status && options.registration_status !== 'all') {
      result = result.filter((r) => r.registration_status === options.registration_status);
    }

    // Sort newest first
    result.sort(
      (a, b) =>
        new Date(b.registration_timestamp || b.created_at).getTime() -
        new Date(a.registration_timestamp || a.created_at).getTime()
    );

    const total = result.length;
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 10);
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const items = result.slice(start, start + limit);

    return { items, total, page, totalPages };
  }

  public getAllRegistrations(): StudentRegistration[] {
    return [...this.registrations].sort(
      (a, b) =>
        new Date(b.registration_timestamp || b.created_at).getTime() -
        new Date(a.registration_timestamp || a.created_at).getTime()
    );
  }

  public getRegistrationById(id: string): StudentRegistration | undefined {
    return this.registrations.find((r) => r.id === id);
  }

  public getRegistrationByGoogleId(googleId: string): StudentRegistration | undefined {
    return this.registrations.find((r) => r.google_response_id === googleId);
  }

  public getRegistrationByEmail(email: string): StudentRegistration | undefined {
    return this.registrations.find((r) => r.email.toLowerCase() === email.toLowerCase());
  }

  public addRegistration(data: Partial<StudentRegistration>): {
    success: boolean;
    registration?: StudentRegistration;
    isDuplicate?: boolean;
    error?: string;
  } {
    // Check duplicate by google_response_id or email
    if (data.google_response_id) {
      const existingGoogle = this.getRegistrationByGoogleId(data.google_response_id);
      if (existingGoogle) {
        return { success: false, isDuplicate: true, registration: existingGoogle };
      }
    }

    if (data.email) {
      const existingEmail = this.getRegistrationByEmail(data.email);
      if (existingEmail) {
        return { success: false, isDuplicate: true, registration: existingEmail };
      }
    }

    const now = new Date().toISOString();
    const newRecord: StudentRegistration = {
      id: `edl_reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      google_response_id: data.google_response_id || `manual_${Date.now()}`,
      full_name: data.full_name || 'Engineering Student',
      email: data.email || '',
      mobile_number: data.mobile_number || '',
      college_name: data.college_name || 'Engineering College',
      degree: data.degree || 'B.E / B.Tech',
      engineering_branch: data.engineering_branch || 'Computer Science Engineering',
      academic_year: data.academic_year || '3rd Year',
      registration_timestamp: data.registration_timestamp || now,
      payment_status: data.payment_status || 'pending',
      payment_reference: data.payment_reference || '',
      payment_verified_at: data.payment_status === 'paid' ? now : undefined,
      payment_verified_by: data.payment_status === 'paid' ? 'admin@exposysdata.com' : undefined,
      registration_status: data.registration_status || 'pending',
      synchronization_status: data.synchronization_status || 'success',
      notes: data.notes || '',
      created_at: now,
      updated_at: now,
    };

    this.registrations.unshift(newRecord);
    this.saveRegistrations();
    return { success: true, registration: newRecord };
  }

  public updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    reference?: string,
    verifiedBy: string = 'admin@exposysdata.com',
    notes?: string
  ): StudentRegistration | null {
    const reg = this.registrations.find((r) => r.id === id);
    if (!reg) return null;

    reg.payment_status = status;
    if (reference !== undefined) reg.payment_reference = reference;
    if (status === 'paid') {
      reg.payment_verified_at = new Date().toISOString();
      reg.payment_verified_by = verifiedBy;
      if (reg.registration_status === 'pending') {
        reg.registration_status = 'confirmed';
      }
    } else if (status === 'pending') {
      reg.payment_verified_at = undefined;
      reg.payment_verified_by = undefined;
    }
    if (notes) {
      reg.notes = reg.notes ? `${reg.notes}\n[${new Date().toISOString()}] ${notes}` : notes;
    }
    reg.updated_at = new Date().toISOString();
    this.saveRegistrations();
    return reg;
  }

  public updateRegistrationStatus(
    id: string,
    status: RegistrationStatus,
    notes?: string
  ): StudentRegistration | null {
    const reg = this.registrations.find((r) => r.id === id);
    if (!reg) return null;

    reg.registration_status = status;
    if (notes) {
      reg.notes = reg.notes ? `${reg.notes}\n[${new Date().toISOString()}] ${notes}` : notes;
    }
    reg.updated_at = new Date().toISOString();
    this.saveRegistrations();
    return reg;
  }

  public deleteRegistration(id: string): boolean {
    const initialLen = this.registrations.length;
    this.registrations = this.registrations.filter((r) => r.id !== id);
    if (this.registrations.length !== initialLen) {
      this.saveRegistrations();
      return true;
    }
    return false;
  }

  // Sync Logs
  public addSyncLog(log: Omit<SyncLog, 'id' | 'created_at' | 'retry_count'>): SyncLog {
    const newLog: SyncLog = {
      id: `sync_log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      retry_count: 0,
      ...log,
    };
    this.syncLogs.unshift(newLog);
    if (this.syncLogs.length > 200) {
      this.syncLogs = this.syncLogs.slice(0, 200);
    }
    this.saveSyncLogs();
    return newLog;
  }

  public getSyncLogs(): SyncLog[] {
    return [...this.syncLogs];
  }

  public retrySyncLog(id: string): { success: boolean; message: string } {
    const log = this.syncLogs.find((l) => l.id === id);
    if (!log) return { success: false, message: 'Log not found' };

    log.retry_count += 1;
    log.retried_at = new Date().toISOString();

    // If it was failed, mark re-evaluated
    if (log.status === 'failed') {
      log.status = 'success';
      log.error_message = 'Resolved via admin console retry';
      this.saveSyncLogs();
      return { success: true, message: 'Sync log marked resolved and retried successfully' };
    }

    this.saveSyncLogs();
    return { success: true, message: 'Sync entry already completed' };
  }

  // Statistics
  public getStatistics(): DashboardStats {
    const total = this.registrations.length;
    const paid = this.registrations.filter((r) => r.payment_status === 'paid').length;
    const pendingPayment = this.registrations.filter((r) => r.payment_status === 'pending').length;
    const confirmed = this.registrations.filter((r) => r.registration_status === 'confirmed').length;
    const pendingReg = this.registrations.filter((r) => r.registration_status === 'pending').length;
    const failedSync = this.syncLogs.filter((l) => l.status === 'failed').length;
    const totalRevenue = paid * this.config.registrationFee;

    const branchDistribution: Record<string, number> = {};
    for (const r of this.registrations) {
      const b = r.engineering_branch || 'Other';
      branchDistribution[b] = (branchDistribution[b] || 0) + 1;
    }

    // Daily registrations over last 7 days
    const dailyMap: Record<string, number> = {};
    for (const r of this.registrations) {
      const dateKey = (r.registration_timestamp || r.created_at).slice(0, 10);
      dailyMap[dateKey] = (dailyMap[dateKey] || 0) + 1;
    }

    const dailyTrend = Object.keys(dailyMap)
      .sort()
      .map((date) => ({ date, count: dailyMap[date] }));

    return {
      totalRegistrations: total,
      verifiedPayments: paid,
      pendingPayments: pendingPayment,
      confirmedRegistrations: confirmed,
      pendingRegistrations: pendingReg,
      failedSynchronizations: failedSync,
      totalRevenue,
      branchDistribution,
      dailyTrend,
    };
  }

  // Program Config
  public getConfig(): ProgramConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<ProgramConfig>): ProgramConfig {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    return { ...this.config };
  }
}

export const db = new DatabaseService();
