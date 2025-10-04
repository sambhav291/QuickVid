# Chrome Extension Setup - Quick Guide

## Step-by-Step Installation

### 1. Create Extension Icons

You need 3 icon sizes. Use your QuickVid logo:

**Option A: Use existing logo**
```bash
# Copy your logo to icons folder
cd chrome-extension/icons
# Then resize using online tool or Photoshop to create:
# - icon16.png (16x16 pixels)
# - icon48.png (48x48 pixels)  
# - icon128.png (128x128 pixels)
```

**Option B: Generate icons online**
1. Go to: https://www.favicon-generator.org/
2. Upload `frontend/public/QuickVid logo.png`
3. Download generated icons
4. Rename and move to `chrome-extension/icons/`

**Icon Specifications**:
- Format: PNG with transparency
- Sizes: 16x16, 48x48, 128x128 pixels
- Clean, simple design (shows well at small sizes)

---

### 2. Update Backend for CORS

Your backend needs to accept requests from Chrome extensions.

**File**: `backend/src/main.ts`

Find this section:
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
```

**Replace with**:
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for website AND Chrome extension
  app.enableCors({
    origin: [
      'http://localhost:3001',           // Local frontend
      'https://quickvid.com',             // Production website (change to your domain)
      /^chrome-extension:\/\//,           // ALL Chrome extensions
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
  console.log('CORS enabled for Chrome extensions');
}
bootstrap();
```

**Restart Backend**:
```bash
cd backend
npm run start:dev
```

---

### 3. Update API URLs (IMPORTANT)

**For Local Testing**:

Keep as is (localhost):
- `popup.js` line 3: `const API_URL = 'http://localhost:3000';`
- `content.js` line 6: `const API_URL = 'http://localhost:3000';`

**For Production** (after deploying backend):

Replace with your deployed backend URL:

**popup.js**:
```javascript
const API_URL = 'https://quickvid-backend.herokuapp.com'; // Your backend URL
```

**content.js**:
```javascript
const API_URL = 'https://quickvid-backend.herokuapp.com'; // Your backend URL
```

**popup.html** (line ~200):
```html
<a href="https://quickvid.com" target="_blank">Visit QuickVid Website</a>
```

---

### 4. Load Extension in Chrome

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```
   Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode**
   - Toggle the switch in top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Navigate to: `Utube_video_summarizer/chrome-extension`
   - Click "Select Folder"

4. **Verify Installation**
   - ✅ QuickVid extension appears in list
   - ✅ Pin it to toolbar (click pin icon)
   - ✅ Icon shows in Chrome toolbar

---

### 5. Test Extension

#### Test 1: Popup
1. Click QuickVid icon in toolbar
2. Navigate to any YouTube video
3. Click QuickVid icon again
4. Should show video info and "Summarize Video" button
5. Click button → Summary should appear

#### Test 2: In-Page Button
1. Navigate to: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Look below the video for "QuickVid Summary" button
3. Click it → Summary panel slides in from right
4. Summary should load in ~10 seconds

#### Test 3: Right-Click Menu
1. On YouTube video page, right-click anywhere
2. Select "Summarize with QuickVid"
3. Summary panel should appear automatically

---

## Common Issues & Fixes

### Issue 1: Button not appearing on YouTube

**Symptom**: No QuickVid button below YouTube video

**Causes**:
- Not on a `/watch` URL (on homepage instead)
- Extension not loaded properly
- Content script blocked

**Fix**:
```bash
# 1. Make sure you're on a video page
https://www.youtube.com/watch?v=VIDEO_ID

# 2. Reload extension
chrome://extensions/ → Click "Reload" under QuickVid

# 3. Refresh YouTube page
F5 or Ctrl+R

# 4. Check console for errors
Right-click page → Inspect → Console tab
Look for "QuickVid" messages
```

---

### Issue 2: CORS Error

**Symptom**: Console shows: `Access to fetch at 'http://localhost:3000/summarizer' from origin 'chrome-extension://...' has been blocked by CORS policy`

**Fix**:
1. Update `backend/src/main.ts` with CORS config (see Step 2 above)
2. Restart backend: `npm run start:dev`
3. Test API directly:
   ```bash
   curl -X POST http://localhost:3000/summarizer \
     -H "Content-Type: application/json" \
     -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

---

### Issue 3: "Failed to generate summary"

**Symptom**: Error message in extension popup/panel

**Causes**:
1. Backend not running
2. Video has no captions
3. API rate limit
4. Network error

**Fix**:
```bash
# 1. Check backend is running
curl http://localhost:3000/summarizer

# 2. Try different video (with captions)
# Find videos with CC icon

# 3. Check DevTools Network tab
Right-click extension icon → Inspect popup → Network
Look for failed requests

# 4. Check backend logs
# In backend terminal, look for error messages
```

---

### Issue 4: Icons not showing

**Symptom**: Extension has generic puzzle piece icon

**Fix**:
1. Make sure icons exist:
   ```
   chrome-extension/icons/icon16.png
   chrome-extension/icons/icon48.png
   chrome-extension/icons/icon128.png
   ```

2. Icons must be PNG format

3. Reload extension: `chrome://extensions/` → Reload

4. If still not showing, check file names match manifest.json exactly

---

## Development Workflow

### Making Changes

**Edit Code**:
```bash
# 1. Make changes to .js, .css, .html files
code chrome-extension/content.js

# 2. Reload extension
chrome://extensions/ → Reload button

# 3. Refresh YouTube page
F5

# 4. Test changes
```

### Debugging

**Content Script** (YouTube page):
```javascript
// Add to content.js
console.log('QuickVid: Initializing...');
console.log('QuickVid: Current URL:', window.location.href);
console.log('QuickVid: Video title:', getCurrentVideoTitle());
```

**Popup**:
```javascript
// Right-click extension icon → Inspect popup
// Console tab shows popup.js logs
```

**Background Worker**:
```javascript
// chrome://extensions/ → Details → Inspect views: service worker
// Console shows background.js logs
```

---

## Production Deployment

### Before Publishing

**Checklist**:
- [ ] Update API URLs to production backend
- [ ] Update website URL in popup.html
- [ ] Test all features work with production backend
- [ ] Create high-quality icons (16, 48, 128)
- [ ] Take screenshots (1280x800) for Chrome Web Store
- [ ] Write clear description
- [ ] Create privacy policy (if collecting data)
- [ ] Test on multiple videos
- [ ] Test CORS with production backend

### Publish to Chrome Web Store

**Cost**: $5 one-time developer fee

**Steps**:
1. Create ZIP:
   ```bash
   cd chrome-extension
   zip -r quickvid-extension.zip . -x "*.git*" -x "*.DS_Store" -x "README.md"
   ```

2. Go to: https://chrome.google.com/webstore/devconsole

3. Click "New Item"

4. Upload ZIP file

5. Fill in:
   - Name: "QuickVid - YouTube Video Summarizer"
   - Description: (see template below)
   - Category: Productivity
   - Language: English
   - Screenshots: At least 1 required (1280x800)

6. Privacy:
   - Declare permissions usage
   - Link to privacy policy

7. Submit for review (1-3 days)

---

## Description Template (for Chrome Web Store)

```
QuickVid - AI-Powered YouTube Video Summaries

Save time and learn faster with instant AI-powered summaries of YouTube videos!

✨ FEATURES:
• One-click summarization directly on YouTube
• AI-powered summaries using advanced language models
• Save summaries to your personal library
• Copy and share summaries easily
• Clean, beautiful interface
• Privacy-focused (end-to-end encryption)

🚀 HOW IT WORKS:
1. Navigate to any YouTube video
2. Click the "QuickVid Summary" button
3. Get your AI summary in seconds
4. Copy, save, or share as needed

🔒 PRIVACY:
• Your summaries are encrypted before storage
• No browsing history tracking
• No personal data collection
• Open source and transparent

📚 PERFECT FOR:
• Students studying from video lectures
• Professionals watching webinars
• Content creators researching topics
• Anyone who wants to save time

🌐 WEBSITE:
Visit quickvid.com to save summaries across devices and access your library anywhere.

Built with ❤️ by Sambhav
```

---

## Next Steps

After setup:
1. ✅ Test extension thoroughly
2. ✅ Get feedback from friends/beta users
3. ✅ Fix any bugs or issues
4. ✅ Polish UI/UX
5. ✅ Deploy backend to production
6. ✅ Update extension URLs to production
7. ✅ Publish to Chrome Web Store
8. ✅ Market to users!

---

**Questions?** Contact: sambhavmagotra009@gmail.com
