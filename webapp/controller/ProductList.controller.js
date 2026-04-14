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
        },

        onSearch: function () {
        },

        onSort: function () {
        }

    });
});
