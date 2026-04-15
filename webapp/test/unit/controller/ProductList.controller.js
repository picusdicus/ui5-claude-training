/* global QUnit, sinon */
sap.ui.define([
    "ui5/claude/controller/ProductList.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (ProductListController, Filter, FilterOperator, MessageBox) {
    "use strict";

    QUnit.module("ProductList Controller", {
        beforeEach: function () {
            this.oController = new ProductListController();

            this.oBinding = {
                filter: sinon.stub(),
                refresh: sinon.stub()
            };
            this.oList = {
                getBinding: sinon.stub().returns(this.oBinding),
                setBusy: sinon.stub()
            };
            this.oByIdStub = sinon.stub(this.oController, "byId").returns(this.oList);

            this.oRouter = { navTo: sinon.stub() };
            this.oResourceBundle = { getText: sinon.stub().returns("Load error") };
            this.oI18nModel = { getResourceBundle: sinon.stub().returns(this.oResourceBundle) };
            this.oComponent = {
                getRouter: sinon.stub().returns(this.oRouter),
                getModel: sinon.stub().withArgs("i18n").returns(this.oI18nModel)
            };
            this.oComponent.getModel.returns(this.oI18nModel);
            this.oGetOwnerComponentStub = sinon.stub(this.oController, "getOwnerComponent").returns(this.oComponent);
        },
        afterEach: function () {
            this.oByIdStub.restore();
            this.oGetOwnerComponentStub.restore();
        }
    });

    QUnit.test("onSearch sets Contains filter with query", function (assert) {
        var oEvent = { getParameter: sinon.stub().withArgs("query").returns("Chai") };
        oEvent.getParameter.returns("Chai");

        this.oController.onSearch(oEvent);

        assert.ok(this.oBinding.filter.calledOnce, "filter called once");
        var aFilters = this.oBinding.filter.firstCall.args[0];
        assert.strictEqual(aFilters.length, 1, "one filter applied");
        assert.ok(aFilters[0] instanceof Filter, "is a Filter instance");
        assert.strictEqual(aFilters[0].sPath, "ProductName", "filter on ProductName");
        assert.strictEqual(aFilters[0].sOperator, FilterOperator.Contains, "Contains operator");
        assert.strictEqual(aFilters[0].oValue1, "Chai", "query value passed");
    });

    QUnit.test("onSearch with empty query applies empty filter array", function (assert) {
        var oEvent = { getParameter: sinon.stub().returns("") };

        this.oController.onSearch(oEvent);

        assert.ok(this.oBinding.filter.calledOnce, "filter called once");
        assert.deepEqual(this.oBinding.filter.firstCall.args[0], [], "empty filter array");
    });

    QUnit.test("onSearch does nothing if binding missing", function (assert) {
        this.oList.getBinding.returns(null);
        var oEvent = { getParameter: sinon.stub().returns("Chai") };

        this.oController.onSearch(oEvent);

        assert.ok(this.oBinding.filter.notCalled, "filter not called");
    });

    QUnit.test("onRefresh calls refresh on items binding", function (assert) {
        this.oController.onRefresh();

        assert.ok(this.oBinding.refresh.calledOnce, "refresh called");
    });

    QUnit.test("onRefresh does nothing when binding is missing", function (assert) {
        this.oList.getBinding.returns(null);

        this.oController.onRefresh();

        assert.ok(this.oBinding.refresh.notCalled, "refresh not called");
    });

    QUnit.test("onDataRequested sets list busy true", function (assert) {
        this.oController.onDataRequested();

        assert.ok(this.oList.setBusy.calledOnceWithExactly(true), "busy=true");
    });

    QUnit.test("onDataReceived sets busy false without error", function (assert) {
        var oEvent = { getParameter: sinon.stub().returns(undefined) };
        var oMessageBoxStub = sinon.stub(MessageBox, "error");

        this.oController.onDataReceived(oEvent);

        assert.ok(this.oList.setBusy.calledOnceWithExactly(false), "busy=false");
        assert.ok(oMessageBoxStub.notCalled, "MessageBox.error not called");
        oMessageBoxStub.restore();
    });

    QUnit.test("onDataReceived shows MessageBox.error on error", function (assert) {
        var oError = { message: "boom" };
        var oEvent = { getParameter: sinon.stub().withArgs("error").returns(oError) };
        oEvent.getParameter.returns(oError);
        var oMessageBoxStub = sinon.stub(MessageBox, "error");

        this.oController.onDataReceived(oEvent);

        assert.ok(this.oList.setBusy.calledOnceWithExactly(false), "busy=false");
        assert.ok(this.oResourceBundle.getText.calledWith("viewProductListErrorLoad"), "i18n key resolved");
        assert.ok(oMessageBoxStub.calledOnce, "MessageBox.error called");
        assert.strictEqual(oMessageBoxStub.firstCall.args[0], "Load error", "message text passed");
        assert.deepEqual(oMessageBoxStub.firstCall.args[1], { details: "boom" }, "details passed");
        oMessageBoxStub.restore();
    });

    QUnit.test("onUnitPriceObjectListItemPress navigates to RouteProductDetail with ProductID", function (assert) {
        var oContext = { getProperty: sinon.stub().withArgs("ProductID").returns(42) };
        oContext.getProperty.returns(42);
        var oSource = { getBindingContext: sinon.stub().withArgs("northwind").returns(oContext) };
        oSource.getBindingContext.returns(oContext);
        var oEvent = { getSource: sinon.stub().returns(oSource) };

        this.oController.onUnitPriceObjectListItemPress(oEvent);

        assert.ok(this.oRouter.navTo.calledOnce, "navTo called");
        assert.strictEqual(this.oRouter.navTo.firstCall.args[0], "RouteProductDetail", "route name");
        assert.deepEqual(this.oRouter.navTo.firstCall.args[1], { ProductID: 42 }, "ProductID passed");
    });
});
