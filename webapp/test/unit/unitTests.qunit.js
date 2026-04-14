/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ui5claude/ui5-claude/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
