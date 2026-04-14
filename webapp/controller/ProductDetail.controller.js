sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (Controller, History, MessageBox) {
    "use strict";

    return Controller.extend("ui5.claude.controller.ProductDetail", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteProductDetail").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sProductID = oEvent.getParameter("arguments").ProductID;
            var sPath = "/Products(" + sProductID + ")";
            var oView = this.getView();

            oView.bindElement({
                path: sPath,
                model: "northwind",
                parameters: {
                    $select: "ProductID,ProductName,UnitPrice,UnitsInStock,UnitsOnOrder,QuantityPerUnit,Discontinued"
                },
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function (oData) {
                        oView.setBusy(false);
                        if (oData.getParameter("error")) {
                            MessageBox.error(oData.getParameter("error").message);
                        }
                    }
                }
            });
        },

        onPageProductDetailNavButtonPress: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteProductList", {}, {}, true);
            }
        }

    });
});
