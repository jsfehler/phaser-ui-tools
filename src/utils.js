const utils = {};

/**
 * @private
 * A modulo operator that doesn't allow negative numbers.
 * @param {number} dividend
 * @param {number} divisor
 * @returns {number}
 */
utils.modulo = function modulo(dividend, divisor) {
    return ((((dividend) % divisor) + divisor) % divisor);
};

/**
 * @private
 * Select an operator action using a string value.
 */
utils.operators = {
    '+': function add(a, b) { return a + b; },
    '-': function sub(a, b) { return a - b; },
};

export { utils };
