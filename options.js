// options.js
document.addEventListener('DOMContentLoaded', function () {
    const saveOptionsButton = document.getElementById('saveOptions');
    const searchEngineUrlSelect = document.getElementById('searchEngineUrl');
    const customSearchEngineInput = document.getElementById('customSearchEngine');
    const addCustomSearchEngineButton = document.getElementById('addCustomSearchEngine');
    const deleteCustomSearchEngineButton = document.getElementById('deleteCustomSearchEngine');
    // Load saved options on options page load
    chrome.storage.sync.get(['searchEngineUrl', 'customSearchEngines'], function (result) {
      const savedSearchEngineUrl = result.searchEngineUrl;
      const customSearchEngines = result.customSearchEngines || [];
      if (savedSearchEngineUrl) {
        searchEngineUrlSelect.value = savedSearchEngineUrl;
      }
      // Populate custom search engines in the dropdown
      customSearchEngines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine.url;
        option.text = engine.name;
        searchEngineUrlSelect.add(option);
      });
    });
    saveOptionsButton.addEventListener('click', function () {
      const searchEngineUrl = searchEngineUrlSelect.value;
      chrome.storage.sync.set({ searchEngineUrl: searchEngineUrl }, function () {
        console.log('Options saved');
      });
    });
    addCustomSearchEngineButton.addEventListener('click', function () {
      const customSearchEngineUrl = customSearchEngineInput.value.trim();
      const customSearchEngineName = prompt('Enter a name for the custom search engine:');
      if (customSearchEngineUrl && customSearchEngineName) {
        const option = document.createElement('option');
        option.value = customSearchEngineUrl;
        option.text = customSearchEngineName;
        searchEngineUrlSelect.add(option);
        customSearchEngineInput.value = '';
        // Save the custom search engine in storage
        chrome.storage.sync.get(['customSearchEngines'], function (result) {
          const customSearchEngines = result.customSearchEngines || [];
          customSearchEngines.push({ name: customSearchEngineName, url: customSearchEngineUrl });
          chrome.storage.sync.set({ customSearchEngines: customSearchEngines }, function () {
            console.log('Custom search engine added');
          });
        });
      }
    });
    deleteCustomSearchEngineButton.addEventListener('click', function () {
      const selectedOption = searchEngineUrlSelect.options[searchEngineUrlSelect.selectedIndex];
      if (selectedOption && confirm('Are you sure you want to delete this custom search engine?')) {
        searchEngineUrlSelect.remove(searchEngineUrlSelect.selectedIndex);
        // Remove the custom search engine from storage
        chrome.storage.sync.get(['customSearchEngines'], function (result) {
          const customSearchEngines = result.customSearchEngines || [];
          const selectedIndex = searchEngineUrlSelect.selectedIndex;
          if (selectedIndex !== -1) {
            customSearchEngines.splice(selectedIndex, 1);
            chrome.storage.sync.set({ customSearchEngines: customSearchEngines }, function () {
              console.log('Custom search engine deleted');
            });
          }
        });
      }
    });
  });
  