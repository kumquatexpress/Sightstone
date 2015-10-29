##Sightstone: A lightweight js wrapper for the Riot API

Based off of the gem ruby_sightstone. Uses q to create promises of request responses.

`npm install --save sightstone`

Examples:
```
var Sightstone = require('sightstone');

let ss = new Sightstone(api_key, region);
ss.champions().then(function(body){
	//do stuff with body of response
}, function(error){
	console.log("Error occured! " + error);
})

ss.summoner("excessively").then(function(body){
	console.log("body["id"] is trash");
})
```

Each request can take a params object that matches the params for the API endpoint, by default empty.

### Release History

* 0.0.1 Initial release