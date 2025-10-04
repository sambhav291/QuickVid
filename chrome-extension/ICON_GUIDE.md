# Icon Creation Guide

## You Need These Icons

Place PNG images in `chrome-extension/icons/`:

```
chrome-extension/icons/
├── icon16.png    (16x16 pixels)
├── icon48.png    (48x48 pixels)
└── icon128.png   (128x128 pixels)
```

---

## Quick Method: Use Online Tool

### Option 1: Favicon Generator

1. Go to: **https://www.favicon-generator.org/**
2. Upload: `frontend/public/QuickVid logo.png`
3. Click "Create Favicon"
4. Download the generated ZIP
5. Extract and find these files:
   - `favicon-16x16.png` → Rename to `icon16.png`
   - `favicon-32x32.png` → Resize to 48x48 → Save as `icon48.png`
   - `android-chrome-192x192.png` → Resize to 128x128 → Save as `icon128.png`
6. Move all to `chrome-extension/icons/`

### Option 2: RealFaviconGenerator

1. Go to: **https://realfavicongenerator.net/**
2. Upload: `frontend/public/QuickVid logo.png`
3. Configure settings
4. Download package
5. Extract and rename files as needed

---

## Manual Method: Resize Yourself

### Using Photoshop

1. Open `frontend/public/QuickVid logo.png`
2. Image → Image Size
3. Set to 16x16 pixels (maintain aspect ratio unchecked)
4. Save as: `icon16.png`
5. Repeat for 48x48 and 128x128

### Using GIMP (Free)

1. Open `frontend/public/QuickVid logo.png`
2. Image → Scale Image
3. Set to 16x16 pixels
4. Export as: `icon16.png`
5. Repeat for 48x48 and 128x128

### Using Online Image Resizer

1. Go to: **https://www.iloveimg.com/resize-image**
2. Upload your logo
3. Resize to 16x16 → Download as `icon16.png`
4. Repeat for 48x48 and 128x128

---

## Icon Design Tips

### For 16x16 (Toolbar Icon)
- Very small - keep design simple
- High contrast
- Recognizable shape
- Use solid colors
- Avoid fine details

### For 48x48 (Extension Manager)
- Medium detail
- Clear and crisp
- Same style as 16x16
- Good contrast

### For 128x128 (Chrome Web Store)
- Most detailed version
- High quality
- Professional look
- Represents your brand

---

## Icon Specifications

**Format**: PNG with transparency  
**Color Mode**: RGB  
**Bit Depth**: 24-bit or 32-bit (with alpha)  
**Background**: Transparent recommended  
**File Size**: Under 100KB each  

---

## Quick Check

After creating icons, verify:

```bash
cd chrome-extension/icons
ls -lh

# Should show:
# icon16.png   (16x16)
# icon48.png   (48x48)  
# icon128.png  (128x128)
```

Then reload extension:
1. `chrome://extensions/`
2. Click "Reload" under QuickVid
3. Icon should now appear in toolbar!

---

## Example Icon Appearance

### Toolbar (16x16)
```
┌──────────────┐
│              │
│   [Q]        │  ← Your QuickVid "Q" logo
│              │
└──────────────┘
```

### Extension Page (48x48)
```
┌──────────────────────┐
│                      │
│                      │
│    [QuickVid]        │  ← Your full logo
│                      │
│                      │
└──────────────────────┘
```

### Chrome Web Store (128x128)
```
┌────────────────────────────────┐
│                                │
│                                │
│                                │
│        [QuickVid Logo]         │  ← Detailed version
│        with tagline            │
│                                │
│                                │
│                                │
└────────────────────────────────┘
```

---

## If You Don't Have Icons Yet

**Temporary Solution**: Use text-based icons

Create simple colored squares with text:

1. Go to: **https://via.placeholder.com/**
2. Create temporary icons:
   - https://via.placeholder.com/16/4f9cf9/FFFFFF?text=Q
   - https://via.placeholder.com/48/4f9cf9/FFFFFF?text=QV
   - https://via.placeholder.com/128/4f9cf9/FFFFFF?text=QuickVid
3. Download and rename
4. Replace later with real logo

---

**Need Help?** Ask a designer or use AI image generation tools to create a logo!
