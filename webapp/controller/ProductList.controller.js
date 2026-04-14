sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
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

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oBinding = this.byId("idProductsList").getBinding("items");
            if (!oBinding) {
                return;
            }
            var aFilters = sQuery
                ? [new Filter("ProductName", FilterOperator.Contains, sQuery)]
                : [];
            oBinding.filter(aFilters);
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
