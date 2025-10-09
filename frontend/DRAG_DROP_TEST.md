# Drag & Drop Testing Guide

## ✅ Implementation Status

### Components
- [x] SortableExperience component with drag handle
- [x] DndContext for all sections (Experience, Education, Projects, Certificates, Activities)
- [x] Drag handlers (handleExperienceDragEnd, handleEducationDragEnd, etc.)
- [x] CSS styles for drag handles and dragging states

### Libraries
- @dnd-kit/core@6.3.1 ✅
- @dnd-kit/sortable@10.0.0 ✅
- @dnd-kit/utilities@3.2.2 ✅

## 🎯 How to Test Drag & Drop

### Location: PREVIEW Pane (Right Side)

1. **Navigate to Editor page** with any resume
2. **Look at the PREVIEW pane on the RIGHT side** (not the form tabs on the left)
3. **Find any section**: Experience, Education, Projects, Certificates, or Activities
4. **Hover over any item** - you should see a **6-dot icon** on the left side
5. **Click and hold** on the 6-dot icon
6. **Drag** the item up or down
7. **Release** to drop in new position

### Visual Indicators
- **Drag Handle**: 6 dots (⋮⋮) appears on left when hovering
- **Hover Effect**: Handle background turns light purple
- **Dragging**: Item becomes semi-transparent (50% opacity)
- **Cursor**: Changes to 'grab' on hover, 'grabbing' when dragging

## 🔧 Drag Activation
- **Distance**: Must move 8px before drag starts
- **Touch Support**: `touchAction: 'none'` prevents scroll interference

## 📝 What Was Fixed
1. Added `activationConstraint: { distance: 8 }` to PointerSensor
2. Improved drag handle visibility (opacity: 0.6 → 1 on hover)
3. Added hover background effect on drag handle
4. Added `touchAction: 'none'` to prevent scroll conflicts
5. Added all missing drag handlers (Projects, Certificates, Activities)

## 🐛 Troubleshooting

### If drag doesn't work:
1. **Check console** for errors
2. **Hard refresh**: Ctrl + Shift + R
3. **Verify you're on PREVIEW pane** (right side), not FORM tabs (left side)
4. **Make sure you have multiple items** to reorder
5. **Try clicking directly on the 6-dot icon**, not the item itself

### Browser Console Commands to Debug
```javascript
// Check if DnD Kit is loaded
console.log(window.__DND_KIT_VERSION__);

// Check if sensors are configured
console.log('Sensors configured');
```

## 📍 Code Locations

### Drag Handlers
- `Editor.jsx:937` - handleExperienceDragEnd
- `Editor.jsx:952` - handleEducationDragEnd
- `Editor.jsx:967` - handleProjectDragEnd
- `Editor.jsx:982` - handleCertificateDragEnd
- `Editor.jsx:997` - handleActivityDragEnd

### Sensor Configuration
- `Editor.jsx:917-926` - useSensors with PointerSensor + KeyboardSensor

### DndContext Usage
- Experience: `Editor.jsx:2026-2081`
- Education: `Editor.jsx:2114-2178`
- Projects: `Editor.jsx:2275-2321`
- Certificates: `Editor.jsx:2354-2399`
- Activities: `Editor.jsx:2432-2479`

### CSS Styles
- `Editor.css:1389-1539` - All drag & drop styles
- `Editor.css:1460-1485` - Drag handle specific styles

## ✨ Expected Behavior

When working correctly, you should be able to:
1. ✅ See 6-dot handle appear on hover
2. ✅ Click and hold the handle
3. ✅ Drag the item vertically
4. ✅ See visual feedback (opacity change, cursor change)
5. ✅ Drop the item in a new position
6. ✅ See the order change persist in the preview
