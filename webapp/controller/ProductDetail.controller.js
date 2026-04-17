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
            var iProductID = parseInt(sProductID, 10);

            if (isNaN(iProductID) || iProductID <= 0 || String(iProductID) !== sProductID) {
                this.getOwnerComponent().getRouter().navTo("RouteProductList", {}, {}, true);
                return;
            }

            var sPath = "/Products(" + iProductID + ")";
            var oView = this.getView();
            var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

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
                            MessageBox.error(oResourceBundle.getText("viewProductDetailErrorLoad"), {
                                details: oData.getParameter("error").message
                            });
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
