var req = require('request'),
    Q = require('q'),
    redis = require('redis');

class Sightstone {
  constructor(api_key, region, redis_options = undefined){
    if(typeof(redis_options) === 'object'){
      this.redis = redis.createClient(redis_options);
    }
    this.api_key = api_key;
    this.region = region;
    this.base_params = {api_key: this.api_key};
    this.base_url = "https://na.api.pvp.net/api/lol";
  }
  cacheResponse(url, response, ttl=900){
    this.redis.set(url, response);
    this.redis.expire(url, ttl);
  }
  validateAndRespond(url, params){
    let defer = Q.defer();
    if(typeof(params) === "object"){
      Object.assign(params, this.base_params, params);
    } else {
      defer.reject(new Error("Cannot use non-object params"));
      return defer.promise;
    }

    var {cache, ttl, params} = Sightstone.destructureParams(params);
    let redisKey = url + JSON.stringify(params);
    if(cache === false){
      this.redis.del(redisKey);
    }
    this.redis.get(redisKey, function(err, val){
      if(val){
        defer.resolve(val);
        return defer.promise;
      }
    });

    let request = {url: url, qs: params};
    req(request, (err, resp, body) => {
      if(resp.statusCode != 200){
        defer.reject(new Error(body));
      } else {
        defer.resolve(body);
        if(cache === true){
          this.cacheResponse(redisKey, body, ttl);
        }
      }
    });
    return defer.promise;
  }
  champions(params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v1.2/champion`, params);
  }
  recentGames(summoner_id, params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v1.3/game/by-summoner/${summoner_id}/recent`, params);
  }
  league(summoner_ids, params={}){
    if(typeof(summoner_ids) === "object"){
      summoner_ids = summoner_ids.join(",");
    }
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v2.5/league/by-summoner/${summoner_ids}`, params);
  }
  matchlist(summoner_id, params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v2.2/matchlist/by-summoner/${summoner_id}`, params);
  }
  static_data(type, params={}){
    return this.validateAndRespond(
      `${this.base_url}/static-data/${this.region}/v1.2/${type}`, params);
  }
  match(match_id, params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v2.2/match/${match_id}`, params);
  }
  summoner(names, params={}){
    if(typeof(names) === "object"){
      names = names.join(",");
    }
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v1.4/summoner/by-name/${names}`, params);
  }
  stats_ranked(summoner_id, params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v1.3/stats/by-summoner/${summoner_id}/ranked`, params);    
  }
  stats_summary(summoner_id, params={}){
    return this.validateAndRespond(
      `${this.base_url}/${this.region}/v1.3/stats/by-summoner/${summoner_id}/summary`, params);    
  }
  static destructureParams(params){
    let {cache, ttl} = params;
    delete params.cache;
    delete params.ttl;
    return {cache: cache, ttl: ttl, params: params};
  }
}

module.exports = Sightstone;
