# ProductDetail.controller

- **Component**: ProductDetail
- **Type**: Controller
- **File**: `webapp/controller/ProductDetail.controller.js`
- **Namespace**: `ui5.claude.controller.ProductDetail`

Controller for the product detail page. Binds a single Northwind product to the view based on the `ProductID` route parameter and handles back navigation.

## Overview

### Purpose
Display the full field set of a single Northwind product. Listens to the `RouteProductDetail` route, resolves the product by its `ProductID` argument, and binds the view element to the corresponding OData entity.

### Responsibilities
- Attach a pattern-matched handler to `RouteProductDetail` on init.
- Build an element binding on the `northwind` OData V4 model with an explicit `$select` list.
- Toggle view busy state while the product data is loading.
- Surface OData request errors through `MessageBox.error`.
- Navigate back to the product list, falling back to `RouteProductList` when no browser history exists.

### Dependencies
- `sap/ui/core/mvc/Controller` — base class.
- `sap/ui/core/routing/History` — detects whether browser-back is possible.
- `sap/m/MessageBox` — surfaces OData errors.
- `northwind` OData V4 model (registered in `manifest.json`).
- Route `RouteProductDetail` exposing the `ProductID` URL parameter.

## Public Methods

### onInit()
Lifecycle hook. Registers `_onRouteMatched` as the handler for the `RouteProductDetail` pattern-matched event, so the view is re-bound whenever the route is entered.

- **Parameters**: none
- **Returns**: `void`
- **Side effects**: subscribes the controller to the router event bus.

**Example**
```js
// Invoked by the UI5 framework when the view is created.
// No direct call is needed.
```

### onPageProductDetailNavButtonPress()
Handler for the back button in the dynamic page title. If the routing `History` has a previous hash, it performs a `window.history.go(-1)`; otherwise it navigates to `RouteProductList`, replacing the current history entry.

- **Parameters**: none
- **Returns**: `void`
- **Side effects**: changes the current route / browser history.

**Example**
```xml
<Button
    id="idProductDetailNavButton"
    icon="sap-icon://nav-back"
    press="onPageProductDetailNavButtonPress" />
```

## Private Methods

### _onRouteMatched(oEvent)
Handler for the `RouteProductDetail` pattern-matched event. Reads `ProductID` from the event arguments, builds the `/Products(<id>)` path, and binds it to the view using the `northwind` model with the required `$select` fields. Toggles the view busy indicator around the request and shows a `MessageBox.error` on failure.

| Name   | Type                | Description                                                                 |
|--------|---------------------|-----------------------------------------------------------------------------|
| oEvent | `sap.ui.base.Event` | Router `patternMatched` event; `arguments.ProductID` identifies the product. |

- **Returns**: `void`
- **Side effects**: sets the view element binding, toggles busy state, may open a `MessageBox`.

## OData Bindings

- **Model**: `northwind` (OData V4).
- **Path**: `/Products(<ProductID>)` — element binding set in the controller.
- **$select**: `ProductID,ProductName,UnitPrice,UnitsInStock,UnitsOnOrder,QuantityPerUnit,Discontinued`.
- **Events wired on the binding**:
  - `dataRequested` — sets the view busy.
  - `dataReceived` — clears busy and reports errors.

## Events Handled

| Source                          | Event           | Method                                   |
|---------------------------------|-----------------|------------------------------------------|
| Router route `RouteProductDetail` | `patternMatched` | `_onRouteMatched`                      |
| `idProductDetailNavButton` (view) | `press`          | `onPageProductDetailNavButtonPress`    |

## Usage Example

Navigating into the detail page from the product list controller:

```js
this.getOwnerComponent().getRouter().navTo("RouteProductDetail", {
    ProductID: oProduct.getProperty("ProductID")
});
```

Route configuration excerpt in `manifest.json`:

```json
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
