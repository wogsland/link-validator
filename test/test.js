var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var jsdom = require('mocha-jsdom'); // This is necessary for testing jQuery in Mocha

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

// bring in the regex code
var path = 'regex-weburl.js';
var code = fs.readFileSync(path);
vm.runInThisContext(code);

describe('validate-links.js', function () {

    // setup jquery
    jsdom();
    before(function () {
        $ = require('jquery');
    });

    // set up the document
    var doc = require('jsdom').jsdom;
    document = doc(fs.readFileSync('index.html'));

    // includes file to test
    var path = 'validate-links.js';
    var code = fs.readFileSync(path);

    describe('running', function () {
        it('this test is here to run the JavaScript with jQuery', function () {
            assert.notEqual(false, vm.runInThisContext(code));
        });
    });

    var linkList = [];
    var badLinks;

    describe('good links', function () {
        it('this tests an empty list', function () {
            badLinks = validateLinks(linkList);
            assert.deepEqual([], badLinks);
        });
        it('this tests a single good link', function () {
            linkList.push('http://www.wogsland.org');
            badLinks = validateLinks(linkList);
            assert.deepEqual([], badLinks);
        });
    });

    var badLinkList = [];
    var notAUrl = 'not a url';
    var alsoNotAUrl = 'gobbledy.gook';
    var a404Url = 'http://www.wogsland.org/not/a/real/url';
    describe('bad links', function () {
        var badResponse = [];
        it('this tests a malformed URL', function () {
            badLinkList.push(notAUrl);
            badLinks = validateLinks(badLinkList);
            badResponse.push({"url":notAUrl, "reason":"invalid url"});
            assert.deepEqual(badResponse, badLinks);
        });
        it('this tests multiple malformed URLs', function () {
            badLinkList.push(alsoNotAUrl);
            badLinks = validateLinks(badLinkList);
            badResponse.push({"url":alsoNotAUrl, "reason":"invalid url"});
            assert.deepEqual(badResponse, badLinks);
        });
        it('this tests multiple malformed URLs plus a 404 HTTP status error', function () {
            badLinkList.push(a404Url);
            badLinks = validateLinks(badLinkList);
            badResponse.push({"url":a404Url, "reason":"error"});
            assert.deepEqual(badResponse, badLinks);
        });
    });
});
