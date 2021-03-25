const findSubStr = require("../src/index");
let assert = require('chai').assert;

describe("Find substring from a string", function(){
    describe("Substring search ", function(){
        it('case insensitive should work', () => {
            // assert.equal(2,3);
            let positions = findSubStr("Peter told me (actually he slurred) that peter the pickle piper a pitted pickle before he petered out. Phew!".toLowerCase(), "Peter".toLowerCase())
            assert.equal(positions, "1, 42, 91");
          });
      }),
      describe("Substring search ", function(){
        it('case insensitive should work with different data set', () => {
            // assert.equal(2,3);
            let positions = findSubStr("Peter told me (actually he slurred) that peter the pickle piper a pitted pickle before he petered out. Phew!".toLowerCase(), "Phew".toLowerCase())
            assert.equal(positions, "104");
          });
      }),
      describe("Substring search ", function(){
        it('should return NOT_FOUND when sub string is not present in string', () => {
            // assert.equal(2,3);
            let positions = findSubStr("Peter told me (actually he slurred) that peter the pickle piper a pitted pickle before he petered out. Phew!".toLowerCase(), "really".toLowerCase())
            assert.equal(positions, "NOT_FOUND");
          });
      }),
      describe("Substring search ", function(){
        it('should return NOT_FOUND when sub string is greater in length than string', () => {
            // assert.equal(2,3);
            let positions = findSubStr("Peter told me".toLowerCase(), "Peter told me a secret".toLowerCase())
            assert.equal(positions, "NOT_FOUND");
          });
      })
})