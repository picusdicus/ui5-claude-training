# ProductDetail.view

- **Component**: ProductDetail
- **Type**: View (XML)
- **File**: `webapp/view/ProductDetail.view.xml`
- **Controller**: `ui5.claude.controller.ProductDetail`

Detail view rendering the fields of a single Northwind product inside a `sap.f.DynamicPage` with a responsive form layout.

## Overview

### Purpose
Render the product selected from the product list, showing its descriptive and stock-related fields as read-only label/value pairs. Target of the `RouteProductDetail` route.

### Responsibilities
- Provide a `DynamicPage` with title, heading, and back navigation action.
- Lay out product properties as label/value pairs via `SimpleForm` + `ResponsiveGridLayout`.
- Bind every value to a property of the product entity made available by the controller through an element binding on the `northwind` model.
- Source every user-facing string from the `i18n` resource model.

## Top-Level Structure

```
f:DynamicPage (idProductDetailPage, fitContainer=true)
├── f:title
│   └── f:DynamicPageTitle
│       ├── f:heading           -> sap.m.Title ({i18n>viewProductDetailTitle})
│       └── f:navigationActions -> sap.m.Button (idProductDetailNavButton, nav-back)
└── f:content
    └── form:SimpleForm (idProductDetailSimpleForm, ResponsiveGridLayout, 2/2/1)
        └── Label + Text pairs for each product field
```

## Key Controls

| Id                             | Control                   | Role                                          |
|--------------------------------|---------------------------|-----------------------------------------------|
| `idProductDetailPage`          | `sap.f.DynamicPage`       | Full-width detail page container.             |
| `idProductDetailNavButton`     | `sap.m.Button`            | Back navigation action in the page title.    |
| `idProductDetailSimpleForm`    | `sap.ui.layout.form.SimpleForm` | Responsive form hosting label/value pairs. |
| `idProductNameText`            | `sap.m.Text`              | Displays the product name.                   |
| `idUnitPriceText`              | `sap.m.Text`              | Displays the unit price.                     |
| `idUnitsInStockText`           | `sap.m.Text`              | Displays units in stock.                     |
| `idUnitsOnOrderText`           | `sap.m.Text`              | Displays units on order.                     |
| `idQuantityPerUnitText`        | `sap.m.Text`              | Displays quantity per unit.                  |
| `idDiscontinuedText`           | `sap.m.Text`              | Displays the discontinued flag.              |

## Events

| Control                      | Event   | Handler                                   |
|------------------------------|---------|-------------------------------------------|
| `idProductDetailNavButton`   | `press` | `onPageProductDetailNavButtonPress`       |

## Bindings

| Model       | Path                                      | Type                | Description                                      |
|-------------|-------------------------------------------|---------------------|--------------------------------------------------|
| `i18n`      | `viewProductDetailTitle`                  | Property (text)     | Page title in the dynamic page header.           |
| `i18n`      | `viewProductDetailNavBackTooltip`         | Property (tooltip)  | Tooltip for the back navigation button.          |
| `i18n`      | `viewProductDetailLabelProductName`       | Property (text)     | Label for the product name.                      |
| `i18n`      | `viewProductDetailLabelUnitPrice`         | Property (text)     | Label for the unit price.                        |
| `i18n`      | `viewProductDetailLabelUnitsInStock`      | Property (text)     | Label for units in stock.                        |
| `i18n`      | `viewProductDetailLabelUnitsOnOrder`      | Property (text)     | Label for units on order.                        |
| `i18n`      | `viewProductDetailLabelQuantityPerUnit`   | Property (text)     | Label for quantity per unit.                     |
| `i18n`      | `viewProductDetailLabelDiscontinued`      | Property (text)     | Label for the discontinued flag.                 |
| `northwind` | `ProductName`                             | Property (text)     | Product name of the bound `Products` entity.     |
| `northwind` | `UnitPrice`                               | Property (text)     | Unit price of the bound product.                 |
| `northwind` | `UnitsInStock`                            | Property (text)     | Units currently in stock.                        |
| `northwind` | `UnitsOnOrder`                            | Property (text)     | Units on order.                                  |
| `northwind` | `QuantityPerUnit`                         | Property (text)     | Packaging description.                           |
| `northwind` | `Discontinued`                            | Property (text)     | Discontinued flag.                               |

The `northwind` element binding (`/Products(<ProductID>)` with the matching `$select`) is set by the controller in `_onRouteMatched`; the view uses only relative property paths.

## i18n Keys Referenced

- `viewProductDetailTitle`
- `viewProductDetailNavBackTooltip`
- `viewProductDetailLabelProductName`
- `viewProductDetailLabelUnitPrice`
- `viewProductDetailLabelUnitsInStock`
- `viewProductDetailLabelUnitsOnOrder`
- `viewProductDetailLabelQuantityPerUnit`
- `viewProductDetailLabelDiscontinued`

## Usage Example

Target declaration excerpt in `manifest.json`:

```json
{
    "sap.ui5": {
        "routing": {
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
