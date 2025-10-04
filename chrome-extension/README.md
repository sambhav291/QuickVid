# QuickVid Chrome Extension

Transform YouTube videos into AI-powered summaries directly from your browser!

## Features

✨ **One-Click Summarization** - Click the QuickVid button on any YouTube video  
📱 **Popup Interface** - Quick access from Chrome toolbar  
🎯 **In-Page Integration** - Summary panel appears right on YouTube  
🔒 **Privacy-Focused** - Same encryption as the web app  
⚡ **Lightning Fast** - AI summaries in seconds  
📋 **Copy & Share** - Easily copy or save summaries  

---

## Installation (Development)

### Prerequisites
- Google Chrome or Chromium-based browser
- QuickVid backend running (see backend setup)

### Steps

1. **Copy Extension Folder**
   ```bash
   # The extension is in: chrome-extension/
   ```

2. **Add Icons**
   - Add your QuickVid logo as:
     - `icons/icon16.png` (16x16)
     - `icons/icon48.png` (48x48)
     - `icons/icon128.png` (128x128)
   - Or copy from: `frontend/public/QuickVid logo.png` and resize

3. **Update API URL**
   
   Edit these files and replace `http://localhost:3000` with your deployed backend URL:
   
   **popup.js** (line 3):
   ```javascript
   const API_URL = 'https://your-backend.herokuapp.com'; // Your deployed backend
   ```
   
   **content.js** (line 6):
   ```javascript
   const API_URL = 'https://your-backend.herokuapp.com'; // Your deployed backend
   ```

4. **Load Extension in Chrome**
   
   1. Open Chrome and go to: `chrome://extensions/`
   2. Enable **Developer mode** (toggle in top-right)
   3. Click **Load unpacked**
   4. Select the `chrome-extension` folder
   5. ✅ Extension is now installed!

---

## Usage

### Method 1: In-Page Button

1. **Navigate to any YouTube video**
2. **Look for the "QuickVid Summary" button** below the video (next to Like/Share buttons)
3. **Click it** → Summary panel slides in from the right
4. **Read, copy, or save** your summary

### Method 2: Extension Popup

1. **Click the QuickVid icon** in Chrome toolbar
2. **On a YouTube video page**, it shows current video info
3. **Click "Summarize Video"** → Summary appears in popup
4. **Copy or open in web app** to save

### Method 3: Right-Click Menu

1. **Right-click anywhere on a YouTube video page**
2. **Select "Summarize with QuickVid"** from context menu
3. **Summary panel appears** automatically

---

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Popup UI (click extension icon)
├── popup.js              # Popup logic
├── content.js            # YouTube page injection
├── content.css           # YouTube page styles
├── background.js         # Service worker (background tasks)
└── icons/
    ├── icon16.png        # Toolbar icon (16x16)
    ├── icon48.png        # Extension manager (48x48)
    └── icon128.png       # Chrome Web Store (128x128)
```

---

## How It Works

### Architecture

```
┌─────────────────────┐
│   YouTube Page      │
│                     │
│  [QuickVid Button]  │ ◄── content.js injects button
│                     │
│  [Summary Panel]    │ ◄── Shows summary here
└──────────┬──────────┘
           │
           │ Click button
           ↓
┌─────────────────────┐
│   Content Script    │
│   (content.js)      │
├─────────────────────┤
│ 1. Get video URL    │
│ 2. Call API         │ ──────┐
│ 3. Display summary  │       │
└─────────────────────┘       │
                              │ HTTP POST
                              ↓
                     ┌─────────────────────┐
                     │  QuickVid Backend   │
                     │  (Your API)         │
                     ├─────────────────────┤
                     │ 1. Fetch transcript │
                     │ 2. Summarize w/ AI  │
                     │ 3. Return summary   │
                     └─────────────────────┘
```

### Key Components

**manifest.json**
- Defines extension permissions and configuration
- Specifies content scripts and background worker
- Sets up icons and popup

**content.js**
- Injects QuickVid button into YouTube pages
- Creates summary panel (slides in from right)
- Calls backend API to generate summaries
- Handles copy/save actions

**popup.js**
- Manages extension popup UI
- Detects if user is on YouTube
- Summarizes current video
- Allows copy/open in web

**background.js**
- Runs in background as service worker
- Adds right-click context menu
- Handles extension lifecycle

---

## Backend Integration

### API Endpoint Used

The extension calls your existing backend:

```javascript
POST http://localhost:3000/summarizer
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}

// Response:
{
  "video_url": "...",
  "summary_text": "...",
  "video_title": "...",
  "saved": false
}
```

### CORS Setup

**Important**: Your backend must allow requests from `chrome-extension://` origins.

Add to your backend (NestJS):

**File**: `backend/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Chrome extension
  app.enableCors({
    origin: [
      'http://localhost:3001',          // Local frontend
      'https://your-website.com',        // Production website
      /^chrome-extension:\/\//,          // Chrome extensions
    ],
    credentials: true,
  });
  
  await app.listen(3000);
}
```

---

## Publishing to Chrome Web Store

### 1. Prepare for Production

**Update manifest.json**:
```json
{
  "name": "QuickVid - YouTube Video Summarizer",
  "version": "1.0.0",
  "description": "Get AI-powered summaries of YouTube videos instantly. Save time and learn faster.",
  ...
}
```

**Update API URLs** in `popup.js` and `content.js`:
```javascript
const API_URL = 'https://your-deployed-backend.com';
```

**Update website URL** in `popup.html`:
```html
<a href="https://quickvid.com" target="_blank">Visit QuickVid Website</a>
```

### 2. Create Store Assets

Required:
- **Icons**: 16x16, 48x48, 128x128 PNG
- **Screenshots**: 1280x800 or 640x400 (min 1 screenshot)
- **Promo images** (optional):
  - Small: 440x280
  - Large: 920x680
  - Marquee: 1400x560

### 3. Create ZIP File

```bash
cd chrome-extension
zip -r quickvid-extension.zip . -x "*.DS_Store" -x "__MACOSX/*"
```

### 4. Submit to Chrome Web Store

1. Go to: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay one-time $5 developer fee (if first time)
3. Click **New Item**
4. Upload `quickvid-extension.zip`
5. Fill in:
   - **Store listing** (description, screenshots)
   - **Privacy practices** (what data you collect)
   - **Permissions** explanation
6. Submit for review (takes 1-3 days)

---

## Privacy & Permissions

### Permissions Explained

**activeTab**
- Allows reading current tab's URL
- Only when user clicks extension icon
- Does NOT track browsing history

**storage**
- Stores user preferences locally
- No data sent to servers
- Can be cleared anytime

**host_permissions (youtube.com)**
- Allows injecting QuickVid button
- Only works on YouTube pages
- Does NOT access other websites

### Data Collection

The extension:
- ✅ Sends video URLs to QuickVid API (for summarization only)
- ✅ Stores summaries locally (if user chooses)
- ❌ Does NOT track browsing history
- ❌ Does NOT collect personal information
- ❌ Does NOT share data with third parties

---

## Troubleshooting

### Extension not appearing on YouTube

**Issue**: Button doesn't show up on YouTube video pages

**Fix**:
1. Check if you're on a `/watch` URL (not homepage)
2. Refresh the page
3. Check Chrome DevTools console for errors
4. Verify `content.js` is loading: `chrome://extensions/` → Details → Inspect views

### API errors

**Issue**: "Failed to generate summary"

**Fix**:
1. Check backend is running: `http://localhost:3000` or your deployed URL
2. Verify CORS is enabled for `chrome-extension://` origins
3. Check video has captions/subtitles enabled
4. Open DevTools → Network tab → Check API response

### Popup shows "Not on YouTube"

**Issue**: Extension popup says you're not on YouTube

**Fix**:
- Navigate to an actual YouTube video: `https://www.youtube.com/watch?v=...`
- Not just YouTube homepage

### Summary panel doesn't close

**Issue**: Panel stays open even after clicking close

**Fix**:
1. Click the X button in panel header
2. Refresh the page
3. Reload extension: `chrome://extensions/` → Reload

---

## Development Tips

### Testing Locally

1. **Load unpacked extension** in Chrome
2. **Make changes** to code
3. **Reload extension**: `chrome://extensions/` → Reload button
4. **Refresh YouTube page** to see changes

### Debugging

**Content Script**:
```javascript
// Add to content.js
console.log('QuickVid: Button injected');
console.log('QuickVid: Video URL:', getCurrentVideoUrl());
```

**Popup**:
- Right-click extension icon → Inspect popup
- Check Console for errors

**Background Worker**:
- `chrome://extensions/` → Details → Inspect views: service worker

### Hot Reload (Advanced)

Install extension development tool:
```bash
npm install -g web-ext
cd chrome-extension
web-ext run --target chromium
```

---

## Roadmap

### Planned Features

- [ ] **Authentication** - Sign in from extension to save summaries
- [ ] **Sync across devices** - Access summaries anywhere
- [ ] **Custom prompts** - Change how AI summarizes
- [ ] **Timestamp markers** - Jump to specific video sections
- [ ] **Export to PDF/Markdown** - Save summaries as files
- [ ] **Keyboard shortcuts** - Quick summarize with hotkeys
- [ ] **Multi-language support** - Summaries in different languages
- [ ] **Offline mode** - Cache summaries for offline access

---

## Support

### Need Help?

- **Website**: [https://quickvid.com](https://quickvid.com)
- **Email**: sambhavmagotra009@gmail.com
- **LinkedIn**: [Sambhav Magotra](https://www.linkedin.com/in/sambhav-magotra-3a6187258)

### Report Issues

Found a bug? [Open an issue](https://github.com/sambhav291/QuickVid/issues)

---

## License

© 2025 QuickVid. All rights reserved.

---

**Built with ❤️ by Sambhav**
