/**
 * ==============================================================================
 * EXPOSYS DATA LABS - AI ASSISTANT ASSESSMENT PROGRAM 2026
 * Google Apps Script for Google Forms / Google Sheets Synchronization
 * ==============================================================================
 *
 * HOW TO INSTALL:
 * 1. Open your Google Form or its linked Google Sheet.
 * 2. In Google Sheets, click "Extensions" > "Apps Script".
 * 3. Delete existing template code and paste this script into Code.gs.
 * 4. Update BACKEND_WEBHOOK_URL with your hosted app URL (e.g., https://your-domain.com/api/webhook/google-forms).
 * 5. Update WEBHOOK_SECRET with your secure token (e.g. exposys_edl_2026_secret).
 * 6. Set up a Trigger:
 *    - Click the clock icon ("Triggers") on the left sidebar.
 *    - Click "+ Add Trigger".
 *    - Choose function to run: "onFormSubmitTrigger"
 *    - Event source: "From spreadsheet"
 *    - Event type: "On form submit"
 *    - Click "Save" and authorize Google permissions.
 */

// 1. CONFIGURATION
const BACKEND_WEBHOOK_URL = "https://your-domain.com/api/webhook/google-forms";
const WEBHOOK_SECRET = "exposys_edl_2026_secret";

/**
 * Triggered automatically every time a student submits the Google Form.
 * @param {Object} e - The event object from Google Sheets / Forms onFormSubmit
 */
function onFormSubmitTrigger(e) {
  try {
    let payload = {};

    if (e && e.namedValues) {
      // Event received from linked Google Sheet onFormSubmit
      const nv = e.namedValues;
      
      // Extract fields matching Google Form questions
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
      // Event received directly from Google Form onFormSubmit
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
        const title = item.getItem().getTitle();
        const responseVal = item.getResponse();

        mapFieldByTitle(payload, title, responseVal);
      }
    } else {
      Logger.log("Manual test execution without event payload.");
      return;
    }

    // Send payload to backend
    sendToBackendWebhook(payload);

  } catch (error) {
    Logger.log("Error in onFormSubmitTrigger: " + error.toString());
  }
}

/**
 * Send HTTP POST to backend webhook with secret header
 */
function sendToBackendWebhook(payload) {
  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-webhook-secret": WEBHOOK_SECRET
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(BACKEND_WEBHOOK_URL, options);
    const code = response.getResponseCode();
    const content = response.getContentText();

    Logger.log("Webhook Response Code: " + code);
    Logger.log("Webhook Response Body: " + content);

    if (code >= 200 && code < 300) {
      Logger.log("Registration successfully synchronized for: " + payload.email);
    } else {
      Logger.log("Webhook returned error: " + content);
    }
  } catch (err) {
    Logger.log("Network error calling backend webhook: " + err.toString());
  }
}

/**
 * Helper to match possible question names
 */
function getFirstValue(namedValues, possibleKeys) {
  for (let i = 0; i < possibleKeys.length; i++) {
    const key = possibleKeys[i];
    if (namedValues[key] && namedValues[key].length > 0 && namedValues[key][0]) {
      return String(namedValues[key][0]).trim();
    }
  }
  return "";
}

/**
 * Helper for direct Form responses
 */
function mapFieldByTitle(payload, title, val) {
  const t = title.toLowerCase();
  const v = Array.isArray(val) ? val.join(", ") : String(val).trim();

  if (t.includes("name") && !t.includes("college")) {
    payload.full_name = v;
  } else if (t.includes("email")) {
    payload.email = v;
  } else if (t.includes("mobile") || t.includes("phone") || t.includes("contact")) {
    payload.mobile_number = v;
  } else if (t.includes("college") || t.includes("institution") || t.includes("university")) {
    payload.college_name = v;
  } else if (t.includes("degree") || t.includes("program")) {
    payload.degree = v;
  } else if (t.includes("branch") || t.includes("department")) {
    payload.engineering_branch = v;
  } else if (t.includes("year")) {
    payload.academic_year = v;
  } else if (t.includes("payment") || t.includes("transaction") || t.includes("utr")) {
    payload.payment_reference = v;
  }
}

/**
 * Manual Test Utility: Run this function directly inside the script editor
 * to verify communication with your backend!
 */
function testWebhookConnection() {
  const testPayload = {
    google_response_id: "test_" + new Date().getTime(),
    full_name: "Test Student",
    email: "test.student@engineering.edu",
    mobile_number: "+91 98765 43210",
    college_name: "Sample Institute of Technology",
    degree: "B.E / B.Tech",
    engineering_branch: "Artificial Intelligence and Data Science",
    academic_year: "3rd Year",
    registration_timestamp: new Date().toISOString(),
    payment_status: "pending",
    notes: "Manual test verification from Google Apps Script Editor"
  };

  sendToBackendWebhook(testPayload);
}
