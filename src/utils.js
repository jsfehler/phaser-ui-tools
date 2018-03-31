const utils = {};

/**
 * A modulo operator that doesn't allow negative numbers.
 * @param {number} divdend
 * @param {number} divisor
 */
utils.modulo = function modulo(dividend, divisor) {
    return ((((dividend) % divisor) + divisor) % divisor);
};

/**
 * Select an operator action using a string value.
 */
utils.operators = {
    '+': function add(a, b) { return a + b; },
    '-': function sub(a, b) { return a - b; },
};

export { utils };
