// content.js - Injects QuickVid button into YouTube pages

(function() {
  'use strict';

  // Configuration
  const API_URL = 'http://localhost:3000'; // Change to your deployed backend URL
  let quickvidButton = null;
  let summaryPanel = null;

  // Wait for YouTube page to load
  function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        callback(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Create QuickVid button
  function createQuickVidButton() {
    if (quickvidButton) return;

    const button = document.createElement('button');
    button.id = 'quickvid-btn';
    button.className = 'quickvid-summarize-btn';
    button.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>QuickVid Summary</span>
    `;
    
    button.addEventListener('click', handleSummarizeClick);
    quickvidButton = button;
    
    return button;
  }

  // Create summary panel
  function createSummaryPanel() {
    if (summaryPanel) return summaryPanel;

    const panel = document.createElement('div');
    panel.id = 'quickvid-panel';
    panel.className = 'quickvid-summary-panel';
    panel.innerHTML = `
      <div class="quickvid-panel-header">
        <div class="quickvid-panel-title">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>QuickVid Summary</span>
        </div>
        <button class="quickvid-close-btn" id="quickvid-close">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="quickvid-panel-content" id="quickvid-content">
        <div class="quickvid-loading">
          <div class="quickvid-spinner"></div>
          <p>Generating AI summary...</p>
        </div>
      </div>
      <div class="quickvid-panel-footer">
        <button class="quickvid-action-btn" id="quickvid-copy">Copy Summary</button>
        <button class="quickvid-action-btn quickvid-primary" id="quickvid-save">Save to Account</button>
      </div>
    `;

    // Add event listeners
    panel.querySelector('#quickvid-close').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    panel.querySelector('#quickvid-copy').addEventListener('click', handleCopySummary);
    panel.querySelector('#quickvid-save').addEventListener('click', handleSaveToAccount);

    summaryPanel = panel;
    return panel;
  }

  // Inject button into YouTube page
  function injectButton() {
    // Wait for YouTube's action buttons container
    waitForElement('#top-level-buttons-computed', (container) => {
      const button = createQuickVidButton();
      
      // Insert button before the first child
      if (container.firstChild) {
        container.insertBefore(button, container.firstChild);
      } else {
        container.appendChild(button);
      }
    });
  }

  // Inject summary panel
  function injectPanel() {
    waitForElement('ytd-watch-flexy', (watchContainer) => {
      const panel = createSummaryPanel();
      document.body.appendChild(panel);
    });
  }

  // Get current video URL
  function getCurrentVideoUrl() {
    return window.location.href;
  }

  // Get current video title
  function getCurrentVideoTitle() {
    const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
    return titleElement ? titleElement.textContent.trim() : 'YouTube Video';
  }

  // Handle summarize button click
  async function handleSummarizeClick() {
    const panel = summaryPanel || createSummaryPanel();
    panel.style.display = 'block';
    
    const contentDiv = document.getElementById('quickvid-content');
    contentDiv.innerHTML = `
      <div class="quickvid-loading">
        <div class="quickvid-spinner"></div>
        <p>Generating AI summary...</p>
      </div>
    `;

    const videoUrl = getCurrentVideoUrl();
    
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
      const summary = data.summary_text || data.summary;
      
      // Store summary globally for copy/save functions
      window.quickvidCurrentSummary = {
        text: summary,
        videoUrl: videoUrl,
        videoTitle: getCurrentVideoTitle()
      };

      // Display summary
      contentDiv.innerHTML = `
        <div class="quickvid-summary-text">${renderMarkdown(summary)}</div>
      `;
      
    } catch (error) {
      console.error('QuickVid error:', error);
      contentDiv.innerHTML = `
        <div class="quickvid-error">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>Failed to Generate Summary</h3>
          <p>Make sure the video has captions/subtitles enabled. Try another video or refresh the page.</p>
        </div>
      `;
    }
  }

  // Handle copy summary
  function handleCopySummary() {
    if (!window.quickvidCurrentSummary) return;
    
    navigator.clipboard.writeText(window.quickvidCurrentSummary.text).then(() => {
      const btn = document.getElementById('quickvid-copy');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = '#22c55e';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 2000);
    });
  }

  // Handle save to account
  function handleSaveToAccount() {
    if (!window.quickvidCurrentSummary) return;
    
    // Open QuickVid website with the summary (user can sign in and save there)
    const webUrl = `https://quickvid.example.com/?url=${encodeURIComponent(window.quickvidCurrentSummary.videoUrl)}`;
    window.open(webUrl, '_blank');
  }

  // Simple markdown renderer
  function renderMarkdown(text) {
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
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (para.startsWith('<h') || para.startsWith('<ul')) {
        return para;
      }
      return para ? `<p>${para}</p>` : '';
    }).join('\n');
    
    return html;
  }

  // Initialize when on a video page
  function init() {
    const isVideoPage = window.location.pathname === '/watch';
    
    if (isVideoPage) {
      injectButton();
      injectPanel();
    }
  }

  // Listen for YouTube navigation (SPA routing)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      
      // Remove old button and panel
      if (quickvidButton) {
        quickvidButton.remove();
        quickvidButton = null;
      }
      if (summaryPanel) {
        summaryPanel.remove();
        summaryPanel = null;
      }
      
      // Re-initialize if on video page
      setTimeout(init, 1000); // Wait for YouTube to render
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
