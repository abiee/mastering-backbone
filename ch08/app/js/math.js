var math = {
  sum(a, b) {
    return a + b;
  },

  asyncSum(a, b, callback) {
    // Will respond after 1.5 seconds.
    setTimeout(function() {
      callback(a + b);
    }, 500);
  },

  substract(a, b) {
    return a - b;
  },

  divide(a, b) {
    if (b === 0) {
      throw new Error('Can not divide by zero');
    }

    return a / b;
  }
};

module.exports = math;
