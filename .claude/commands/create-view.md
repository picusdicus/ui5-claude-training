---
description: Creates a complete UI5 Fiori view with controller, i18n entries and manifest routing
allowed-tools: Read, Write, Bash
---

Create a complete SAP UI5 view for: $ARGUMENTS

Follow ALL conventions in CLAUDE.md. Deliver exactly these files:

1. **webapp/view/$ARGUMENTS.view.xml**
   - sap.m Page with proper title bound to i18n
   - Toolbar with relevant actions
   - Empty content placeholder ready for binding

2. **webapp/controller/$ARGUMENTS.controller.js**
   - sap.ui.define with correct namespace
   - onInit with router attachment
   - Stub handlers for toolbar actions

3. **webapp/i18n/i18n.properties**
   - APPEND (do not overwrite) new keys for this view
   - Format: view[ViewName][Element]=Value

4. **webapp/manifest.json**
   - ADD new route and target for this view
   - Do not modify existing routes

After creating all files, show me a summary of what was created and what i18n keys were added.