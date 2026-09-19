// Hunter Job Clipper — Background Service Worker (Manifest V3)

const DEFAULT_API_URL = "http://localhost:5000";

// On installation, set defaults and create context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["hunter_api_url"], (data) => {
    if (!data.hunter_api_url) {
      chrome.storage.local.set({ hunter_api_url: DEFAULT_API_URL });
    }
  });

  // Create context menu for quick selection clipping
  chrome.contextMenus.create({
    id: "hunter-clip-selection",
    title: "Clip selection to Hunter notes",
    contexts: ["selection"],
  });
});

// Context menu click listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "hunter-clip-selection" && info.selectionText) {
    chrome.storage.local.set({ hunter_pending_notes: info.selectionText.trim() });
  }
});
