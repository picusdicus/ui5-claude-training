---
name: odata-v4-expert
description: >
  ALWAYS activate for ANY OData or data binding work in this project.
  This skill contains project-specific conventions that override
  general UI5 knowledge: model ID "northwind", binding rules,
  $select requirements, and forbidden patterns specific to
  ui5.claude.ui5claude. Without this skill, Claude lacks the
  project context to generate correct bindings.
---

# OData V4 Expert — Northwind Project

## Model Setup
- Model ID: "northwind"
- Type: sap.ui.model.odata.v4.ODataModel
- Base URL: /V4/Northwind/Northwind.svc/
- autoExpandSelect: true
- operationMode: "Server"

## Binding Rules
- List views: use relative bindings with items="{northwind>/Products}"
- Detail views: use bindElement() in controller, never in XML
- ALWAYS specify $select — never bind entire entities
- Use $expand only when related entity is actually displayed

## Correct Patterns

### List binding
```xml
<List items="{northwind>/Products}">
  <StandardListItem
    title="{northwind>ProductName}"
    description="{northwind>UnitPrice}"/>
</List>
```

### Detail binding in controller
```javascript
this.getView().bindElement({
  path: "/Products(" + sProductID + ")",
  model: "northwind",
  parameters: {
    $select: "ProductName,UnitPrice,UnitsInStock,CategoryID"
  }
});
```

### Filtering
```javascript
var oFilter = new Filter("ProductName", FilterOperator.Contains, sQuery);
oBinding.filter([oFilter]);
```

## Common Mistakes to Avoid
- NEVER use sap.ui.model.odata.v2.ODataModel in this project
- NEVER bind without $select on large entities
- NEVER use absolute bindings in list item templates
- NEVER forget model: "northwind" in bindElement parameters

## Error Handling
Always attach to requestFailed and change events:
```javascript
oBinding.attachEventOnce("dataReceived", function(oEvent) {
  if (oEvent.getParameter("error")) {
    MessageBox.error("Failed to load product data");
  }
});
```