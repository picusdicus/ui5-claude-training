# ProductDetail.view

- **Component**: ProductDetail
- **Type**: View (XML)
- **File**: `webapp/view/ProductDetail.view.xml`
- **Controller**: `ui5.claude.controller.ProductDetail`
- **Last modified**: 2026-04-14T13:13:47+02:00

Detail page that renders the fields of a single Northwind product inside a `sap.f.DynamicPage` with a responsive form.

## Overview

### Purpose
Render the product selected in the product list, showing its descriptive and stock-related fields in a read-only responsive form. The view is the target of the `RouteProductDetail` route.

### Responsibilities
- Provide a `DynamicPage` layout with a title bar and a navigation action for going back.
- Lay out product properties as label/value pairs using a `SimpleForm` with `ResponsiveGridLayout`.
- Bind every value field to a property of the product entity exposed through the `northwind` model element binding set by the controller.
- Source every user-facing text from the `i18n` resource model.

### Dependencies
- Controller `ui5.claude.controller.ProductDetail` — sets the element binding and handles the back button press.
- `i18n` resource model — provides all labels, titles, and tooltips.
- `northwind` OData V4 model — element binding applied by the controller on route match.
- Libraries: `sap.m`, `sap.f`, `sap.ui.layout.form`, `sap.ui.core.mvc`.

## Events

| Event | Handler | Description |
|-------|---------|-------------|
| `press` on `idProductDetailNavButton` | `onPageProductDetailNavButtonPress` | Navigates back to the product list or to the previous browser history entry. |

## Bindings

| Model      | Path                                     | Type              | Description                                                   |
|------------|------------------------------------------|-------------------|---------------------------------------------------------------|
| `i18n`     | `viewProductDetailTitle`                 | Property (text)   | Page title shown in the dynamic page header.                  |
| `i18n`     | `viewProductDetailNavBackTooltip`        | Property (tooltip)| Tooltip for the back navigation button.                       |
| `i18n`     | `viewProductDetailLabelProductName`      | Property (text)   | Label for the product name field.                             |
| `i18n`     | `viewProductDetailLabelUnitPrice`        | Property (text)   | Label for the unit price field.                               |
| `i18n`     | `viewProductDetailLabelUnitsInStock`     | Property (text)   | Label for the units-in-stock field.                           |
| `i18n`     | `viewProductDetailLabelUnitsOnOrder`     | Property (text)   | Label for the units-on-order field.                           |
| `i18n`     | `viewProductDetailLabelQuantityPerUnit`  | Property (text)   | Label for the quantity-per-unit field.                        |
| `i18n`     | `viewProductDetailLabelDiscontinued`     | Property (text)   | Label for the discontinued flag field.                        |
| `northwind`| `ProductName`                            | Property (text)   | Product name of the bound `Products` entity.                  |
| `northwind`| `UnitPrice`                              | Property (text)   | Unit price of the bound product.                              |
| `northwind`| `UnitsInStock`                           | Property (text)   | Units currently in stock for the bound product.               |
| `northwind`| `UnitsOnOrder`                           | Property (text)   | Units on order for the bound product.                         |
| `northwind`| `QuantityPerUnit`                        | Property (text)   | Packaging description for the bound product.                  |
| `northwind`| `Discontinued`                           | Property (text)   | Flag indicating whether the bound product is discontinued.    |

The element binding that provides the `northwind` context (path `/Products(<ProductID>)` with the corresponding `$select`) is applied by the controller in `_onRouteMatched`.

## Usage example

The view is instantiated by the router as the target of `RouteProductDetail`:

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
            ],
            "targets": {
                "TargetProductDetail": {
                    "viewName": "ProductDetail",
                    "viewId": "idProductDetailView"
                }
            }
        }
    }
}
```

Navigation into the view from the product list controller:

```js
this.getOwnerComponent().getRouter().navTo("RouteProductDetail", {
    ProductID: oSelectedProduct.getProperty("ProductID")
});
```
