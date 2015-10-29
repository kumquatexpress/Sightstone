var should = require('chai').should(),
		Sightstone = require('../lib/sightstone')

describe('#constructor', function(){
	it("makes a new sightstone object given an api key and region", function(){
		var ss = new Sightstone("test", "na");
		(ss.api_key).should.equal("test");
		(ss.region).should.equal("na");
	});
	it("makes an http request to the riot api", function(){
		var ss = new Sightstone("092ae6cc-f0a4-4dea-ae7b-06d5af385c7f", "na");
		var c = ss.champions();
		console.log(typeof(c));
	});
});