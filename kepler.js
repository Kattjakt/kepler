var SC = require('soundcloud-nodejs-api-wrapper');
var PM = require('playmusic');
var log = require('log-util');
var spinner = require('cli-spinner').Spinner;
var fs = require('fs');

var client = {};

var data = [];

var fetch = function () {
    return new Promise((resolve, reject) => {
        client.get('/me/favorites', {limit : 5}, (err, results) => {
            if (err) reject(err);
            
            results.map(song => {
                var ids = data.map(s => s.id);
                if (ids.indexOf(song.id) < 0) {
                    console.log('new', song.title);
                    
                    fs.writeFile('out/' + song.title, (err) => {
                        if (err) log.error('failed to write file');
                    });
                }
            });
            
            data = results;
            resolve(results);
        });

    }).then(setTimeout(() => fetch(), 5000));
}

var Kepler = function (settings) {
    var sc = new SC(settings.credentials.soundcloud);
    var pm = new PM();
    
    client = sc.client();

    var logins = [];
    
    logins.push(new Promise(function (resolve, reject) {
        client.exchange_token((err, result) => {
            if (err) return log.error(err);

            var data = arguments[3];
            
            log.verbose('fetched SC login token');
            log.debug('successfully signed in to Soundcloud');

            client = sc.client({
                access_token : data.access_token
            });
            
            resolve();
        });
    }));
                               
    logins.push(new Promise(function (resolve, reject) {
        pm.login(settings.credentials.playmusic, function(err, data) {
            if(err) return log.error(err);
            log.verbose('fetched PM login token')
            
            pm.init({
                'androidId': data.androidId, 
                'masterToken': data.masterToken
            }, function(err, data) {
                if(err) console.error(err);
                log.debug('successfully logged into Google Play Music');

                resolve();
            });
        });
    }));
    
    Promise.all(logins).then(function (data) {
        console.log('wohi');
        
        //fetch().then((data) => {
        //    console.log('update');
        //});

    });
}

module.exports = Kepler;