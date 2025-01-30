let activeWebsite = null;
let activeStartTime = Date.now();
let timeSpentData = {};

// Update active website and calculate time spent
function updateActiveWebsite(newWebsite) {
  const now = Date.now();

  if (activeWebsite) {
    const timeSpent = now - activeStartTime;
    if (!timeSpentData[activeWebsite]) {
      timeSpentData[activeWebsite] = 0;
    }
    timeSpentData[activeWebsite] += timeSpent;
  }

  // Only update the active website if the newWebsite is valid
  if (newWebsite && newWebsite !== 'Unknown or Internal Page') {
    activeWebsite = newWebsite;
    activeStartTime = now;

    // Save updated data to storage
    chrome.storage.local.set({ timeSpentData });
  }
}

// Get active tab's URL
function getActiveTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabUrl = tabs[0].url;

      // Validate URL
      if (tabUrl && tabUrl.startsWith('http')) {
        try {
          const url = new URL(tabUrl).hostname;
          callback(url);
        } catch (e) {
          callback(null); // Do not pass fallback text
        }
      } else {
        callback(null); // Do not pass fallback text
      }
    }
  });
}

// Monitor tab activation
chrome.tabs.onActivated.addListener(() => {
  getActiveTabUrl((url) => {
    updateActiveWebsite(url);
  });
});

// Monitor tab updates
chrome.tabs.onUpdated.addListener(() => {
  getActiveTabUrl((url) => {
    updateActiveWebsite(url);
  });
});

// Initialize time spent data on browser startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['timeSpentData'], (result) => {
    timeSpentData = result.timeSpentData || {};
  });
});
