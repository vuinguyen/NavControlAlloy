function NavigationController() {
    this.windowStack = [];
}

NavigationController.prototype.open = function(windowToOpen) {
    Ti.API.log("Open function.");
    this.windowStack.push(windowToOpen);
    var that = this, lastPushed = windowToOpen;
    windowToOpen.addEventListener("close", function() {
        if (that.windowStack.length > 1) {
            Ti.API.log("Event 'close': " + this.title);
            var popped = that.windowStack.pop();
            if (lastPushed != popped) {
                Ti.API.info("Last window should NOT have been popped. Push it back on the stack!");
                that.windowStack.push(popped);
            }
            if (this.toClose) {
                Ti.API.log("Invoke close on dependent window:" + this.toClose.title);
                that.navGroup ? that.navGroup.close(this.toClose, {
                    animated: !1
                }) : this.toClose.close({
                    animated: !1
                });
            }
            if (this.toOpen) {
                Ti.API.log("Invoke open on dependent window:" + this.toOpen.title);
                that.open(this.toOpen);
            }
            Ti.API.log("End event 'close'. Stack: " + that.windowStack.map(function(v) {
                return v.title;
            }));
        }
    });
    windowToOpen.addEventListener("set.to.close", function(dict) {
        Ti.API.log("Event 'set.to.close': " + this.title);
        this.toClose = dict.win;
    });
    windowToOpen.addEventListener("set.to.open", function(dict) {
        Ti.API.log("Event 'set.to.open': " + this.title);
        this.toOpen = dict.win;
    });
    windowToOpen.navBarHidden = windowToOpen.navBarHidden || !1;
    if (this.windowStack.length === 1) if (Ti.Platform.osname === "android") {
        windowToOpen.exitOnClose = !0;
        windowToOpen.open();
    } else {
        this.navGroup = Ti.UI.iPhone.createNavigationGroup({
            window: windowToOpen
        });
        var containerWindow = Ti.UI.createWindow();
        containerWindow.add(this.navGroup);
        containerWindow.open();
    } else Ti.Platform.osname === "android" ? windowToOpen.open() : this.navGroup.open(windowToOpen);
    Ti.API.log("End Open. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

NavigationController.prototype.home = function() {
    Ti.API.log("Home function.");
    if (this.windowStack.length > 1) {
        for (var i = this.windowStack.length - 1; i > 1; i--) this.windowStack[i].fireEvent("set.to.close", {
            win: this.windowStack[i - 1]
        });
        this.navGroup ? this.navGroup.close(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
    }
    Ti.API.log("End Home. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

NavigationController.prototype.openFromHome = function(windowToOpen) {
    Ti.API.log("openFromHome function.");
    if (this.windowStack.length == 1) this.open(windowToOpen); else {
        this.windowStack[1].fireEvent("set.to.open", {
            win: windowToOpen
        });
        this.home();
    }
    Ti.API.log("End openFromHome. Stack: " + this.windowStack.map(function(v) {
        return v.title;
    }));
};

module.exports = NavigationController;