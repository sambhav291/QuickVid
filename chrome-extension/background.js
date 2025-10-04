// background.js - Service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickVid extension installed!');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSummary') {
    // Handle summary requests if needed
    console.log('Summary requested for:', request.url);
  }
  
  return true;
});

// Optional: Add context menu for quick summarize
chrome.contextMenus.create({
  id: 'quickvid-summarize',
  title: 'Summarize with QuickVid',
  contexts: ['page'],
  documentUrlPatterns: ['*://www.youtube.com/watch*', '*://youtube.com/watch*']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'quickvid-summarize') {
    // Send message to content script to trigger summarization
    chrome.tabs.sendMessage(tab.id, { action: 'summarize' });
  }
});
