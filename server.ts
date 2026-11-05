import express, { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { db } from './src/server/db.ts';
import {
  authenticateAdminCredentials,
  verifySessionToken,
  revokeSessionToken,
  requireAdmin,
  WEBHOOK_SECRET,
  ADMIN_EMAIL,
} from './src/server/auth.ts';
import type { PaymentStatus, RegistrationStatus } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for auditability
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  // Public Program Configuration
  app.get('/api/config', (_req: Request, res: Response) => {
    const config = db.getConfig();
    res.json(config);
  });

  // ==========================================
  // GOOGLE FORMS SYNCHRONIZATION WEBHOOK
  // ==========================================
  /**
   * Receives incoming HTTP POST payloads from Google Apps Script trigger on Form submit.
   * Authentication: Secret header 'x-webhook-secret' or query param '?secret=...'
   */
  app.post('/api/webhook/google-forms', (req: Request, res: Response) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const providedSecret =
      (req.headers['x-webhook-secret'] as string) ||
      (req.query.secret as string) ||
      req.body?.secret;

    // Verify secret
    if (providedSecret !== WEBHOOK_SECRET) {
      console.warn(`[Webhook Auth Failure] Invalid webhook secret from IP: ${ip}`);
      db.addSyncLog({
        status: 'failed',
        error_message: 'Invalid or missing x-webhook-secret',
        payload_summary: `Unauthorized attempt from ${ip}`,
        ip_address: ip,
      });
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid webhook secret token',
      });
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      db.addSyncLog({
        status: 'failed',
        error_message: 'Malformed request: payload body is empty or invalid JSON',
        payload_summary: 'Empty body',
        ip_address: ip,
      });
      return res.status(400).json({ success: false, error: 'Empty or invalid JSON payload' });
    }

    // Google Apps Script can send either structured field mapping or responses object
    // Map various possible field naming variants from Google Forms
    const googleResponseId =
      payload.google_response_id ||
      payload.responseId ||
      payload.id ||
      payload['Response ID'] ||
      `gf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const fullName =
      payload.full_name ||
      payload.fullName ||
      payload.name ||
      payload['Full Name'] ||
      payload['Student Name'] ||
      payload['Name of the Student'] ||
      '';

    const email =
      payload.email ||
      payload.emailAddress ||
      payload['Email Address'] ||
      payload['Email ID'] ||
      payload['Official Email'] ||
      '';

    const mobileNumber =
      payload.mobile_number ||
      payload.mobile ||
      payload.phone ||
      payload['Mobile Number'] ||
      payload['Phone Number'] ||
      payload['WhatsApp Number'] ||
      '';

    const collegeName =
      payload.college_name ||
      payload.college ||
      payload['College Name'] ||
      payload['Name of College/University'] ||
      payload['Institution'] ||
      '';

    const degree =
      payload.degree ||
      payload['Degree'] ||
      payload['Degree / Program'] ||
      'B.E / B.Tech';

    const engineeringBranch =
      payload.engineering_branch ||
      payload.branch ||
      payload['Engineering Branch'] ||
      payload['Branch of Engineering'] ||
      payload['Department'] ||
      'Computer Science Engineering';

    const academicYear =
      payload.academic_year ||
      payload.year ||
      payload['Academic Year'] ||
      payload['Year of Study'] ||
      payload['Current Year'] ||
      '3rd Year';

    const registrationTimestamp =
      payload.registration_timestamp ||
      payload.timestamp ||
      payload['Timestamp'] ||
      new Date().toISOString();

    const paymentStatus: PaymentStatus =
      payload.payment_status === 'paid' ? 'paid' : 'pending';
    const paymentReference = payload.payment_reference || payload['Payment Reference / Transaction ID'] || '';

    // Validate essential fields
    if (!email || !fullName) {
      const errMsg = 'Validation failed: Both full_name and email are mandatory fields';
      db.addSyncLog({
        google_response_id: googleResponseId,
        status: 'failed',
        error_message: errMsg,
        payload_summary: `Incomplete record for "${fullName || 'Unknown'}" (${email || 'No email'})`,
        ip_address: ip,
      });
      return res.status(422).json({ success: false, error: errMsg });
    }

    // Insert into database with duplicate prevention
    const result = db.addRegistration({
      google_response_id: googleResponseId,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile_number: mobileNumber.trim(),
      college_name: collegeName.trim() || 'Engineering College',
      degree: degree.trim(),
      engineering_branch: engineeringBranch.trim(),
      academic_year: academicYear.trim(),
      registration_timestamp: registrationTimestamp,
      payment_status: paymentStatus,
      payment_reference: paymentReference,
      registration_status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      synchronization_status: 'success',
      notes: payload.notes || 'Automated synchronization from Google Forms response sheet',
    });

    if (result.isDuplicate) {
      db.addSyncLog({
        google_response_id: googleResponseId,
        status: 'success',
        payload_summary: `Ignored duplicate response for ${email} (ID: ${googleResponseId})`,
        ip_address: ip,
      });
      return res.status(200).json({
        success: true,
        message: 'Duplicate submission identified; existing record preserved without overwrite',
        registrationId: result.registration?.id,
        isDuplicate: true,
      });
    }

    db.addSyncLog({
      google_response_id: googleResponseId,
      status: 'success',
      payload_summary: `Successfully synchronized ${fullName} (${email}) from Google Form`,
      ip_address: ip,
    });

    return res.status(201).json({
      success: true,
      message: 'Student registration successfully synchronized from Google Form',
      registration: result.registration,
    });
  });

  // ==========================================
  // ADMIN AUTHENTICATION
  // ==========================================

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const authResult = authenticateAdminCredentials(email, password);

    if (!authResult.success) {
      return res.status(401).json({ success: false, error: authResult.error });
    }

    return res.json({
      success: true,
      token: authResult.token,
      user: authResult.user,
    });
  });

  app.get('/api/admin/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const user = verifySessionToken(token);
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    return res.json({ authenticated: true, user });
  });

  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);
    if (token) {
      revokeSessionToken(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // ==========================================
  // ADMIN PROTECTED MANAGEMENT ENDPOINTS
  // ==========================================

  // Dashboard Overview Statistics
  app.get('/api/admin/statistics', requireAdmin, (_req: Request, res: Response) => {
    const stats = db.getStatistics();
    res.json(stats);
  });

  // Query Registrations Table with Search and Filters
  app.get('/api/admin/registrations', requireAdmin, (req: Request, res: Response) => {
    const search = req.query.search as string;
    const paymentStatus = req.query.payment_status as string;
    const registrationStatus = req.query.registration_status as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = db.getRegistrations({
      search,
      payment_status: paymentStatus,
      registration_status: registrationStatus,
      page,
      limit,
    });

    res.json(result);
  });

  // Update Payment Status
  app.patch('/api/admin/registrations/:id/payment', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { payment_status, payment_reference, notes } = req.body;

    if (!payment_status) {
      return res.status(400).json({ error: 'payment_status is required' });
    }

    const updated = db.updatePaymentStatus(
      id,
      payment_status as PaymentStatus,
      payment_reference,
      ADMIN_EMAIL,
      notes
    );

    if (!updated) {
      return res.status(404).json({ error: 'Registration record not found' });
    }

    res.json({ success: true, registration: updated });
  });

  // Update Registration Status
  app.patch('/api/admin/registrations/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { registration_status, notes } = req.body;

    if (!registration_status) {
      return res.status(400).json({ error: 'registration_status is required' });
    }

    const updated = db.updateRegistrationStatus(
      id,
      registration_status as RegistrationStatus,
      notes
    );

    if (!updated) {
      return res.status(404).json({ error: 'Registration record not found' });
    }

    res.json({ success: true, registration: updated });
  });

  // Add Manual Student Registration
  app.post('/api/admin/registrations/manual', requireAdmin, (req: Request, res: Response) => {
    const data = req.body;
    if (!data.full_name || !data.email) {
      return res.status(400).json({ error: 'Student full name and email are required' });
    }

    const result = db.addRegistration(data);
    if (!result.success && result.isDuplicate) {
      return res.status(409).json({
        error: 'A student registration with this email or form ID already exists',
        existing: result.registration,
      });
    }

    res.status(201).json({ success: true, registration: result.registration });
  });

  // Delete Registration
  app.delete('/api/admin/registrations/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = db.deleteRegistration(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ success: true, message: 'Registration record deleted' });
  });

  // Webhook Sync Logs
  app.get('/api/admin/sync-logs', requireAdmin, (_req: Request, res: Response) => {
    const logs = db.getSyncLogs();
    res.json(logs);
  });

  // Retry Failed Sync Log
  app.post('/api/admin/sync-logs/:id/retry', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const result = db.retrySyncLog(id);
    res.json(result);
  });

  // Program Configuration Update
  app.patch('/api/admin/config', requireAdmin, (req: Request, res: Response) => {
    const updates = req.body;
    const updated = db.updateConfig(updates);
    res.json({ success: true, config: updated });
  });

  // Simulator / Test Google Forms Submission
  app.post('/api/admin/simulate-google-form', requireAdmin, (req: Request, res: Response) => {
    const mockSubmission = req.body;
    const googleId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const result = db.addRegistration({
      google_response_id: mockSubmission.google_response_id || googleId,
      full_name: mockSubmission.full_name || 'Snehal Sen',
      email: mockSubmission.email || `student.${Date.now()}@college.edu`,
      mobile_number: mockSubmission.mobile_number || '+91 98860 12345',
      college_name: mockSubmission.college_name || 'Indian Institute of Information Technology',
      degree: mockSubmission.degree || 'B.Tech',
      engineering_branch: mockSubmission.engineering_branch || 'Artificial Intelligence and Data Science',
      academic_year: mockSubmission.academic_year || '3rd Year',
      registration_timestamp: new Date().toISOString(),
      payment_status: mockSubmission.payment_status || 'pending',
      payment_reference: mockSubmission.payment_reference || '',
      registration_status: mockSubmission.payment_status === 'paid' ? 'confirmed' : 'pending',
      synchronization_status: 'success',
      notes: 'Simulated Google Form submission from admin testing panel',
    });

    db.addSyncLog({
      google_response_id: googleId,
      status: 'success',
      payload_summary: `[Simulation Test] Received form submission for ${mockSubmission.full_name || 'Snehal Sen'}`,
      ip_address: '127.0.0.1 (Admin Console)',
    });

    res.json({ success: true, result });
  });

  // Export CSV
  app.get('/api/admin/export/csv', requireAdmin, (_req: Request, res: Response) => {
    const all = db.getAllRegistrations();

    const headers = [
      'ID',
      'Google Response ID',
      'Full Name',
      'Email',
      'Mobile Number',
      'College',
      'Degree',
      'Engineering Branch',
      'Academic Year',
      'Registration Date',
      'Payment Status',
      'Payment Reference',
      'Payment Verified At',
      'Payment Verified By',
      'Registration Status',
      'Notes',
    ];

    const escapeCsv = (val: string | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = all.map((r) =>
      [
        escapeCsv(r.id),
        escapeCsv(r.google_response_id),
        escapeCsv(r.full_name),
        escapeCsv(r.email),
        escapeCsv(r.mobile_number),
        escapeCsv(r.college_name),
        escapeCsv(r.degree),
        escapeCsv(r.engineering_branch),
        escapeCsv(r.academic_year),
        escapeCsv(r.registration_timestamp),
        escapeCsv(r.payment_status),
        escapeCsv(r.payment_reference),
        escapeCsv(r.payment_verified_at),
        escapeCsv(r.payment_verified_by),
        escapeCsv(r.registration_status),
        escapeCsv(r.notes),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="exposys_registrations_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvContent);
  });

  // Export Excel / Spreadsheet
  app.get('/api/admin/export/excel', requireAdmin, (_req: Request, res: Response) => {
    const all = db.getAllRegistrations();

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Registrations 2026</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      </head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff; font-weight: bold;">
              <th>S.No</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>College</th>
              <th>Branch</th>
              <th>Academic Year</th>
              <th>Registration Date</th>
              <th>Payment Status</th>
              <th>Payment Ref</th>
              <th>Registration Status</th>
              <th>Google Form ID</th>
            </tr>
          </thead>
          <tbody>
    `;

    all.forEach((r, idx) => {
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${r.full_name}</td>
          <td>${r.email}</td>
          <td>${r.mobile_number}</td>
          <td>${r.college_name}</td>
          <td>${r.engineering_branch}</td>
          <td>${r.academic_year}</td>
          <td>${r.registration_timestamp ? new Date(r.registration_timestamp).toLocaleString() : ''}</td>
          <td style="font-weight: bold; color: ${r.payment_status === 'paid' ? '#16a34a' : '#d97706'}">${r.payment_status.toUpperCase()}</td>
          <td>${r.payment_reference || '-'}</td>
          <td>${r.registration_status.toUpperCase()}</td>
          <td>${r.google_response_id}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="exposys_assessment_registrations_2026_${new Date().toISOString().slice(0, 10)}.xls"`
    );
    res.send(html);
  });

  // ==========================================
  // FRONTEND INTEGRATION (Vite in Dev / Static in Prod)
  // ==========================================

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` Exposys Data Labs AI Assessment 2026 Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` Webhook URL: http://localhost:${PORT}/api/webhook/google-forms`);
    console.log(` Default Admin: ${ADMIN_EMAIL} / Exposys@2026!`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
