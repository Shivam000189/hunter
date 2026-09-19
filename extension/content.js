// Hunter Job Clipper — Content Script

function cleanText(text) {
  return text ? text.replace(/\s+/g, " ").trim() : "";
}

function scrapeLinkedIn() {
  const roleEl =
    document.querySelector(".job-details-jobs-unified-top-card__job-title") ||
    document.querySelector(".jobs-unified-top-card__job-title") ||
    document.querySelector(".job-view-layout h1") ||
    document.querySelector("h1.t-24");

  const companyEl =
    document.querySelector(".job-details-jobs-unified-top-card__company-name") ||
    document.querySelector(".jobs-unified-top-card__company-name") ||
    document.querySelector(".job-details-jobs-unified-top-card__primary-description a") ||
    document.querySelector(".jobs-unified-top-card__subtitle-primary-grouping a");

  const descEl =
    document.querySelector("#job-details") ||
    document.querySelector(".jobs-description__content");

  return {
    role: cleanText(roleEl?.innerText || ""),
    company: cleanText(companyEl?.innerText || ""),
    notes: cleanText(descEl?.innerText?.slice(0, 1500) || ""),
  };
}

function scrapeIndeed() {
  const roleEl =
    document.querySelector("h1.jobsearch-JobInfoHeader-title") ||
    document.querySelector("h2.jobTitle");

  const companyEl =
    document.querySelector('[data-company-name="true"]') ||
    document.querySelector(".jobsearch-InlineCompanyRating-companyHeader a") ||
    document.querySelector(".jobsearch-InlineCompanyRating-companyHeader");

  const descEl = document.querySelector("#jobDescriptionText");

  return {
    role: cleanText(roleEl?.innerText || ""),
    company: cleanText(companyEl?.innerText || ""),
    notes: cleanText(descEl?.innerText?.slice(0, 1500) || ""),
  };
}

function scrapeGreenhouse() {
  const roleEl = document.querySelector(".app-title") || document.querySelector("h1");
  const companyEl = document.querySelector(".company-name");
  const descEl = document.querySelector("#content");

  return {
    role: cleanText(roleEl?.innerText || ""),
    company: cleanText(companyEl?.innerText || ""),
    notes: cleanText(descEl?.innerText?.slice(0, 1500) || ""),
  };
}

function scrapeLever() {
  const roleEl = document.querySelector(".posting-headline h2");
  const companyEl = document.querySelector(".posting-headline .posting-categories");
  const descEl = document.querySelector(".section.page-centered");

  return {
    role: cleanText(roleEl?.innerText || ""),
    company: cleanText(companyEl?.innerText || ""),
    notes: cleanText(descEl?.innerText?.slice(0, 1500) || ""),
  };
}

function scrapeGeneric() {
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
  const metaCompany =
    document.querySelector('meta[property="og:site_name"]')?.getAttribute("content") ||
    document.querySelector('meta[name="author"]')?.getAttribute("content");

  let company = metaCompany || "";
  let role = ogTitle || document.title || "";

  // Common title formats: "Role at Company", "Role - Company", "Company - Role"
  if (role.includes(" at ")) {
    const parts = role.split(" at ");
    role = parts[0];
    if (!company) company = parts[1];
  } else if (role.includes(" - ")) {
    const parts = role.split(" - ");
    if (parts.length >= 2) {
      role = parts[0];
      if (!company) company = parts[1];
    }
  } else if (role.includes(" | ")) {
    const parts = role.split(" | ");
    if (parts.length >= 2) {
      role = parts[0];
      if (!company) company = parts[1];
    }
  }

  // Check selection
  const selectedText = window.getSelection()?.toString() || "";

  return {
    role: cleanText(role),
    company: cleanText(company),
    notes: cleanText(selectedText.slice(0, 1500)),
  };
}

function extractJobDetails() {
  const host = window.location.hostname.toLowerCase();
  let details;

  if (host.includes("linkedin.com")) {
    details = scrapeLinkedIn();
  } else if (host.includes("indeed.com")) {
    details = scrapeIndeed();
  } else if (host.includes("greenhouse.io")) {
    details = scrapeGreenhouse();
  } else if (host.includes("lever.co")) {
    details = scrapeLever();
  } else {
    details = scrapeGeneric();
  }

  return {
    ...details,
    jobUrl: window.location.href,
  };
}

// Listen for popup request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_JOB_DETAILS") {
    try {
      const data = extractJobDetails();
      sendResponse({ success: true, data });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  }
  return true;
});
