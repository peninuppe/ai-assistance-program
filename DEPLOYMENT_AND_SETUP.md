# Exposys Data Labs — AI Assistant Assessment Program 2026
## Full-Stack Architecture, Production Deployment & Integration Guide

### 1. Overview
The Exposys Data Labs AI Assistant Assessment Program 2026 platform is a full-stack student registration, evaluation, and administrative system designed specifically for engineering students across India.

### 2. Live URLs & Credentials
- **Official Organization Portal**: `https://exposysdata.in`
- **Official Google Form**: `https://docs.google.com/forms/d/e/1FAIpQLSeXFt56qVMU6_fgjJ9dEFvDcAmuNeFnn02LbgmkwP3o16d4TA/viewform?usp=publish-editor`
- **Program Registration Fee**: ₹999
- **Official Admissions Email**: `hr@exposysdata.com`
- **Admissions Helpline**: `+91 77952 07065`
- **Administrative Portal Access**: Click "Admin Login" in the header / footer
- **Default Administrator Credentials**:
  - Email: `admin@exposysdata.com`
  - Password: `Exposys@2026!`
  - Webhook Secret: `exposys_edl_2026_secret`

---

### 3. Architecture & Data Flow
```
Student Submits Official Google Form
              ↓
Linked Google Forms Response Sheet
              ↓
Google Apps Script (onFormSubmit Trigger)
              ↓ HTTPS POST with x-webhook-secret
Exposys Backend API (/api/webhook/google-forms)
              ↓
Database Engine (Supabase PostgreSQL / Persistent Storage)
              ↓
Administrative Dashboard (Real-Time Metrics, Reconciliation & Management)
```

---

### 4. Database Schema (Supabase PostgreSQL)
The complete SQL migration script is located in `supabase_schema.sql`.

#### Tables Provisioned:
1. `student_registrations`:
   - `id`: UUID (Primary Key)
   - `google_response_id`: TEXT (Unique)
   - `full_name`: TEXT
   - `email`: TEXT (Unique)
   - `mobile_number`: TEXT
   - `college_name`: TEXT
   - `degree`: TEXT
   - `engineering_branch`: TEXT
   - `academic_year`: TEXT
   - `registration_timestamp`: TIMESTAMPTZ
   - `payment_status`: TEXT ('pending', 'paid', 'failed', 'refunded')
   - `payment_reference`: TEXT
   - `payment_verified_at`: TIMESTAMPTZ
   - `payment_verified_by`: TEXT
   - `registration_status`: TEXT ('pending', 'confirmed', 'rejected', 'completed')
   - `synchronization_status`: TEXT ('success', 'failed', 'pending')
   - `notes`: TEXT
   - `created_at`: TIMESTAMPTZ
   - `updated_at`: TIMESTAMPTZ

2. `synchronization_logs`:
   - `id`: UUID
   - `google_response_id`: TEXT
   - `payload_summary`: TEXT
   - `status`: TEXT ('success' | 'failed')
   - `error_message`: TEXT
   - `ip_address`: TEXT
   - `retry_count`: INTEGER
   - `created_at`: TIMESTAMPTZ

3. `admin_users`:
   - `id`: UUID
   - `email`: TEXT (Unique)
   - `role`: TEXT ('super_admin' | 'admin' | 'reviewer')
   - `name`: TEXT

---

### 5. Google Forms / Google Sheets Synchronization Setup
1. Open the Google Form response sheet in Google Sheets.
2. Select **Extensions > Apps Script**.
3. Copy the script located in `google_apps_script.js` (or copy directly from the **Apps Script** button in the Admin Console).
4. Update `BACKEND_WEBHOOK_URL` with your deployed domain:
   ```javascript
   const BACKEND_WEBHOOK_URL = "https://your-domain.com/api/webhook/google-forms";
   const WEBHOOK_SECRET = "exposys_edl_2026_secret";
   ```
5. Click the clock icon (**Triggers**) on the left sidebar:
   - Click **+ Add Trigger**.
   - Choose function: `onFormSubmitTrigger`.
   - Event source: `From spreadsheet`.
   - Event type: `On form submit`.
   - Save and grant permissions.

---

### 6. Environment Variables (`.env`)
```bash
PORT=3000
NODE_ENV=production
ADMIN_EMAIL=admin@exposysdata.com
ADMIN_PASSWORD=Exposys@2026!
WEBHOOK_SECRET=exposys_edl_2026_secret
# Optional Supabase Connection
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

---

### 7. Deployment Instructions

#### Frontend (Vercel / Cloudflare Pages / Static Hosting)
- Build command: `npm run build`
- Output directory: `dist`

#### Full-Stack (Render / Railway / Cloud Run / VPS)
- Start command: `npm start`
- Engine: Node.js 20+
- Port: 3000
