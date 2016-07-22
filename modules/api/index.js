/**
 * Created by v-akuznetsov on 7/22/16.
 */


var ApiConnector = require('./connector');
var Promise = require("promise");

// Connectors // TODO: move urls, keys to config;
var yelp = new ApiConnector('https://api.yelp.com/v3/businesses/search', {
    auth : {
        url: 'https://api.yelp.com/oauth2/token',
        client_id: 'Fo8AtdjqDmVR73eVOWqfSQ',
        client_secret: 'K2dWetyk7Cq6bQNRh7y9UJx7kO0xCBunpz6ic5ElPAOuIHPh16UwDNxNpGb9Avck'
    }
});

var foursquare = new ApiConnector('https://api.foursquare.com/v2/venues/search?oauth_token=E0SLFSAXYTJUX0DT3JEAVBNXNKXOHFFPYXE3IWVILFTQQ11Q&v=20160722');

var googlePlaces = new ApiConnector('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCdKZDliUILTCjm8-dEe6Xd2sknYSmItOU&');

// Endpoint for content info; for demo; TODO: move to own module;
function getHwInfo (location) {
    return new Promise(function (resolve) {
        resolve({
            city: 'San Francisco',
            description: 'Good place to visit',
            wiki: 'San Francisco, officially the City and County of San Francisco, is the cultural, commercial, and financial center of Northern California and the only consolidated city-county in California.[24] San Francisco encompasses a land area of about 46.9 square miles (121 km2)[25] on the northern end of the San Francisco Peninsula, which makes it the smallest county in the state. It has a density of about 18,451 people per square mile (7,124 people per km2), making it the most densely settled large city (population greater than 200,000) in the state of California and the second-most densely populated major city in the United States after New York City.[26] San Francisco is the fourth-most populous city in California, after Los Angeles, San Diego, and San Jose, and the 13th-most populous city in the United States—with a Census-estimated 2015 population of 864,816.[21] The city and its surrounding areas are known as the San Francisco Bay Area, and are a part of the larger OMB-designated San Jose-San Francisco-Oakland combined statistical area, the fifth most populous in the nation with an estimated population of 8.7 million.'
        });
    })
}

function agregator(promisesArray) {
    Promise.all(promisesArray).then(function(allData) {
        // FIXME: Artem P: make some BE data aggregations;
    })
}

// API Endpoints controller
module.exports = {

    getPlacesNearHotel: function(req, res, next) {

        // For easy testing in REST client;
        req.body.lat = req.body.lat|| 37.805488;
        req.body.long = req.body.long|| -122.42048;

        return Promise.all([
            yelp.getData({
                q: [
                    'term=delis',
                    'latitude=' + req.body.lat,
                    'longitude=' + req.body.long
                ].join('&')
            }),
            foursquare.getData({
                q: '&ll=' + [req.body.lat, req.body.long].join(',')
            }),
            googlePlaces.getData({
                q: ['location=' + [req.body.lat, req.body.long].join(','),
                    'radius=500',
                    'types=food',
                    'name=cruise'].join('&')
            }),
            // Just for demo
            getHwInfo({
                city: 'San Francisco'
            })
            // TODO: Google, FB, flickr, insta, ???
        ]).then(function(allData) {
            console.log(allData);
            res.json({
                error: false,
                yelp: JSON.parse(allData[0]),
                foursquare: JSON.parse(allData[1]),
                googlePlaces: JSON.parse(allData[2]),
                hw: allData[3]
            })
        });

    },

    getPlaces: function (req, res) {
        return Promise.all(getHwInfo()).then(function (data) {
            res.json(data);
        })
    },

    getTestData: function () {
        // Test data;
        yelp.getData({}).then(function(){
            // return res.send(data);

            res.json({
                "total": 8228,
                "businesses": [
                    {
                        "rating": 4,
                        "price": "$",
                        "phone": "+14152520800",
                        "id": "four-barrel-coffee-san-francisco",
                        "categories": [
                            {
                                "alias": "coffee",
                                "title": "Coffee & Tea"
                            }
                        ],
                        "review_count": 1738,
                        "name": "Four Barrel Coffee",
                        "url": "https://www.yelp.com/biz/four-barrel-coffee-san-francisco",
                        "coordinates": {
                            "latitude": 37.7670169511878,
                            "longitude": -122.42184275
                        },
                        "image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/MmgtASP3l_t4tPCL1iAsCg/o.jpg",
                        "location": {
                            "city": "San Francisco",
                            "country": "US",
                            "address2": "",
                            "address3": "",
                            "state": "CA",
                            "address1": "375 Valencia St",
                            "zip_code": "94103"
                        }
                    }
                    // ...
                ]
            })
            // next();
        });
    },

    getYelp: function() {
        return yelp.getData({
            latitude: req.body.lat,
            longitude: req.body.long
        }).then(function(data) {
            res.json({
                error: false,
                yelp: JSON.parse(data)
            })
        }).catch(function(rejection) {
            res.json({
                error: true,
                data: rejection
            })
        });
    }
};