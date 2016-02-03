var math = require('../app/js/math');

describe('Basic mathematic functions', () => {
  it('should result 4 the sum of 2 + 2', () => {
    expect(math.sum(2, 2)).toBe(4);
  });

  it('sums two numbers asynchronously', done => {
    math.asyncSum(2, 2, function(result) {
      expect(result).toEqual(4);
      done();
    });
  });

  it('should result 1 the substract of 3 - 2', () => {
    expect(math.substract(3, 2)).toBe(1);
  });

  it('should result 3 the division of 9 / 3', () => {
    expect(math.divide(9, 3)).toBe(3);
  });

  it('should throw an error when divide by zero', () => {
    expect(() => math.divide(9, 0)).toThrowError();
  });
});
