var express = require('express');
var router = express.Router();
var Uber = require('node-uber');
const openWeather = require("openweathermap-node");


var googleMapsClient = require('@google/maps').createClient({
    key: //ommitted
});
var googleDistanceClient = require('google-distance-matrix');
googleDistanceClient.key(//ommitted);
googleDistanceClient.mode('walking');

var uber = new Uber({
//ommitted

});
const weather = new openWeather(
    {
        APPID: ,
        units: "imperial"
    }
);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('API', { title: 'API Queries' });
});

router.get('/login', function(request, response) {
    var url = uber.getAuthorizeUrl(['places']);
    response.redirect(url);
});

router.get('/callback', function(request, response) {
    uber.authorizationAsync({authorization_code: request.query.code})
        .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
            response.redirect('localhost:4200');
        })
        .error(function(err) {
            console.error(err);
        });
});

var uberInfo;
var walkingTime;

router.get('/query/:address1/:address2', function(req,res){
    if(!req.params.address1 || !req.params.address2){
        res.json({text: 'please input your current location and destination'})
    }
    else {
        uber.estimates.getPriceForRouteByAddressAsync(
            req.params.address1,
            req.params.address2)
            .then(function (result) {
                uberInfo = result['prices'][7];
            })
            .error(function (err) {
                console.log(err);
            });
        googleDistanceClient.matrix([req.params.address1], [req.params.address2], function (err, distances) {
            if (!err) {
                walkingTime = distances.rows[0].elements[0].duration.value;
            }
            else {
                console.log(err)
            }
        });
        let zip = req.params.address1.slice(-10);
        zip = zip.substring(0, 5);

        let temp;
        let cond;
        weather.getCurrentWeatherByZipCode(zip, (err, currentWeather) => {
            if(err){
                console.log(err);
            }
            else{
                temp = (currentWeather.main.temp)-273;
                cond = currentWeather.weather[0]['main'];
            }
        });
        let hourly = 20;
        if((temp > 35 || temp < 0) || (cond == 'rain') || (cond == 'snow') || (cond == 'extreme')){
            hourly = hourly*1.5
        }
        if (!uberInfo.distance) {
            res.json({text:'retry, uber not responding'})
        }
        if (walkingTime < uberInfo.duration) {
            res.json({text:'walking is quicker'})
        }
        else {
            let savedTime = walkingTime - uberInfo.duration;
            console.log(savedTime);
            let potentialMoney = (savedTime / 60 / 60 * hourly);
            console.log(potentialMoney);
            if (potentialMoney > uberInfo.low_estimate) {
                res.json({text:'take an uber'})
            }
            else {
                res.json({text:'walk'})
            }
        }
    }

});

router.get('/formatAddress/:address',function(req, res) {
    googleMapsClient.geocode({
        address: req.params.address
    }, function(err, response) {
        if (!err) {
            res.json(response.json.results[0].formatted_address);
        }
    });
});

router.get('/test',function(req, res) {
    res.json({text:'Hooray!'})
});
module.exports = router;