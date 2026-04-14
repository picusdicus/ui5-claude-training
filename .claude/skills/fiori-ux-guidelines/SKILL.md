---
name: fiori-ux-guidelines
description: >
  ALWAYS activate for ANY UI/UX work in this project: creating or modifying
  views, layouts, forms, tables, lists, dialogs, navigation, icons, 
  responsive design, accessibility, empty states, loading states, error pages,
  or any sap.m component usage. Contains project-specific Fiori 3 conventions
  that override general UI5 knowledge for ui5.claude.ui5claude.
---

# Fiori UX Guidelines — ui5.claude.ui5claude

## Theme & Visual Identity
- Theme: sap_horizon (SAP Horizon, not Belize or HCB)
- Never hardcode colors — always use theme parameters
- Icons: use sap-icon:// URI scheme, source from SAP Icon Explorer
- Never use custom icon fonts

## Full Width Layout
- Always set fitContainer="true" on DynamicPage for full width
- App.view.xml root must use sap.m.App with no padding
- Never wrap views in containers with maxWidth set
- In manifest.json set "fullWidth": true under sap.ui5 → contentDensities
- Shell/FLP integration: set "sap-fiori-id" to enable full-width launchpad rendering

## Preferred Layout Components
- Detail views: sap.m.DynamicPage (not sap.m.Page for complex layouts)
- Forms: sap.ui.layout.form.SimpleForm with sap.ui.layout.form.ResponsiveGridLayout
- Tables: sap.m.Table for mobile-friendly, sap.ui.table.Table only for large datasets
- Navigation: sap.m.IconTabBar for tabbed detail sections
- Toolbar: always sap.m.OverflowToolbar — never sap.m.Toolbar directly

## Fiori 3 Navigation Rules
- Every detail view MUST have a back button (navButtonPress → onNavBack)
- onNavBack: use History.getInstance(), fallback to router.navTo home route
- Never use browser back — always route via UI5 router
- Breadcrumbs: use sap.m.Breadcrumbs for 3+ level navigation

## Mandatory UX States
Every view that loads data MUST handle all 4 states:
1. **Loading:** sap.m.BusyIndicator or busyIndicatorDelay on the view
2. **Success:** render data
3. **Empty:** sap.m.IllustratedMessage with relevant illustration
4. **Error:** sap.m.IllustratedMessage + retry button + MessageBox.error

## Responsive Design Rules
- Always use sap.m components (mobile-first)
- Form columns: use columnsL="2" columnsM="1" on ResponsiveGridLayout
- Never set fixed pixel widths on containers
- Test at 320px, 768px and 1280px breakpoints

## Accessibility Requirements
- Every input MUST have a label (use labelFor association)
- Every icon-only button MUST have tooltip property set
- Every table/list MUST have ariaLabelledBy or headerText
- Use sap.m.Title for section headings, never styled divs

## Forbidden — Do Not Use
- sap.ui.commons.* — fully deprecated
- sap.ui.ux3.* — fully deprecated  
- sap.m.Toolbar directly — use OverflowToolbar
- Fixed pixel widths on any container
- Hardcoded color strings anywhere in XML or JS
- jQuery.sap.* — use modern equivalents

## Empty State Pattern (Required)
```xml
<IllustratedMessage
  illustrationType="sapIllus-EmptyList"
  title="{i18n>emptyStateTitle}"
  description="{i18n>emptyStateDescription}"
  visible="{= ${northwind>/Products}.length === 0 }">
  <buttons>
    <Button text="{i18n>refresh}" press=".onRefresh"/>
  </buttons>
</IllustratedMessage>
```

## Loading State Pattern (Required)
```javascript
// In controller onInit
this.getView().setBusyIndicatorDelay(0);
this.getView().setBusy(true);
oBinding.attachEventOnce("dataReceived", function() {
  this.getView().setBusy(false);
}.bind(this));
```