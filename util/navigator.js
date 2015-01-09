// macro-navigator
// simplify driving the browser to registered locations/states
"use strict";

function Navigator (options) {
    if (!options.driver) {
        throw new Error("Driver not found");
    }
    this.driver = options.driver;
}
module.exports = Navigator;
