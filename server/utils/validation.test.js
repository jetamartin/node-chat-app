const expect = require('expect');

// import isRealString
const {isRealString} = require('./validation');

// isRealString
  // should reject non-string values
  describe('isRealString', () => {
    it('should reject non-string values', () => {
      var arg = 5;
      var result = isRealString(arg);
      expect(result).toBe(false);
    });

  // should reject string with only spaces
  it('should reject string with only spaces', () => {
    var arg = '  ';
    var result = isRealString(arg);
    expect(result).toBe(false);
  })
  // should allow strings with non-space characters
  it('should allow strings with non-space characters', () => {
    var arg = ' L O R    ';
    var result = isRealString(arg);
    expect(result).toBe(true);
  })
})
