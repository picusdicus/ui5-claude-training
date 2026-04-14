sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ui5.claude.controller.ProductList", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteProductList").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
        },

        onRefresh: function () {
            var oList = this.byId("idProductsList");
            var oBinding = oList.getBinding("items");
            if (oBinding) {
                oBinding.refresh();
            }
        },

        onSearch: function () {
        },

        onSort: function () {
        },

        onUnitPriceObjectListItemPress: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("northwind");
            var sProductID = oContext.getProperty("ProductID");
            this.getOwnerComponent().getRouter().navTo("RouteProductDetail", {
                ProductID: sProductID
            });
        }

    });
});
