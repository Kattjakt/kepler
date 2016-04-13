var SC = require('soundcloud-nodejs-api-wrapper');
var log = require('log-util');
var spinner = require('cli-spinner').Spinner;

var client = {};

var data = [];

var fetch = function () {
    new Promise((resolve, reject) => {
        client.get('/me/favorites', {limit : 5}, (err, results) => {
            if (err) reject(err);

            if (data == result) return

            results.map(song => {
                if (data.indexOf(song) > -1) {

                }
            });

            console.log(result[0].title);
            resolve(result);
        });

    }).then(setTimeout(() => fetch(), 3000));
}

var Kepler = function (settings) {

    var sc = new SC(settings.credentials.soundcloud);
    client = sc.client();


    client.exchange_token((err, result) => {
        if (err) {
            return log.error('invalid credentials');
        }

        var data = arguments[3];

        log.debug('Successfully signed in to Soundcloud');
        log.verbose('access token: ' + data.access_token);
        log.verbose('expires_in: ' + data.expires_in);

        var access_token = data.access_token;
        client = sc.client({
            access_token : access_token
        });

        fetch().then((data) => {
            console.log('shit', data);

        });
    });
}

module.exports = Kepler;