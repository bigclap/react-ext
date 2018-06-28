/* eslint-disable no-undef */

// Saves options to chrome.storage
function saveOptions() {
  const apiKey = document.getElementById('api_key').value;
  const server = document.getElementById('server').value;
  chrome.storage.sync.set({
    YOUTUBE_API3_KEY: apiKey,
    BACKEND_HOST: server,
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    YOUTUBE_API3_KEY: 'AIzaSyCiKee1Aan7PvmXVFKDvI018GO9Cx6Itoo',
    BACKEND_HOST: 'http://208.69.117.88:3000/v1',
  }, (items) => {
    document.getElementById('api_key').value = items.YOUTUBE_API3_KEY;
    document.getElementById('server').value = items.BACKEND_HOST;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);
