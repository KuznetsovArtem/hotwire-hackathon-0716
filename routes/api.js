/**
 * Created by v-akuznetsov on 7/22/16.
 */


var express = require('express');
var router = express.Router();
var api = require('../modules/api');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('api endpoint');
});

router.post('/places/nearby', api.getPlacesNearHotel);
router.post('/places/test', api.getTestData);
router.post('/places/:destination', api.getPlaces);
router.post('/places', api.getPlaces);
router.get('/places', api.getPlaces);

module.exports = router;
