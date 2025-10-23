# Resume Builder - Real-Time Preview Feature Implementation Guide

## Overview
The resume builder is a React application with a split-pane editor layout. The preview is already real-time - it updates instantly as users type. The task is to add a dedicated "View Real-Time" button for better UX.

## Current Tech Stack
- Frontend: React 18.2.0, Vite, React Router DOM 6.8.1
- State Management: React Hooks (useState, useEffect)
- Drag & Drop: @dnd-kit library
- Export: html2canvas, jsPDF
- Backend: Express.js, MongoDB, Redis

## Current Architecture

### Editor Layout (split-pane)
- Left: Form editor (480px) with tabs
- Right: Live preview (flex: 1) with real-time updates
- Header: Controls (Customize, Share, Save, Export)
- Banner: Guest mode warning if applicable

### Data Flow
1. User types in form input
2. onChange triggers updatePersonalInfo() or similar
3. setCvData() updates React state
4. Component re-renders
5. Preview updates immediately (no lag)

### Key Components

**Editor.jsx (2900+ lines)**
- Main component with all state
- cvData state object
- customization state object
- updatePersonalInfo(), updateExperience(), etc.
- Preview rendering inline (lines 2288-2900)

**ResumePreview.jsx**
- Pure presentation component
- Props: cvData, customization, template
- Used for standalone preview views
- NOT used in Editor - Editor has inline preview

**EditableField.jsx**
- contentEditable div component
- Real-time onChange callbacks
- Used for all text fields in preview
- Supports multiline and placeholders

**CustomizationPanel.jsx**
- Modal overlay for theme customization
- Controls: font, size, color, spacing, layout
- Updates customization state immediately

## Proposed Real-Time Preview Feature

The preview is ALREADY real-time. Adding a "View Real-Time" button means:

1. Add button to header
2. Toggle floating/modal preview window
3. Show preview in dedicated space (not split-pane)
4. Updates continue in real-time automatically

### Implementation Approach

Option A: Floating Modal Preview
- Add toggle button "View Real-Time Preview"
- Opens modal with preview content
- Updates in real-time as user types
- Can be resized/moved (optional)

Option B: Full-Screen Preview
- Toggle to show preview full-screen
- Hide form, show just resume
- Toggle back to see form
- Quick mode switching

Option C: Side-by-Side with Resizable Divider
- Upgrade current layout to have draggable divider
- Adjust widths dynamically
- Better use of screen space

### What Needs to Change

**Minimal Changes:**
- Add state for preview visibility/mode
- Add toggle button
- Add modal/fullscreen container
- Reuse existing preview rendering logic

**No Changes Needed:**
- EditableField (already real-time)
- CVData structure
- Update functions
- Customization logic

## File Paths (Absolute)

Key Files:
- D:/Dev/Thanh/resume-builder/frontend/src/Editor.jsx
- D:/Dev/Thanh/resume-builder/frontend/src/components/ResumePreview.jsx
- D:/Dev/Thanh/resume-builder/frontend/src/components/EditableField.jsx
- D:/Dev/Thanh/resume-builder/frontend/src/components/CustomizationPanel.jsx
- D:/Dev/Thanh/resume-builder/frontend/src/Editor.css
- D:/Dev/Thanh/resume-builder/frontend/src/components/ResumePreview.css

## CVData State Structure

personal: { fullName, email, phone, location, linkedin, website, summary }
experience: [{ id, jobTitle, company, location, startDate, endDate, current, description }]
education: [{ id, degree, school, location, startDate, endDate, gpa, description }]
skills: { technical: [], soft: [], languages: [] }
projects: [{ id, name, description, technologies, link, startDate, endDate }]
certificates: [{ id, name, issuer, date, link, description }]
activities: [{ id, title, organization, startDate, endDate, description }]

## Customization State Structure

font: string (font family name)
fontSize: 'small' | 'medium' | 'large'
colorScheme: 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'teal' | 'pink' | 'gray'
spacing: 'compact' | 'normal' | 'relaxed'
layout: 'single-column' | 'two-column' | 'split'
templateId: string or null

## How Real-Time Works Currently

The preview in Editor.jsx (right pane):
1. Uses EditableField components with contentEditable=true
2. Each field has onChange callback
3. Callbacks trigger setCvData() or setCustomization()
4. React re-renders on state change
5. All changes are instant (no debouncing)

Example update flow:
Form Input Change -> onChange callback -> updatePersonalInfo() -> setCvData() -> React re-render -> Preview updates

## Performance Notes

- No lag observed with current implementation
- Uses React.useState for simplicity
- No memoization needed currently
- CSS variables for instant theme updates
- Each keystroke triggers re-render (acceptable performance)

## Next Steps for Implementation

1. Analyze current header and button layout
2. Decide on preview modal type (floating, fullscreen, etc.)
3. Add toggle state to Editor.jsx
4. Create modal/container component
5. Add event handlers for open/close
6. Add CSS for modal styling
7. Test with all section types and customizations

