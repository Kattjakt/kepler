var SC = require('soundcloud-nodejs-api-wrapper');
var PM = require('playmusic');
var log = require('log-util');
var spinner = require('cli-spinner').Spinner;
var fs = require('fs');

var Login = require('./login');



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

    Login();
    
    

}

module.exports = Kepler;