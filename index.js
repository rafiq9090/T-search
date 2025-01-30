document.addEventListener('DOMContentLoaded', () => {
  const timeSpentList = document.getElementById('timeSpentList');

  // Function to format time into human-readable format
  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      return `${Math.floor(seconds / 31536000)} year${Math.floor(seconds / 31536000) !== 1 ? 's' : ''}`;
    }
  }

  // Function to display time spent data
  function displayTimeSpent() {
    timeSpentList.innerHTML = ''; // Clear previous data

    // Fetch time spent data from storage
    chrome.storage.local.get(['timeSpentData'], (result) => {
      const timeSpentData = result.timeSpentData || {};

      // Sort websites by time spent (descending order)
      const sortedData = Object.entries(timeSpentData).sort((a, b) => b[1] - a[1]);

      // Display the data
      sortedData.forEach(([website, timeSpent], index) => {
        const timeSpentSeconds = Math.floor(timeSpent / 1000);
        const timeSpentItem = document.createElement('div');
        timeSpentItem.className = index === 0 ? 'most-spent' : '';

        // Wrap website in a clickable link
        timeSpentItem.innerHTML = `
          <a href="https://${website}" target="_blank" style="text-decoration: none; color: inherit;">
            <span>${website}</span>
          </a>
          <span>${formatTime(timeSpentSeconds)}</span>
        `;
        timeSpentList.appendChild(timeSpentItem);
      });
    });
  }

  // Initialize display
  displayTimeSpent();
});
