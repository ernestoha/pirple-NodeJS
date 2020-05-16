/**
 * Lib
 */
var lib = {};

lib.numberFrom0to10 = function(){
    return Math.floor((Math.random() * 10) + 1);
}

lib.checkPalindrome = function(str){
    return str == str.split('').reverse().join('');
}

// Export the lib
module.exports = lib;