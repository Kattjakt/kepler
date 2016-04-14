var SC = require('soundcloud-nodejs-api-wrapper');
var PM = require('playmusic');
var log = require('log-util');
var fs = require('fs');

const SETTINGS_FILENAME = 'secrets.json';

var Tokens = function(settings) {
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
            
            resolve(client);
        });
    }));
                               
    logins.push(new Promise(function (resolve, reject) {
        pm.login(settings.credentials.playmusic, (err, data) => {
            if(err) return log.error(err);
            log.verbose('fetched PM login token')
            
            pm.init({
                'androidId': data.androidId, 
                'masterToken': data.masterToken
            }, (err, data) => {
                if(err) console.error(err);
                log.debug('successfully logged into Google Play Music');

                resolve(pm);
            });
        });
    }));
    
    return Promise.all(logins);
}

var Login = function() {
    fs.stat(SETTINGS_FILENAME, (err) => {
        if (err) {
            log.warn('unable to find existing settings file, creating one ...')
            fs.writeFile(SETTINGS_FILENAME, JSON.stringify({
                credentials: {
                    soundcloud: {
                        client_id: "",
                        client_secret: "",
                        username: "",
                        password: "",
                    },
                    playmusic: {
                        email: "",
                        password: "",
                        androidId: ""
                    }
                }
            }, null, 2), (err) => log.error(err));
        }
        
        log.verbose('found existing settings file');
            
        var settings = fs.readFileSync(SETTINGS_FILENAME, 'utf8');
        try {
            settings = JSON.parse(settings);
        } catch (e) {
            log.error('settings file is empty or currupt, aborting ... ', e);
            return false; // reject?
        }
        
        return Tokens(settings);
    });    
}

module.exports = Login;