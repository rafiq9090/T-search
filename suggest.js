document.addEventListener('DOMContentLoaded', () => {
    const searchQuery = document.getElementById('searchQuery');
    const suggestionsBox = document.getElementById('suggestionsBox');
  
    // Mock API for search suggestions (Replace with an actual API if available)
    async function fetchSuggestions(query) {
      const apiUrl = `https://api.datamuse.com/sug?s=${query}`;
      const response = await fetch(apiUrl);
      return response.json();
    }
  
    // Function to fetch browsing history
    function fetchBrowsingHistory(query) {
      return new Promise((resolve) => {
        chrome.history.search({ text: query, maxResults: 5 }, (historyItems) => {
          resolve(historyItems);
        });
      });
    }
  
    // Show suggestions based on user input
    searchQuery.addEventListener('input', async () => {
      const query = searchQuery.value.trim();
      if (query.length > 0) {
        // Fetch API suggestions
        const suggestions = await fetchSuggestions(query);
        // Fetch browsing history suggestions
        const historySuggestions = await fetchBrowsingHistory(query);
  
        suggestionsBox.innerHTML = ''; // Clear previous suggestions
  
        // Display browsing history suggestions with domain icons
        historySuggestions.forEach((historyItem) => {
          const historyItemElement = document.createElement('div');
          historyItemElement.className = 'suggestion-item'; // Add a class for styling
  
          // Extract the domain from the URL
          const url = new URL(historyItem.url);
          const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${url.hostname}`;
  
          // Icon (domain favicon)
          const icon = document.createElement('img');
          icon.src = faviconUrl; // Use the favicon URL
          icon.alt = 'Favicon';
          icon.className = 'suggestion-icon'; // Add a class for icon styling
  
          // Text (page title or URL)
          const text = document.createElement('span');
          text.textContent = historyItem.title || historyItem.url;
  
          // Append icon and text to the suggestion
          historyItemElement.appendChild(icon);
          historyItemElement.appendChild(text);
  
          historyItemElement.addEventListener('click', () => {
            searchQuery.value = historyItem.url; // Set the clicked history suggestion in the input
            suggestionsBox.style.display = 'none'; // Hide suggestions
            window.location.href = historyItem.url; // Open the clicked URL in the current tab
          });
  
          suggestionsBox.appendChild(historyItemElement);
        });
  
        // Display API suggestions without icons
        suggestions.forEach((suggestion) => {
          const suggestionItem = document.createElement('div');
          suggestionItem.className = 'suggestion-item'; // Add a class for styling
          suggestionItem.textContent = suggestion.word;
  
          suggestionItem.addEventListener('click', () => {
            searchQuery.value = suggestion.word; // Set the clicked suggestion in the input
            suggestionsBox.style.display = 'none'; // Hide suggestions
          });
  
          suggestionsBox.appendChild(suggestionItem);
        });
  
        suggestionsBox.style.display = 'block'; // Show suggestions
      } else {
        suggestionsBox.style.display = 'none'; // Hide suggestions when input is empty
      }
    });
  
    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
      if (!suggestionsBox.contains(event.target) && event.target !== searchQuery) {
        suggestionsBox.style.display = 'none';
      }
    });
  });

  

    // Detect Browser
    function detectBrowser() {
      const userAgent = navigator.userAgent;
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        return "chrome";
      } else if (userAgent.includes("Edg")) {
        return "edge";
      } else if (userAgent.includes("Brave")) {
        return "brave";
      } 
      else if (userAgent.includes("opera")) { 
        return "opera";
      }
      else if (userAgent.includes("Firefox")) {
        return "firefox";
      }
      else if (userAgent.includes("Vivaldi")) {
        return "vivaldi";
      }
      else if (userAgent.includes("Safari")) {
        return "safari";
      }
      else if (userAgent.includes("ucbrowser")) {
        return "ucbrowser";
      }
      else {
        return "default";
      }
    }
  
    // Apply Browser-Specific Styles
    function applyBrowserStyles() {
      const browser = detectBrowser();
      if (browser === "chrome") {
        suggestionsBox.classList.add("chrome-style");
      } else if (browser === "edge") {
        suggestionsBox.classList.add("edge-style");
      } else if (browser === "brave") {
        suggestionsBox.classList.add("brave-style");
      } 
      else if (browser === "opera") {
        suggestionsBox.classList.add("opera-style");
      }
      else if (browser === "firefox") {
        suggestionsBox.classList.add("firefox-style");
      }
      else if (browser === "vivaldi") {
        suggestionsBox.classList.add("vivaldi-style");
      }
      else if (browser === "safari") {
        suggestionsBox.classList.add("safari-style");
      }
      else if (browser === "ucbrowser") {
        suggestionsBox.classList.add("ucbrowser-style");
      }  
      else {
        suggestionsBox.classList.add("default-style");
      }
    }
  
    applyBrowserStyles(); // Apply styles based on detected browser
  

  