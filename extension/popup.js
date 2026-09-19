// Hunter Job Clipper — Popup Logic

const DEFAULT_API_URL = "http://localhost:5000";

const dom = {
  apiUrl: document.getElementById("apiUrl"),
  authToken: document.getElementById("authToken"),
  settingsSection: document.getElementById("settingsSection"),
  toggleSettingsBtn: document.getElementById("toggleSettingsBtn"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  statusBadge: document.getElementById("statusBadge"),
  statusText: document.getElementById("statusText"),
  company: document.getElementById("company"),
  role: document.getElementById("role"),
  jobUrl: document.getElementById("jobUrl"),
  notes: document.getElementById("notes"),
  clipBtn: document.getElementById("clipBtn"),
  feedbackMessage: document.getElementById("feedbackMessage"),
  mainForm: document.getElementById("mainForm"),
  successView: document.getElementById("successView"),
  savedJobSummary: document.getElementById("savedJobSummary"),
  clipAnotherBtn: document.getElementById("clipAnotherBtn"),
};

// Storage helper with fallback to localStorage
const storage = {
  get: (keys, cb) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.get(keys, cb);
    } else {
      const res = {};
      keys.forEach((k) => {
        res[k] = localStorage.getItem(k);
      });
      cb(res);
    }
  },
  set: (items, cb) => {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.set(items, cb);
    } else {
      Object.entries(items).forEach(([k, v]) => {
        localStorage.setItem(k, v);
      });
      if (cb) cb();
    }
  },
};

function showFeedback(msg, type = "error") {
  dom.feedbackMessage.textContent = msg;
  dom.feedbackMessage.className = `feedback-message ${type}`;
}

function clearFeedback() {
  dom.feedbackMessage.className = "feedback-message hidden";
  dom.feedbackMessage.textContent = "";
}

function updateStatus(connected, text) {
  dom.statusBadge.className = `status-badge ${connected ? "connected" : "disconnected"}`;
  dom.statusText.textContent = text;
}

// Load Settings & Check Connection
function initSettings() {
  storage.get(["hunter_api_url", "hunter_auth_token"], (data) => {
    const apiUrl = data.hunter_api_url || DEFAULT_API_URL;
    const token = data.hunter_auth_token || "";

    dom.apiUrl.value = apiUrl;
    dom.authToken.value = token;

    if (!token) {
      updateStatus(false, "Token Required (Click ⚙️)");
      dom.settingsSection.classList.remove("hidden");
    } else {
      checkApiHealth(apiUrl);
    }
  });
}

async function checkApiHealth(apiUrl) {
  try {
    const res = await fetch(`${apiUrl}/health`);
    if (res.ok) {
      updateStatus(true, "Connected to Hunter API");
    } else {
      updateStatus(false, "API Reachable, but unhealthy");
    }
  } catch {
    updateStatus(false, "Cannot reach Hunter API");
  }
}

// Query Active Tab for Job Info
function queryActiveTab() {
  if (typeof chrome === "undefined" || !chrome.tabs?.query) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.id) return;

    if (activeTab.url) {
      dom.jobUrl.value = activeTab.url;
    }

    chrome.tabs.sendMessage(activeTab.id, { type: "GET_JOB_DETAILS" }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script may not be loaded on this page
        return;
      }

      if (response && response.success && response.data) {
        const { company, role, jobUrl, notes } = response.data;
        if (company) dom.company.value = company;
        if (role) dom.role.value = role;
        if (jobUrl) dom.jobUrl.value = jobUrl;
        if (notes) dom.notes.value = notes;
      }
    });
  });
}

// Save Settings
dom.saveSettingsBtn.addEventListener("click", () => {
  const apiUrl = dom.apiUrl.value.trim().replace(/\/$/, "");
  const token = dom.authToken.value.trim();

  storage.set({ hunter_api_url: apiUrl, hunter_auth_token: token }, () => {
    showFeedback("Settings saved successfully!", "success");
    dom.settingsSection.classList.add("hidden");
    if (token) {
      checkApiHealth(apiUrl);
    } else {
      updateStatus(false, "Token Required (Click ⚙️)");
    }
    setTimeout(clearFeedback, 2500);
  });
});

dom.toggleSettingsBtn.addEventListener("click", () => {
  dom.settingsSection.classList.toggle("hidden");
});

// Clip Job
dom.clipBtn.addEventListener("click", async () => {
  clearFeedback();

  const company = dom.company.value.trim();
  const role = dom.role.value.trim();
  const jobUrl = dom.jobUrl.value.trim();
  const notes = dom.notes.value.trim();

  if (!company || !role) {
    showFeedback("Company and Role are required fields.");
    return;
  }

  storage.get(["hunter_api_url", "hunter_auth_token"], async (data) => {
    const apiUrl = data.hunter_api_url || DEFAULT_API_URL;
    const token = data.hunter_auth_token;

    if (!token) {
      showFeedback("Please set your JWT Auth Token in settings (⚙️).");
      dom.settingsSection.classList.remove("hidden");
      return;
    }

    dom.clipBtn.disabled = true;
    dom.clipBtn.querySelector(".btn-text").textContent = "Clipping...";

    try {
      const res = await fetch(`${apiUrl}/api/v1/jobs/quick-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company,
          role,
          jobUrl: jobUrl || undefined,
          notes: notes || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to save job application");
      }

      // Success
      dom.savedJobSummary.textContent = `${role} at ${company}`;
      dom.mainForm.classList.add("hidden");
      dom.successView.classList.remove("hidden");
    } catch (err) {
      showFeedback(err.message || "Network error communicating with Hunter backend.");
    } finally {
      dom.clipBtn.disabled = false;
      dom.clipBtn.querySelector(".btn-text").textContent = "Clip to Hunter";
    }
  });
});

dom.clipAnotherBtn.addEventListener("click", () => {
  dom.company.value = "";
  dom.role.value = "";
  dom.notes.value = "";
  dom.successView.classList.add("hidden");
  dom.mainForm.classList.remove("hidden");
  clearFeedback();
  queryActiveTab();
});

// Check for context menu pending notes
function checkPendingNotes() {
  storage.get(["hunter_pending_notes"], (data) => {
    if (data.hunter_pending_notes) {
      if (!dom.notes.value) {
        dom.notes.value = data.hunter_pending_notes;
      }
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        chrome.storage.local.remove("hunter_pending_notes");
      }
    }
  });
}

// Initialize
initSettings();
queryActiveTab();
checkPendingNotes();
