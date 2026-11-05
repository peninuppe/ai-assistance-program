import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface GoogleAppsScriptModalProps {
  onClose: () => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${window.location.origin}/api/webhook/google-forms`;
  const webhookSecret = 'exposys_edl_2026_secret';

  const scriptCode = `/**
 * ==============================================================================
 * EXPOSYS DATA LABS - AI ASSISTANT ASSESSMENT PROGRAM 2026
 * Google Forms / Sheets to Exposys Backend Synchronization Script
 * ==============================================================================
 */

const BACKEND_WEBHOOK_URL = "${webhookUrl}";
const WEBHOOK_SECRET = "${webhookSecret}";

function onFormSubmitTrigger(e) {
  try {
    let payload = {};

    if (e && e.namedValues) {
      const nv = e.namedValues;
      payload = {
        google_response_id: (e.range ? "row_" + e.range.getRow() : "gf_" + new Date().getTime()),
        full_name: getFirstValue(nv, ["Full Name", "Student Name", "Name of the Student", "Name"]),
        email: getFirstValue(nv, ["Email Address", "Email ID", "Email", "Official Email"]),
        mobile_number: getFirstValue(nv, ["Mobile Number", "Phone Number", "Contact Number", "WhatsApp Number"]),
        college_name: getFirstValue(nv, ["College Name", "Name of College/University", "College", "Institution"]),
        degree: getFirstValue(nv, ["Degree", "Degree / Program", "Course"]) || "B.E / B.Tech",
        engineering_branch: getFirstValue(nv, ["Engineering Branch", "Branch of Engineering", "Branch", "Department"]) || "Computer Science Engineering",
        academic_year: getFirstValue(nv, ["Academic Year", "Year of Study", "Current Year", "Year"]) || "3rd Year",
        registration_timestamp: getFirstValue(nv, ["Timestamp"]) || new Date().toISOString(),
        payment_status: "pending",
        payment_reference: getFirstValue(nv, ["Payment Reference / Transaction ID", "Transaction ID", "UTR"]) || "",
        notes: "Synchronized via Google Apps Script trigger"
      };
    } else if (e && e.response) {
      const formResponse = e.response;
      const itemResponses = formResponse.getItemResponses();
      
      payload = {
        google_response_id: formResponse.getId(),
        registration_timestamp: formResponse.getTimestamp().toISOString(),
        email: formResponse.getRespondentEmail() || "",
        payment_status: "pending"
      };

      for (let i = 0; i < itemResponses.length; i++) {
        const item = itemResponses[i];
        mapFieldByTitle(payload, item.getItem().getTitle(), item.getResponse());
      }
    }

    // Post to backend
    const options = {
      method: "post",
      contentType: "application/json",
      headers: { "x-webhook-secret": WEBHOOK_SECRET },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const res = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    Logger.log("Sync Response Code: " + res.getResponseCode());
  } catch (error) {
    Logger.log("Error in onFormSubmitTrigger: " + error.toString());
  }
}

function getFirstValue(namedValues, possibleKeys) {
  for (let i = 0; i < possibleKeys.length; i++) {
    const key = possibleKeys[i];
    if (namedValues[key] && namedValues[key].length > 0 && namedValues[key][0]) {
      return String(namedValues[key][0]).trim();
    }
  }
  return "";
}

function mapFieldByTitle(payload, title, val) {
  const t = title.toLowerCase();
  const v = Array.isArray(val) ? val.join(", ") : String(val).trim();
  if (t.includes("name") && !t.includes("college")) payload.full_name = v;
  else if (t.includes("email")) payload.email = v;
  else if (t.includes("mobile") || t.includes("phone")) payload.mobile_number = v;
  else if (t.includes("college") || t.includes("institution")) payload.college_name = v;
  else if (t.includes("degree")) payload.degree = v;
  else if (t.includes("branch")) payload.engineering_branch = v;
  else if (t.includes("year")) payload.academic_year = v;
  else if (t.includes("payment") || t.includes("transaction")) payload.payment_reference = v;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              Google Forms & Sheets Synchronization Setup
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Connect the live Google Form responses directly to this administrative dashboard
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="py-6 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            Setup Instructions (Takes 2 minutes)
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                1
              </span>
              <div>
                <span className="font-bold text-slate-900">Open the Linked Google Sheet:</span>
                <p className="text-slate-600 mt-0.5">
                  In your Google Form responses tab, click "View in Sheets" or open the associated response spreadsheet.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                2
              </span>
              <div>
                <span className="font-bold text-slate-900">Open Google Apps Script:</span>
                <p className="text-slate-600 mt-0.5">
                  Click <strong className="text-slate-900">Extensions &gt; Apps Script</strong> in the top menu of your Google Sheet.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                3
              </span>
              <div>
                <span className="font-bold text-slate-900">Paste Code & Save:</span>
                <p className="text-slate-600 mt-0.5">
                  Replace any existing placeholder in <code className="text-blue-700 font-mono font-semibold">Code.gs</code> with the code below and press Ctrl+S.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[11px] shrink-0">
                4
              </span>
              <div>
                <span className="font-bold text-slate-900">Configure onFormSubmit Trigger:</span>
                <p className="text-slate-600 mt-0.5">
                  Click the clock icon (Triggers) on the left sidebar &gt; "+ Add Trigger" &gt; Choose function: <code className="text-blue-700 font-mono font-semibold">onFormSubmitTrigger</code> &gt; Event type: <strong className="text-slate-900">On form submit</strong> &gt; Save.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Box */}
        <div className="pb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-600 font-semibold">Code.gs (Ready to paste)</span>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script Code</span>
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-slate-200 max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{scriptCode}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Endpoint: <span className="font-mono text-blue-800 font-bold">/api/webhook/google-forms</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
