var req = require('request'),
    Q = require('q'),
    assign = require('object-assign');

class Sightstone {
  constructor(api_key, region){
    this.api_key = api_key;
    this.region = region;
    this.base_params = {api_key: this.api_key};
    this.base_url = "https://na.api.pvp.net/api/lol";
  }
  static validate_and_respond(url, params){
    let defer = Q.defer();
    let request = {url: url, qs: params};

    if(typeof(params) === "object"){
      assign(params, this.base_params, params);  
    } else {
      defer.reject(new Error("Cannot use non-object params"));
      return defer.promise;
    }
    req(request, function(err, resp, body){
      if(resp.statusCode != 200){
        defer.reject(new Error(body));
      } else {
        defer.resolve(body);
      }
    });
    return defer.promise;
  }
  champions(params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v1.2/champion`, params);
  }
  recentGames(summoner_id, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v1.3/game/by-summoner/${summoner_id}/recent`, params);
  }
  league(summoner_ids, params={}){
    if(typeof(summoner_ids) === "object"){
      summoner_ids = summoner_ids.join(",");
    }
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v2.5/league/by-summoner/${summoner_ids}`, params);
  }
  matchlist(summoner_id, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v2.2/matchlist/by-summoner/${summoner_id}`, params);
  }
  static_data(type, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/static-data/${this.region}/v1.2/${type}`, params);
  }
  match(match_id, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v2.2/match/${match_id}`, params);
  }
  summoner(names, params={}){
    if(typeof(names) === "object"){
      names = names.join(",");
    }
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v1.4/summoner/by-name/${names}`, params);
  }
  stats_ranked(summoner_id, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v1.3/stats/by-summoner/${summoner_id}/ranked`, params);    
  }
  stats_summary(summoner_id, params={}){
    return Sightstone.validate_and_respond(
      `${this.base_url}/${this.region}/v1.3/stats/by-summoner/${summoner_id}/summary`, params);    
  }
}

module.exports = Sightstone;
