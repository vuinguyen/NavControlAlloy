function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    exports.destroy = function() {};
    _.extend($, $.__views);
    var NavigationController = require("NavigationController"), navController = new NavigationController;
    Alloy.Globals.navcontroller = navController;
    var testwin = Alloy.createController("TestWindow").getView();
    Alloy.Globals.navcontroller.open(testwin);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, $model;

module.exports = Controller;