
/**
 * @class A console reference to the Firebug console.  This will work with both Firebug and FirebugLite.
 * @extends R.debug.ConsoleRef
 */
R.util.console.Firebug = function() {
    return R.debug.ConsoleRef.extend(/** @scope R.util.console.Firebug.prototype **/{

        constructor:function () {
        },

        resolved: function() {
            R.debug.Console.setConsoleRef(new R.debug.Firebug());
        },

        /**
         * Write a debug message to the console
         */
        info:function () {
            if (typeof firebug !== "undefined") {
                firebug.d.console.log.apply(firebug.d.console, arguments);
            } else {
                console.info.apply(console, arguments);
            }
        },

        /**
         * Write a debug message to the console
         */
        debug:function () {
            if (typeof firebug !== "undefined") {
                firebug.d.console.log.apply(firebug.d.console, arguments);
            } else {
                console.debug.apply(console, arguments);
            }
        },

        /**
         * Write a warning message to the console
         */
        warn:function () {
            if (typeof firebug !== "undefined") {
                firebug.d.console.log.apply(firebug.d.console, arguments);
            } else {
                console.warn.apply(console, arguments);
            }
        },

        /**
         * Write an error message to the console
         */
        error:function () {
            if (typeof firebug !== "undefined") {
                firebug.d.console.log.apply(firebug.d.console, arguments);
            } else {
                console.error.apply(console, arguments);
            }
        },

        /**
         * Write a stack trace to the console
         */
        trace:function () {
            if (typeof firebug !== "undefined") {
                console.trace.apply(arguments);
            }
        }
    }, {
        resolved: function() {
            setTimeout(function() {
                R.debug.Console.setConsoleRef(new R.util.console.Firebug());
            }, 250);
        },

        /**
         * Get the class name of this object
         *
         * @return {String} The string "R.util.console.Webkit"
         */
        getClassName:function () {
            return "R.util.console.Firebug";
        }

    });
};

// The class this file defines and its required classes
R.Engine.define({
    "class":"R.util.console.Firebug"
});
