var should = require('chai').should(),
    Sightstone = require('../lib/sightstone')

describe('#constructor', function() {
    it("makes a new sightstone object given an api key and region", function() {
        var ss = new Sightstone("test", "na");
        (ss.api_key).should.equal("test");
        (ss.region).should.equal("na");
    });

    it("fails requests when given non-object params", function() {
        var ss = new Sightstone("test", "");
        (ss.champions("invalid params", {}).catch(function(err) {
            err.should.equal(new Error("Cannot use non-object params"));
        }))
    });
});
