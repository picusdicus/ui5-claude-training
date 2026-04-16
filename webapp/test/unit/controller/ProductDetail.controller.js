/* global QUnit, sinon */
sap.ui.define([
    "ui5/claude/controller/ProductDetail.controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (ProductDetailController, History, MessageBox) {
    "use strict";

    // Namespace: ui5.claude.test.unit.controller.ProductDetail

    QUnit.module("ui5.claude.test.unit.controller.ProductDetail", {
        beforeEach: function () {
            // Arrange — shared controller under test
            this.oController = new ProductDetailController();

            // View stub — captures bindElement arguments for later inspection
            this.oView = {
                bindElement: sinon.stub(),
                setBusy: sinon.stub()
            };
            this.oGetViewStub = sinon.stub(this.oController, "getView").returns(this.oView);

            // Router + Route stubs — wired to owner component
            this.oRoute = {
                attachPatternMatched: sinon.stub()
            };
            this.oRouter = {
                getRoute: sinon.stub().returns(this.oRoute),
                navTo: sinon.stub()
            };
            this.oComponent = {
                getRouter: sinon.stub().returns(this.oRouter)
            };
            this.oGetOwnerComponentStub = sinon.stub(this.oController, "getOwnerComponent")
                .returns(this.oComponent);
        },
        afterEach: function () {
            this.oGetViewStub.restore();
            this.oGetOwnerComponentStub.restore();
        }
    });

    // -----------------------------------------------------------------------
    // onInit
    // -----------------------------------------------------------------------

    QUnit.test("onInit attaches pattern-matched handler on RouteProductDetail", function (assert) {
        // Arrange — done in beforeEach

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.oComponent.getRouter.calledOnce, "router obtained from owner component");
        assert.ok(
            this.oRouter.getRoute.calledWith("RouteProductDetail"),
            "RouteProductDetail route fetched by name"
        );
        assert.ok(this.oRoute.attachPatternMatched.calledOnce, "attachPatternMatched called once");
        assert.strictEqual(
            this.oRoute.attachPatternMatched.firstCall.args[0],
            this.oController._onRouteMatched,
            "handler registered is _onRouteMatched"
        );
        assert.strictEqual(
            this.oRoute.attachPatternMatched.firstCall.args[1],
            this.oController,
            "listener context is the controller"
        );
    });

    QUnit.test("onInit — edge case: route lookup returns undefined throws (defensive check)", function (assert) {
        // Arrange — simulate misconfigured manifest where the route is missing
        this.oRouter.getRoute.returns(undefined);

        // Act + Assert
        assert.throws(
            function () {
                this.oController.onInit();
            }.bind(this),
            "onInit throws when RouteProductDetail is not defined in the router"
        );
    });

    // -----------------------------------------------------------------------
    // _onRouteMatched — happy path
    // -----------------------------------------------------------------------

    QUnit.test("_onRouteMatched binds element with correct path, model and $select", function (assert) {
        // Arrange
        var oEvent = {
            getParameter: sinon.stub().returns({ ProductID: 42 })
        };

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert
        assert.ok(oEvent.getParameter.calledWith("arguments"), "route arguments read from event");
        assert.ok(this.oView.bindElement.calledOnce, "view.bindElement called once");

        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(oBindCfg.path, "/Products(42)", "path built from ProductID");
        assert.strictEqual(oBindCfg.model, "northwind", "model id is northwind");
        assert.strictEqual(
            oBindCfg.parameters.$select,
            "ProductID,ProductName,UnitPrice,UnitsInStock,UnitsOnOrder,QuantityPerUnit,Discontinued",
            "$select contains all detail fields and nothing else"
        );
        assert.strictEqual(typeof oBindCfg.events.dataRequested, "function", "dataRequested handler wired");
        assert.strictEqual(typeof oBindCfg.events.dataReceived, "function", "dataReceived handler wired");
    });

    QUnit.test("_onRouteMatched dataRequested event sets view busy true", function (assert) {
        // Arrange
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: 1 }) };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        // Act
        oBindCfg.events.dataRequested();

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(true), "view.setBusy(true) invoked");
    });

    QUnit.test("_onRouteMatched dataReceived without error clears busy and does NOT show MessageBox", function (assert) {
        // Arrange
        var oMessageBoxStub = sinon.stub(MessageBox, "error");
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: 1 }) };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        var oDataEvent = { getParameter: sinon.stub().returns(undefined) };

        // Act
        oBindCfg.events.dataReceived(oDataEvent);

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(false), "view.setBusy(false) invoked");
        assert.ok(oMessageBoxStub.notCalled, "MessageBox.error NOT called on happy path");

        oMessageBoxStub.restore();
    });

    // -----------------------------------------------------------------------
    // _onRouteMatched — edge cases
    // -----------------------------------------------------------------------

    QUnit.test("_onRouteMatched dataReceived WITH error clears busy and shows MessageBox.error", function (assert) {
        // Arrange — simulate a failed OData request
        var oMessageBoxStub = sinon.stub(MessageBox, "error");
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: 7 }) };
        this.oController._onRouteMatched(oEvent);
        var oBindCfg = this.oView.bindElement.firstCall.args[0];

        var oError = { message: "network down" };
        var oDataEvent = { getParameter: sinon.stub().returns(oError) };

        // Act
        oBindCfg.events.dataReceived(oDataEvent);

        // Assert
        assert.ok(this.oView.setBusy.calledOnceWithExactly(false), "busy flag cleared on error");
        assert.ok(oMessageBoxStub.calledOnce, "MessageBox.error called once");
        assert.strictEqual(
            oMessageBoxStub.firstCall.args[0],
            "network down",
            "error message surfaced to the user"
        );

        oMessageBoxStub.restore();
    });

    QUnit.test("_onRouteMatched — edge case: missing ProductID route param yields '/Products(undefined)'", function (assert) {
        // Arrange — simulate a malformed URL where ProductID is absent
        var oEvent = { getParameter: sinon.stub().returns({}) };

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert — behavior is documented: controller does not currently guard against missing param.
        // We verify the path is deterministic so a regression (e.g., crash) would be caught.
        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(
            oBindCfg.path,
            "/Products(undefined)",
            "path reflects missing ProductID — documents current behavior"
        );
        assert.strictEqual(oBindCfg.model, "northwind", "model remains northwind even with bad args");
    });

    QUnit.test("_onRouteMatched — edge case: null ProductID yields '/Products(null)'", function (assert) {
        // Arrange
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: null }) };

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert
        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(oBindCfg.path, "/Products(null)", "null ProductID stringified into path");
    });

    QUnit.test("_onRouteMatched — edge case: empty-string ProductID yields '/Products()'", function (assert) {
        // Arrange
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: "" }) };

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert
        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(oBindCfg.path, "/Products()", "empty ProductID produces empty key segment");
    });

    QUnit.test("_onRouteMatched — edge case: string ProductID passed through unchanged", function (assert) {
        // Arrange — OData V4 accepts numeric keys, but the raw value should flow through
        var oEvent = { getParameter: sinon.stub().returns({ ProductID: "42" }) };

        // Act
        this.oController._onRouteMatched(oEvent);

        // Assert
        var oBindCfg = this.oView.bindElement.firstCall.args[0];
        assert.strictEqual(oBindCfg.path, "/Products(42)", "string key concatenated as-is");
    });

    // -----------------------------------------------------------------------
    // onPageProductDetailNavButtonPress
    // -----------------------------------------------------------------------

    QUnit.test("onPageProductDetailNavButtonPress goes back in history when previous hash exists", function (assert) {
        // Arrange
        var oHistoryInstance = { getPreviousHash: sinon.stub().returns("#/some/previous") };
        var oHistoryStub = sinon.stub(History, "getInstance").returns(oHistoryInstance);
        var oGoStub = sinon.stub(window.history, "go");

        // Act
        this.oController.onPageProductDetailNavButtonPress();

        // Assert
        assert.ok(oGoStub.calledOnceWithExactly(-1), "window.history.go(-1) invoked");
        assert.ok(this.oRouter.navTo.notCalled, "router.navTo NOT used when history exists");

        oHistoryStub.restore();
        oGoStub.restore();
    });

    QUnit.test("onPageProductDetailNavButtonPress navigates to RouteProductList when previous hash is undefined", function (assert) {
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
        assert.deepEqual(this.oRouter.navTo.firstCall.args[1], {}, "empty params object");
        assert.deepEqual(this.oRouter.navTo.firstCall.args[2], {}, "empty components object");
        assert.strictEqual(this.oRouter.navTo.firstCall.args[3], true, "replace flag is true (no extra history entry)");

        oHistoryStub.restore();
        oGoStub.restore();
    });

    QUnit.test("onPageProductDetailNavButtonPress — edge case: previous hash is empty string still goes back", function (assert) {
        // Arrange — empty string is !== undefined, so the controller should navigate back in history.
        var oHistoryInstance = { getPreviousHash: sinon.stub().returns("") };
        var oHistoryStub = sinon.stub(History, "getInstance").returns(oHistoryInstance);
        var oGoStub = sinon.stub(window.history, "go");

        // Act
        this.oController.onPageProductDetailNavButtonPress();

        // Assert
        assert.ok(oGoStub.calledOnceWithExactly(-1), "empty-string hash is treated as 'has history'");
        assert.ok(this.oRouter.navTo.notCalled, "navTo skipped for empty-string hash");

        oHistoryStub.restore();
        oGoStub.restore();
    });
});
