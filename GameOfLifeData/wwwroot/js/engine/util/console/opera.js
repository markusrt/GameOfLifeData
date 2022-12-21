
/**
 * @class A debug console for Opera browsers.
 * @extends R.debug.ConsoleRef
 */
R.util.console.Opera = function() {
    R.debug.ConsoleRef.extend(/** @scope R.util.console.Opera.prototype **/{

        constructor:function () {
        },

        resolved: function() {
            R.debug.Console.setConsoleRef(new R.debug.Opera());
        },

        /**
         * Write a debug message to the console
         */
        info:function () {
            window.opera.postError(this.fixArgs(arguments));
        },

        /**
         * Write a debug message to the console
         */
        debug:function () {
            window.opera.postError(["[D]", this.fixArgs(arguments)]);
        },

        /**
         * Write a warning message to the console
         */
        warn:function () {
            window.opera.postError(["[W]", this.fixArgs(arguments)]);
        },

        /**
         * Write an error message to the console
         */
        error:function () {
            window.opera.postError(["[E!]", this.fixArgs(arguments)]);
        }

    }, {
        resolved: function() {
            setTimeout(function() {
                R.debug.Console.setConsoleRef(new R.util.console.Opera());
            }, 250);
        },

        /**
         * Get the class name of this object
         *
         * @return {String} The string "R.util.console.Webkit"
         */
        getClassName:function () {
            return "R.util.console.Opera";
        }

    });
};

// The class this file defines and its required classes
R.Engine.define({
    "class":"R.util.console.Opera"
});

