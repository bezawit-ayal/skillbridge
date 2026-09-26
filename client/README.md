
# SkillBridge — Job Application & Career Tracking UI

This replacement frontend recreates the SkillBridge job-application experience from the supplied UI references.

## Included screens

- Dashboard
- Job Applications / Pipeline
- Application Details
- Application Analytics
- Add Application
- Edit Application
- Profile
- Settings
- Responsive mobile bottom navigation

## Stack

- React
- Vite
- JavaScript
- CSS
- lucide-react icons
- LocalStorage for temporary application persistence

## Install

```bash
npm install
npm run dev
```

## Important

This package is the **frontend/UI replacement**. It does not delete or modify the existing Node/Express server.

The current frontend uses LocalStorage so the interface can be tested immediately. The next development step is to replace that storage layer with:

React → Express API → MongoDB

## Design direction

The UI follows the supplied references:

- light lavender/neutral background
- white cards
- blue primary actions
- compact status badges
- dashboard metrics
- application pipeline
- analytics
- detailed hiring timeline
- responsive mobile navigation
- subtle shadows and rounded cards
