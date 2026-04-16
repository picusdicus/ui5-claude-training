/* global QUnit, sinon */
sap.ui.define([
    "ui5/claude/controller/ProductDetail.controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (ProductDetailController, History, MessageBox) {
    "use strict";

    QUnit.module("ProductDetail Controller", {
        beforeEach: function () {
            this.oController = new ProductDetailController();

            // View stub — captures the bindElement arguments for inspection
            this.oView = {
                bindElement: sinon.stub(),
                setBusy: sinon.stub()
            };
            this.oGetViewStub = sinon.stub(this.oController, "getView").returns(this.oView);

            // Route stub captured by onInit
            this.oRoute = { attachPatternMatched: sinon.stub() };
            this.oRouter = {
                getRoute: sinon.stub().withArgs("RouteProductDetail").returns(this.oRoute),
                navTo: sinon.stub()
            };
            this.oRouter.getRoute.returns(this.oRoute);

            this.oComponent = {
                getRouter: sinon.stub().returns(this.oRouter)
            };
            this.oGetOwnerComponentStub = sinon.stub(this.oController, "getOwnerComponent").returns(this.oComponent);
        },
        afterEach: function () {
            this.oGetViewStub.restore();
            this.oGetOwnerComponentStub.restore();
        }
    });

    // --- onInit ---------------------------------------------------------

    QUnit.test("onInit attaches pattern-matched handler on RouteProductDetail", function (assert) {
        // Arrange — done in beforeEach

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.oComponent.getRouter.calledOnce, "router obtained from owner component");
        assert.ok(this.oRouter.getRoute.calledWith("RouteProductDetail"), "RouteProductDetail route fetched");
        assert.ok(this.oRoute.attachPatternMatched.calledOnce, "attachPatternMatched called once");
        assert.strictEqual(
            this.oRoute.attachPatternMatched.firstCall.args[0],
            this.oController._onRouteMatched,
            "handler is _onRouteMatched"
        );
        assert.strictEqual(
            this.oRoute.attachPatternMatched.firstCall.args[1],
            this.oController,
            "listener is bound to controller"
        );
    });

    // --- _onRouteMatched ------------------------------------------------

    QUnit.test("_onRouteMatched binds element with correct path, model and $select", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sinon.stub().withArgs("arguments").returns({ ProductID: 42 })
        };
        oEvent.getParameter.returns({ ProductID: 42 });

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert
        assert.ok(this.oView.bindElement.calledOnce, "bindElement called once");
        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(oBindCfg.path, "/Products(42)", "path built from ProductID");
        assert.strictEqual(oBindCfg.model, "northwind", "model id is northwind");
        assert.strictEqual(
            oBindCfg.parameters.$select,
            "ProductID,ProductName,UnitPrice,UnitsInStock,UnitsOnOrder,QuantityPerUnit,Discontinued",
            "$select includes all detail fields"
        );
        assert.strictEqual(typeof oBindCfg.events.dataRequested, "function", "dataRequested handler provided");
        assert.strictEqual(typeof oBindCfg.events.dataReceived, "function", "dataReceived handler provided");
    });

    QUnit.test("_onRouteMatched dataRequested sets view busy true", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sinon.stub().returns({ ProductID: 1 })
        };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        // Act
        oBindCfg.events.dataRequested();

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(true), "view set busy true");
    });

    QUnit.test("_onRouteMatched dataReceived without error clears busy and does not show MessageBox", function (assert) {
        // Arrange
        var oMessageBoxStub = sinon.stub(MessageBox, "error");
        var oEvent = {
            getParameter: sinon.stub().returns({ ProductID: 1 })
        };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        var oDataEvent = { getParameter: sinon.stub().withArgs("error").returns(undefined) };
        oDataEvent.getParameter.returns(undefined);

        // Act
        oBindCfg.events.dataReceived(oDataEvent);

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(false), "view set busy false");
        assert.ok(oMessageBoxStub.notCalled, "MessageBox.error not called on happy path");

        oMessageBoxStub.restore();
    });

    QUnit.test("_onRouteMatched dataReceived with error clears busy and shows MessageBox.error", function (assert) {
        // Arrange
        var oMessageBoxStub = sinon.stub(MessageBox, "error");
        var oEvent = {
            getParameter: sinon.stub().returns({ ProductID: 7 })
        };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        var oError = { message: "network down" };
        var oDataEvent = { getParameter: sinon.stub().withArgs("error").returns(oError) };
        oDataEvent.getParameter.returns(oError);

        // Act
        oBindCfg.events.dataReceived(oDataEvent);

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(false), "view set busy false");
        assert.ok(oMessageBoxStub.calledOnce, "MessageBox.error called once");
        assert.strictEqual(oMessageBoxStub.firstCall.args[0], "network down", "error message passed");

        oMessageBoxStub.restore();
    });

    // --- onPageProductDetailNavButtonPress ------------------------------

    QUnit.test("onPageProductDetailNavButtonPress goes back in history when previous hash exists", function (assert) {
        // Arrange
        var oHistoryInstance = { getPreviousHash: sinon.stub().returns("#/some/previous") };
        var oHistoryStub = sinon.stub(History, "getInstance").returns(oHistoryInstance);
        var oGoStub = sinon.stub(window.history, "go");

        // Act
        this.oController.onPageProductDetailNavButtonPress();

        // Assert
        assert.ok(oGoStub.calledOnceWithExactly(-1), "window.history.go(-1) invoked");
        assert.ok(this.oRouter.navTo.notCalled, "router.navTo not used when history exists");

        oHistoryStub.restore();
        oGoStub.restore();
    });

    QUnit.test("onPageProductDetailNavButtonPress navigates to RouteProductList when no previous hash", function (assert) {
        // Arrange
        var oHistoryInstance = { getPreviousHash: sinon.stub().returns(undefined) };
        var oHistoryStub = sinon.stub(History, "getInstance").returns(oHistoryInstance);
        var oGoStub = sinon.stub(window.history, "go");

        // Act
        this.oController.onPageProductDetailNavButtonPress();

        // Assert
        assert.ok(oGoStub.notCalled, "window.history.go not called without previous hash");
        assert.ok(this.oRouter.navTo.calledOnce, "router.navTo called once");
        assert.strictEqual(this.oRouter.navTo.firstCall.args[0], "RouteProductList", "route is RouteProductList");
        assert.deepEqual(this.oRouter.navTo.firstCall.args[1], {}, "empty params");
        assert.deepEqual(this.oRouter.navTo.firstCall.args[2], {}, "empty components");
        assert.strictEqual(this.oRouter.navTo.firstCall.args[3], true, "replace flag true");

        oHistoryStub.restore();
        oGoStub.restore();
    });
});
