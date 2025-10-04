// popup.js - Handles the extension popup UI and API calls

const API_URL = 'http://localhost:3000'; // Change to your deployed backend URL

// Check if we're on a YouTube page
async function checkYouTubePage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url || !tab.url.includes('youtube.com/watch')) {
    document.getElementById('notYouTube').style.display = 'block';
    document.getElementById('youtubeContent').style.display = 'none';
    return false;
  }
  
  document.getElementById('notYouTube').style.display = 'none';
  document.getElementById('youtubeContent').style.display = 'block';
  return true;
}

// Extract video URL and title from current tab
async function getVideoInfo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Execute script in the page to get video title
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
      return {
        url: window.location.href,
        title: titleElement ? titleElement.textContent.trim() : 'YouTube Video'
      };
    }
  });
  
  return result.result;
}

// Call backend API to summarize video
async function summarizeVideo(videoUrl) {
  try {
    const response = await fetch(`${API_URL}/summarizer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: videoUrl })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}

// Render markdown-like text to HTML
function renderMarkdown(text) {
  // Simple markdown rendering
  let html = text;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive list items in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul')) {
      return para;
    }
    return `<p>${para}</p>`;
  }).join('\n');
  
  return html;
}

// Initialize popup
async function init() {
  const isYouTube = await checkYouTubePage();
  
  if (!isYouTube) return;
  
  // Get and display video info
  const videoInfo = await getVideoInfo();
  document.getElementById('videoTitle').textContent = videoInfo.title;
  
  // Store video info for later use
  window.currentVideoUrl = videoInfo.url;
  window.currentVideoTitle = videoInfo.title;
  
  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const copyBtn = document.getElementById('copyBtn');
  const openWebBtn = document.getElementById('openWebBtn');
  
  summarizeBtn.addEventListener('click', handleSummarize);
  copyBtn.addEventListener('click', handleCopy);
  openWebBtn.addEventListener('click', handleOpenWeb);
}

async function handleSummarize() {
  const summarizeBtn = document.getElementById('summarizeBtn');
  const summarySection = document.getElementById('summarySection');
  const errorSection = document.getElementById('errorSection');
  
  // Reset UI
  summarySection.style.display = 'none';
  errorSection.style.display = 'none';
  
  // Show loading state
  summarizeBtn.disabled = true;
  summarizeBtn.innerHTML = `
    <div class="spinner"></div>
    Generating Summary...
  `;
  
  try {
    const result = await summarizeVideo(window.currentVideoUrl);
    
    // Display summary
    const summaryText = document.getElementById('summaryText');
    summaryText.innerHTML = renderMarkdown(result.summary_text || result.summary);
    summarySection.style.display = 'block';
    
    // Store summary for copy/share
    window.currentSummary = result.summary_text || result.summary;
    
  } catch (error) {
    // Show error
    const errorText = document.getElementById('errorText');
    errorText.textContent = 'Failed to generate summary. Please make sure the video has captions/subtitles enabled.';
    errorSection.style.display = 'block';
  } finally {
    // Reset button
    summarizeBtn.disabled = false;
    summarizeBtn.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Summarize Video
    `;
  }
}

function handleCopy() {
  if (!window.currentSummary) return;
  
  navigator.clipboard.writeText(window.currentSummary).then(() => {
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = 'rgba(34, 197, 94, 0.2)';
    copyBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    copyBtn.style.color = '#4ade80';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
      copyBtn.style.borderColor = '';
      copyBtn.style.color = '';
    }, 2000);
  });
}

function handleOpenWeb() {
  // Open QuickVid website with the current video URL pre-filled
  const webUrl = `https://quickvid.example.com/?url=${encodeURIComponent(window.currentVideoUrl)}`;
  chrome.tabs.create({ url: webUrl });
}

// Start the popup
init();
