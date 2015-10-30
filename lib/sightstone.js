'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var req = require('request'),
    Q = require('q'),
    redis = require('redis');

var Sightstone = (function () {
  function Sightstone(api_key, region) {
    var redis_options = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

    _classCallCheck(this, Sightstone);

    if (typeof redis_options === 'object') {
      this.redis = redis.createClient(redis_options);
    }
    this.api_key = api_key;
    this.region = region;
    this.base_params = { api_key: this.api_key };
    this.base_url = "https://na.api.pvp.net/api/lol";
  }

  _createClass(Sightstone, [{
    key: 'cacheResponse',
    value: function cacheResponse(url, response) {
      var ttl = arguments.length <= 2 || arguments[2] === undefined ? 900 : arguments[2];

      this.redis.set(url, response);
      this.redis.expire(url, ttl);
    }
  }, {
    key: 'validateAndRespond',
    value: function validateAndRespond(url, params) {
      var _this = this;

      var defer = Q.defer();
      if (typeof params === "object") {
        _extends(params, this.base_params, params);
      } else {
        defer.reject(new Error("Cannot use non-object params"));
        return defer.promise;
      }

      var _Sightstone$destructureParams = Sightstone.destructureParams(params);

      var cache = _Sightstone$destructureParams.cache;
      var ttl = _Sightstone$destructureParams.ttl;
      var params = _Sightstone$destructureParams.params;

      var redisKey = url + JSON.stringify(params);
      if (cache === false) {
        this.redis.del(redisKey);
      }
      this.redis.get(redisKey, function (err, val) {
        if (val) {
          defer.resolve(val);
          return defer.promise;
        }
      });

      var request = { url: url, qs: params };
      req(request, function (err, resp, body) {
        if (resp.statusCode != 200) {
          defer.reject(new Error(body));
        } else {
          defer.resolve(body);
          if (cache === true) {
            _this.cacheResponse(redisKey, body, ttl);
          }
        }
      });
      return defer.promise;
    }
  }, {
    key: 'champions',
    value: function champions() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v1.2/champion', params);
    }
  }, {
    key: 'recentGames',
    value: function recentGames(summoner_id) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v1.3/game/by-summoner/' + summoner_id + '/recent', params);
    }
  }, {
    key: 'league',
    value: function league(summoner_ids) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof summoner_ids === "object") {
        summoner_ids = summoner_ids.join(",");
      }
      return this.validateAndRespond(this.base_url + '/' + this.region + '/v2.5/league/by-summoner/' + summoner_ids, params);
    }
  }, {
    key: 'matchlist',
    value: function matchlist(summoner_id) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v2.2/matchlist/by-summoner/' + summoner_id, params);
    }
  }, {
    key: 'static_data',
    value: function static_data(type) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/static-data/' + this.region + '/v1.2/' + type, params);
    }
  }, {
    key: 'match',
    value: function match(match_id) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v2.2/match/' + match_id, params);
    }
  }, {
    key: 'summoner',
    value: function summoner(names) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof names === "object") {
        names = names.join(",");
      }
      return this.validateAndRespond(this.base_url + '/' + this.region + '/v1.4/summoner/by-name/' + names, params);
    }
  }, {
    key: 'stats_ranked',
    value: function stats_ranked(summoner_id) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v1.3/stats/by-summoner/' + summoner_id + '/ranked', params);
    }
  }, {
    key: 'stats_summary',
    value: function stats_summary(summoner_id) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.validateAndRespond(this.base_url + '/' + this.region + '/v1.3/stats/by-summoner/' + summoner_id + '/summary', params);
    }
  }], [{
    key: 'destructureParams',
    value: function destructureParams(params) {
      var cache = params.cache;
      var ttl = params.ttl;

      delete params.cache;
      delete params.ttl;
      return { cache: cache, ttl: ttl, params: params };
    }
  }]);

  return Sightstone;
})();

module.exports = Sightstone;