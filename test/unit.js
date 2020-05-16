/*
 * Unit Tests
 *
 */

// Dependencies
var lib = require('./../app/lib.js');
var assert = require('assert');

// Holder for Tests
var unit = {};


// Assert that the getANumber function is returning a number
unit['lib.numberFrom0to10 should return a number'] = function(done){
  var val = lib.numberFrom0to10();
  assert.equal(typeof(val), 'number');
  done();
};

unit['lib.numberFrom0to10 should return a number between 0 and 10'] = function(done){
  var val = lib.numberFrom0to10();
  assert.ok(((val >= 0) && (val <= 10)));
  done();
};

unit['lib.numberFrom0to10 should return a number equal 2'] = function(done){
  var val = lib.numberFrom0to10();
  assert.equal(val, 2);
  done();
};

unit['lib.numberFrom0to10 should return a number between 0 and 10'] = function(done){
  var val = lib.numberFrom0to10();
  assert.ok(((val >= 0) && (val <= 10)));
  done();
};

unit['lib.checkPalindrome 0123210'] = function(done){
  var val = lib.checkPalindrome("0123210");
  assert.ok(val);
  done();
};

// Export the tests to the runner
module.exports = unit;