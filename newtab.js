// Define the referral parameter
var referralParam = 'utm_source=chrome_extension&utm_medium=referral&utm_campaign=T_Search';
var logoElement;
// Log the referral parameter to the console
console.log('Referral Parameter:', referralParam);

// Check if search engine URL is set in Chrome storage, if not, set default to Google
chrome.storage.sync.get(['searchEngineUrl'], function(result) {
  var searchEngineUrl = result.searchEngineUrl;
  if (!searchEngineUrl) {
    searchEngineUrl = 'https://233.us.mybestsearcher.com/search/?sid=233&query=';
    // Set the default search engine URL in Chrome storage
    chrome.storage.sync.set({ 'searchEngineUrl': searchEngineUrl });
  }
});

// Add event listener for keypress event on the search input field
document.getElementById('searchQuery').addEventListener('keypress', function(event) {
  // Check if the pressed key is Enter (key code 13)
  if (event.key === 'Enter') {
    // Prevent the default form submission behavior
    event.preventDefault();  
    // Call the search function
    performSearch();
  }
});
// Add event listener for click event on the search button
document.getElementById('searchButton').addEventListener('click', performSearch);
// Function to perform the search
function performSearch() {
  // Get the search query from the input field
  var searchQuery = document.getElementById('searchQuery').value.trim();
  // Check if search query is not empty
  if (searchQuery) {
    // Retrieve the selected search engine URL from Chrome storage
    chrome.storage.sync.get(['searchEngineUrl'], function(result) {
      var searchEngineUrl = result.searchEngineUrl;
      // Perform the search action using the selected search engine URL
      window.location.href = searchEngineUrl + encodeURIComponent(searchQuery);
    });
  } else {
    alert("Please enter a search query.");
  }
}
function updateDateTime() {
  var now = new Date();
  var dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};
  var timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var dateString = now.toLocaleDateString(undefined, dateOptions);
  var timeString = now.toLocaleTimeString(undefined, timeOptions);
  document.getElementById("AndTime").innerText = timeString;
  document.getElementById("dateAnd").innerText = dateString;
}
updateDateTime();
setInterval(updateDateTime, 1000);
document.getElementById('addWebsiteButton').addEventListener('click', function() {
  document.getElementById('websiteDialog').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
});
document.getElementById('overlay').addEventListener('click', function() {
  document.getElementById('websiteDialog').style.display = 'none';
  this.style.display = 'none';
});
document.getElementById('addWebsiteButtonDialog').addEventListener('click', function() {
  addWebsiteLink();
  document.getElementById('websiteDialog').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
});
function addWebsiteLink() {
  var url = document.getElementById("websiteUrlDialog").value.trim(); // Trim any leading or trailing whitespace
  if (!url) {
    alert("URL cannot be empty.");
    return;
  }
  // Check if the URL is valid by attempting to create a URL object
  try {
    var parsedUrl = new URL(url);
  } catch (error) {
    console.error("Invalid URL:", error.message);
    alert("Invalid URL. Please enter a valid URL.");
    return;
  }
  var name = parsedUrl.hostname;
  var websiteDetails = { url: parsedUrl.href, name: name }; // Use parsedUrl.href for the full URL
  localStorage.setItem('website_' + name, JSON.stringify(websiteDetails));
  loadWebsiteLinks();
}

function loadWebsiteLinks() {
  var websiteList = document.getElementById("websiteList");
  websiteList.innerHTML = '';

  // Create an array to store website details
  var websiteDetailsArray = [];

  // Retrieve website details from localStorage and push them to the array
  for (var key in localStorage) {
    if (key.startsWith('website_')) {
      var websiteDetails = JSON.parse(localStorage.getItem(key));
      websiteDetailsArray.push({
        key: key,
        details: websiteDetails
      });
    }
  }
  // Sort the website details based on visit count in descending order
  websiteDetailsArray.sort((a, b) => b.details.visitCount - a.details.visitCount);

  // Limit the display to a maximum of 12 website links
  var displayedWebsites = websiteDetailsArray.slice(0, 12);
  // Loop through the sorted and limited website details to create containers
  displayedWebsites.forEach(function(websiteItem) {
    var container = document.createElement('div');
    container.classList.add('website-container');
    container.style.margin = '10px';
    container.style.cursor = 'pointer';

    container.addEventListener('mouseover', function() {
      deleteButton.style.visibility ='visible';
  
    
    });
    container.addEventListener('mouseout', function() {
      deleteButton.style.visibility ='hidden';
  
     
    });

    // Add click event listener to the container to open the website in a new tab
    container.addEventListener('click', () => {
      window.open(websiteItem.details.url, '_blank');
    });
    var linkElement = document.createElement('a');
    linkElement.href = websiteItem.details.url;
    linkElement.textContent = websiteItem.details.name;
    linkElement.target = "_blank";

    logoElement = document.createElement('img');
    logoElement.src = `https://logo.clearbit.com/${websiteItem.details.name}`;
    logoElement.alt = websiteItem.details.name + " logo";
    logoElement.classList.add('website-logo');

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.key = websiteItem.key;
    deleteButton.style.width = '90px';
    deleteButton.style.textAlign = 'center';
    deleteButton.style.padding = '3px';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '8px';
    deleteButton.style.backgroundColor = '#000011';
    deleteButton.style.color = '#fff';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.fontSize = '12px'; // Adjust font size
    
    deleteButton.style.opacity='.7'
    deleteButton.style.visibility='hidden';

    deleteButton.addEventListener('mouseover', function() {
      this.style.color = '#fff'; // Change color on mouseover
      this.style.backgroundColor = '#000055';
    });
    deleteButton.addEventListener('mouseout', function() {
      this.style.color = '#fff'; // Reset color on mouseout
      this.style.backgroundColor = '#000011';
  
      
    });
    function removeHistoryItem(url) {
      // Define a query object to specify the search criteria for the history item
      var query = { url: url };
  
      // Use chrome.history.deleteUrl() to remove the history item with the specified URL
      chrome.history.deleteUrl(query, function() {
          console.log('History item removed:', url);
      });
  }
    deleteButton.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent click event propagation to the container

      var key = deleteButton.dataset.key; // Retrieve the data-key attribute value
      var websiteDetails = JSON.parse(localStorage.getItem(key)); // Get website details
      var url = websiteDetails.url; // Extract URL from website details

      // Remove website link from localStorage
      localStorage.removeItem(key);
      // Remove associated history item
      removeHistoryItem(url);
      
      // Reload website links after deletion
      loadWebsiteLinks();
    });

    container.appendChild(linkElement);
    container.appendChild(logoElement);
    container.appendChild(deleteButton);
    websiteList.appendChild(container);
  });
}

window.addEventListener('load', loadWebsiteLinks);
function deleteWebsiteLink(key) {
  localStorage.removeItem(key);
  loadWebsiteLinks();
}

// Function to perform search
function performSearch() {
  // Get the search query from the input field
  var searchQuery = document.getElementById('searchQuery').value.trim();
  if (searchQuery === '') {
    return; // Do nothing if search query is empty
  }

  try {
    var parsedUrl = new URL(searchQuery);
    var searchCount = localStorage.getItem(parsedUrl.hostname + "_count");
    if (!searchCount) {
      searchCount = 1;
    } else {
      searchCount = Number(searchCount) + 1;    
    }
    localStorage.setItem(parsedUrl.hostname + "_count", searchCount);
    
    // If the URL has been searched 3 times, add it to the website list
    if (searchCount === 3) {
      addWebsiteLink(parsedUrl.href, parsedUrl.hostname);
    }
  } catch (error) {
    // Not a valid URL, so don't count
  }

  // Get the search engine URL from Chrome storage
  chrome.storage.sync.get(['searchEngineUrl'], function(result) {
    var searchEngineUrl = result.searchEngineUrl;
    // Construct the final search URL with the referral parameter
    var finalUrl = searchEngineUrl + encodeURIComponent(searchQuery) + '&' + referralParam;
    // Log the final URL to the console
    console.log('Final URL:', finalUrl);
    // Redirect to the search engine URL
    window.location.href = finalUrl;
  });
}

// Modified function to add website link
function addWebsiteLink(url, name) {
  if (!url || !name) {
    url = document.getElementById("websiteUrlDialog").value.trim(); // Trim any leading or trailing whitespace
    if (!url) {
      alert("URL cannot be empty.");
      return;
    }

    // Check if the URL is valid by attempting to create a URL object
    try {
      var parsedUrl = new URL(url);
      name = parsedUrl.hostname;
    } catch (error) {
      console.error("Invalid URL:", error.message);
      alert("Invalid URL. Please enter a valid URL.");
      return;
    }
  }

  // Check if the website link already exists
  var existingLinks = Object.keys(localStorage).filter(function(key) {
    return key.startsWith('website_');
  }).map(function(key) {
    return JSON.parse(localStorage.getItem(key)).name; // Extract name instead of URL
  });

  // if (existingLinks.includes(name)) { // Check if the name already exists
  //   console.log("This website link already exists.");
  //   return;
  // }

  var websiteDetails = { url: url, name: name };
  localStorage.setItem('website_' + name, JSON.stringify(websiteDetails));
  // Reset the count for this website now that it has been added
  localStorage.removeItem(name + '_count');
  loadWebsiteLinks();
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "displayWebsiteList") {
    // Code to display website list
    const websiteList = Object.keys(visitCount).filter(url => isVisitedThreeTimes(url));
    // Update your UI to display the websiteList
    console.log(websiteList); // Just for demonstration, replace this with your actual UI update code
  }
});

// Define a function to log the browser history

// Define an array to store search engine URLs
var searchEngineUrls = [];

// Add the default search engine URL to the array
searchEngineUrls.push('https://www.google.com/');

// Function to add search engine URL to the array
function addSearchEngineUrl(url) {
    if (!searchEngineUrls.includes(url)) {
        searchEngineUrls.push(url);
    }
}

// Function to check if a URL is a search engine URL
function isSearchEngineUrl(url) {
    return searchEngineUrls.some(function(searchEngineUrl) {
        return url.includes(searchEngineUrl);
    });
}

// Function to log browser history and add website links
function logBrowserHistory() {
    // Define a query object to specify the search criteria
    var query = {
        text: '', // Search text (empty to retrieve all history items)
        startTime: 0, // Start time (Unix timestamp in milliseconds, 0 for all history)
        maxResults: 100 // Maximum number of results to retrieve
    };

    // Use chrome.history.search() to retrieve history items based on the query
    chrome.history.search(query, function(historyItems) {
        // Loop through the retrieved history items
        historyItems.forEach(function(historyItem) {
            var name = historyItem.url;
            var convert = new URL(name).hostname;
           // var shortName = convert.split('.')[1].toUpperCase();

            // Log each history item to the console
            console.log('URL:', historyItem.url);
            console.log('Title:', convert);
            console.log('Last Visit Time:', new Date(historyItem.lastVisitTime));
            console.log('Visit Count:', historyItem.visitCount);
            console.log('------------------------');

            // Check if the URL is not a search engine URL and has been visited three times
            if (historyItem.visitCount === 3 && !isSearchEngineUrl(historyItem.url)) {
                addWebsiteLink(historyItem.url,convert );
            }
        });
    });
}

// Call the logBrowserHistory function to retrieve and log the browser history
logBrowserHistory();


// suggetion keyword section


function getHistoryKeywords() {
  return new Promise((resolve, reject) => {
    chrome.history.search({ text: '', maxResults: 100 }, (historyItems) => {
      const keywords = [];
      historyItems.forEach((historyItem) => {
        // Extract keywords from website URLs
        const url = new URL(historyItem.url);
        const hostname = url.hostname;
        const hostnameParts = hostname.split('.');
        keywords.push(hostname);
      });
      resolve(keywords);
    });
  });
}

document.getElementById('searchQuery').addEventListener('input', async function(event) {
  const searchQuery = event.target.value.trim().toLowerCase(); // Get the search query and convert to lowercase
  const suggestionList = document.getElementById('suggestionList');

  // Clear previous suggestions
  suggestionList.innerHTML = '';

  // Fetch keywords from browser history
  const keywords = await getHistoryKeywords();

  // Filter keywords based on the current search query
  const filteredKeywords = keywords.filter(keyword => keyword.startsWith(searchQuery));

  // Display suggestions
  filteredKeywords.forEach(keyword => {
    const suggestionItem = document.createElement('div');
    suggestionItem.textContent = keyword;
    suggestionItem.classList.add('suggestion');
    suggestionItem.addEventListener('click', () => {
      // Set the clicked suggestion as the search query
      document.getElementById('searchQuery').value = keyword;
      suggestionList.innerHTML = ''; // Clear suggestion list
    });
    suggestionList.appendChild(suggestionItem);
  });
});
