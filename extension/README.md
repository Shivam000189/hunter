# Hunter — One-Click Job Clipper Extension (Manifest V3)

The **Hunter Job Clipper** browser extension allows you to save job postings directly from LinkedIn, Indeed, Greenhouse, Lever, and any company careers page into your Hunter Kanban board with a single click.

---

## 🚀 Features

- **Automated Scraping**: Intelligently extracts Company, Job Title / Role, Job URL, and Job Description from:
  - **LinkedIn Jobs** (`linkedin.com/jobs/...`)
  - **Indeed** (`indeed.com/viewjob...`)
  - **Greenhouse** (`boards.greenhouse.io/...`)
  - **Lever** (`jobs.lever.co/...`)
  - **Generic Career Portals**: Heuristic fallback inspecting OpenGraph meta tags, `<title>`, and text selection.
- **Context Menu Scraping**: Highlight any job requirements or notes on any webpage, right-click, and select *"Clip selection to Hunter notes"*.
- **Direct API Integration**: Submits directly to `POST /api/v1/jobs/quick-add` on your Hunter backend.
- **Auto Status Defaulting**: Saved jobs automatically enter your tracker under the **"Applied"** column with today's date.
- **Deep-Link to Kanban**: Instant one-click link to open your Hunter board directly after clipping.

---

## 📦 Installation Guide

### 1. Load Unpacked in Chrome / Edge / Brave

1. Open your Chromium-based browser and navigate to:
   - **Chrome / Brave**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
2. Enable **Developer mode** (toggle located at the top-right corner).
3. Click the **Load unpacked** button in the top-left menu.
4. Select the `extension/` folder inside the `hunter` repository:
   ```
   d:\shivam\projects\hunter\extension
   ```
5. The **Hunter — One-Click Job Clipper** extension will appear in your extensions list.
6. (Optional) Pin the extension icon 🎯 to your browser toolbar for easy access.

---

## ⚙️ Configuration

1. Click the **Hunter 🎯** extension icon in your toolbar.
2. Click the **Settings (⚙️)** icon in the popup header.
3. Configure the following fields:
   - **Backend API URL**: `http://localhost:5000` (or your production API URL).
   - **JWT Auth Token**: Paste your Hunter Bearer token.
     - *How to get your token*: Log into Hunter at `http://localhost:5173`, open Developer Tools (`F12`), go to the **Application** tab -> **Local Storage** -> `http://localhost:5173`, and copy the value of `hunter_token`.
4. Click **Save Configuration**.
5. The status badge will turn green with **"Connected to Hunter API"**.

---

## 🛠️ Usage

1. Browse to any job posting (e.g. on LinkedIn, Indeed, Greenhouse, or Lever).
2. Click the **Hunter** extension icon.
3. The Company, Role, and URL will automatically populate in the form.
4. Add or modify any notes, salary details, or requirements if desired.
5. Click **Clip to Hunter**.
6. The job is saved instantly! Click **Open Kanban Board** to view your application.

---

## 🔒 Security & CORS

The Hunter backend server explicitly enables CORS for browser extensions:
- Allows `chrome-extension://*` and `moz-extension://*` origins.
- All requests are authenticated via standard `Bearer <jwt_token>` headers.
- Credentials and tokens are stored securely in browser `chrome.storage.local`.
