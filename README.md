##Sightstone: A lightweight js wrapper for the Riot API

Based off of the gem ruby_sightstone. Uses q to create promises of request responses.

`npm install --save sightstone`

Examples:
```
var Sightstone = require('sightstone');

let ss = new Sightstone(api_key, region, {port: 6679}); //third argument is an optional object of redis options
ss.champions().then(function(body){
	//do stuff with body of response
}, function(error){
	console.log("Error occured! " + error);
})

ss.champions({cache:true}) //to cache a given response, optional ttl (default is 900)
ss.champions({cache:false}) //to explicitly delete this call from the cache if it exists

ss.summoner("excessively").then(function(body){
	console.log("body["id"] is trash");
})
```

Each request can take a params object that matches the params for the API endpoint, by default empty.

### Release History

* 0.0.3 Ability to cache with redis optionally
* 0.0.2 More routes added
* 0.0.1 Initial release
