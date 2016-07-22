/**
 * Created by v-akuznetsov on 7/22/16.
 */

var request = require('request');
var Promise = require("promise");

module.exports = function(url, options) {

    this.url = url;
    this.options = options || {};

    this.auth = function (options) {
        return new Promise(function(resolve, reject) {

            request.post({
                    url: options.url,
                    method: "POST",
                    json: true,
                    form: options
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        console.log('error', error);
                        reject(error);
                    }
                }
            );

        });
    };

    this.getData = function(options) {
        var self = this;
        return new Promise(function (resolve, reject) {

            if(self.options.auth) {
                console.log('need to auth');
                return self.auth(self.options.auth).then(function(authData) {
                    request(self.url + '?' + options.q, {
                            headers: {
                                'Authorization': 'Bearer ' + authData.access_token
                            }
                        }, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            resolve(body);
                        } else {
                            reject(error);
                        }
                    });

                });
            } else {
                request(self.url + options.q, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(body);
                    } else {
                        reject(error);
                    }
                });
            }

        });
    }
};