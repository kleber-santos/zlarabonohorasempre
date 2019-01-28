jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"whr/com/br/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"whr/com/br/test/integration/pages/Worklist",
		"whr/com/br/test/integration/pages/Object",
		"whr/com/br/test/integration/pages/NotFound",
		"whr/com/br/test/integration/pages/Browser",
		"whr/com/br/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "whr.com.br.view."
	});

	sap.ui.require([
		"whr/com/br/test/integration/WorklistJourney",
		"whr/com/br/test/integration/ObjectJourney",
		"whr/com/br/test/integration/NavigationJourney",
		"whr/com/br/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});