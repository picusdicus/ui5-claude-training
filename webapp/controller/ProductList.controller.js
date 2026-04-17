sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/base/strings/formatMessage"
], function (Controller, Filter, FilterOperator, MessageBox, formatMessage) {
    "use strict";

    return Controller.extend("ui5.claude.controller.ProductList", {

        formatMessage: formatMessage,

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

        onDataRequested: function () {
            var oList = this.byId("idProductsList");
            if (oList) {
                oList.setBusy(true);
            }
        },

        onDataReceived: function (oEvent) {
            var oList = this.byId("idProductsList");
            if (oList) {
                oList.setBusy(false);
            }
            var oError = oEvent.getParameter("error");
            if (oError) {
                var sMsg = this.getOwnerComponent()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("viewProductListErrorLoad");
                MessageBox.error(sMsg, {
                    details: oError.message
                });
            }
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
