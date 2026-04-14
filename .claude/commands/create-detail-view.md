---
description: Creates a Fiori detail view with OData V4 context binding and router parameter handling
allowed-tools: Read, Write, Bash
---

Create a complete SAP UI5 detail view for: $ARGUMENTS

Follow ALL conventions in CLAUDE.md. Deliver exactly these files:

1. **webapp/view/$ARGUMENTS.view.xml**
   - sap.m Page with back button (navButtonPress → onNavBack)
   - Title bound to i18n
   - sap.ui.layout.form.SimpleForm inside content
   - Form fields bound relatively (e.g. {ProductName}, {UnitPrice})
   - All labels bound to i18n keys

2. **webapp/controller/$ARGUMENTS.controller.js**
   - sap.ui.define with correct namespace
   - onInit: attach routeMatched for this view's route
   - _onRouteMatched: extract key parameter from event context
     (e.g. ProductID), build OData V4 binding path and call
     this.getView().bindElement() with the correct path and
     $select parameters — never over-fetch
   - onNavBack: use History.getInstance() to navigate back
     or fallback to router.navTo main route
   - Error handling: if binding fails, show MessageBox.error

3. **webapp/i18n/i18n.properties**
   - APPEND new keys for this view only
   - Format: view[ViewName][Element]=Value
   - Never overwrite existing keys

4. **webapp/manifest.json**
   - ADD new route with parameter pattern (e.g. /Products/{ProductID})
   - ADD corresponding target pointing to this view
   - Never modify existing routes or targets

After creating all files, show a summary of:
- Files created
- Route pattern added
- i18n keys added
- OData path used for bindElement