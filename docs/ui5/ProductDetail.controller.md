# ProductDetail.controller

- **Component**: ProductDetail
- **Type**: Controller
- **File**: `webapp/controller/ProductDetail.controller.js`
- **Namespace**: `ui5.claude.controller.ProductDetail`
- **Last modified**: 2026-04-14T12:47:16+02:00

Controller for the product detail page. Binds a single Northwind product to the view based on the route parameter and handles back navigation.

## Overview

### Purpose
Displays the full set of fields for a single product selected from the product list. Listens to the `RouteProductDetail` route, resolves the product by its `ProductID` parameter, and binds the view element to the corresponding Northwind entity.

### Responsibilities
- Subscribe to the `RouteProductDetail` pattern-matched event on initialization.
- Build an element binding against the `northwind` OData V4 model using an explicit `$select` list.
- Toggle the view busy state while the product data is loading.
- Show an error `MessageBox` if the OData request fails.
- Navigate back to the product list, falling back to `RouteProductList` when no browser history exists.

### Dependencies
- `sap/ui/core/mvc/Controller` — base controller class.
- `sap/ui/core/routing/History` — used to decide whether a browser back navigation is possible.
- `sap/m/MessageBox` — used to surface OData request errors to the user.
- OData V4 model registered under the ID `northwind` in `manifest.json`.
- Route `RouteProductDetail` with the `ProductID` URL parameter.

## Methods

### onInit()
Lifecycle hook called once when the controller is instantiated. Attaches the pattern-matched handler of `RouteProductDetail` so the view binding is refreshed every time the route is entered.

**Parameters**: none.
**Returns**: `void`.

**Example**
```js
// Called automatically by the UI5 framework when the view is created.
// No direct invocation required.
```

### _onRouteMatched(oEvent)
Private handler executed when the `RouteProductDetail` route is activated. Extracts the `ProductID` from the route arguments, builds the entity path `/Products(<id>)`, and binds it to the view with the product fields required by the form. Manages busy state during the request and displays a `MessageBox.error` on failure.

**Parameters**

| Name   | Type                      | Description                                                                 |
|--------|---------------------------|-----------------------------------------------------------------------------|
| oEvent | `sap.ui.base.Event`       | Router `patternMatched` event; its `arguments.ProductID` identifies the product. |

**Returns**: `void`.

**Example**
```js
// Triggered automatically when the user navigates to:
//   #/Products/17
// which matches RouteProductDetail with ProductID = 17.
```

### onPageProductDetailNavButtonPress()
Handler for the back button in the dynamic page title. Uses the routing `History` to go one step back in the browser history when a previous hash exists; otherwise navigates to `RouteProductList` while replacing the current history entry.

**Parameters**: none.
**Returns**: `void`.

**Example**
```xml
<Button
    id="idProductDetailNavButton"
    icon="sap-icon://nav-back"
    press="onPageProductDetailNavButtonPress" />
```

## Usage example

Registering the controller in the corresponding view and route:

```xml
<!-- webapp/view/ProductDetail.view.xml -->
<mvc:View
    controllerName="ui5.claude.controller.ProductDetail"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m">
    <!-- ... -->
</mvc:View>
```

```json
// webapp/manifest.json (excerpt)
{
    "sap.ui5": {
        "routing": {
            "routes": [
                {
                    "name": "RouteProductDetail",
                    "pattern": "Products/{ProductID}",
                    "target": "TargetProductDetail"
                }
            ]
        }
    }
}
```

Navigating from the product list:

```js
this.getOwnerComponent().getRouter().navTo("RouteProductDetail", {
    ProductID: oProduct.getProperty("ProductID")
});
```
