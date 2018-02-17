var uiWidgets;
uiWidgets = uiWidgets || {};

uiWidgets.utils = {};

/**
 * A modulo operator that doesn't allow negative numbers.
 * @param divdend
 * @param divisor
 */
uiWidgets.utils.modulo = function(dividend, divisor) {
    "use strict";
    return ((((dividend) % divisor) + divisor) % divisor);
};

/**
 * Select an operator action using a string value */
uiWidgets.utils.operators = {
    "+": function (a, b) { return a + b; },
    "-": function (a, b) { return a - b; }
};
