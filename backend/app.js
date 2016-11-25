var express = require('express')
var _ = require('lodash')
var app = express()
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
 var bodyParser = require('body-parser')

var http = require('http').Server(app);
//var io = require('socket.io')(http);

// io.set('origins', 'http://localhost:3000');

var averages = require('./averages.js')
var knearest = require('./knearestneighbors.js')
var readings = require('./readings.js')

var locations = {};

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

 const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
 var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

app.get('/readings', function (req, res) {
  readings.getReadings().then( function(readings){
    res.json(averages.getAverages(readings));
  });
})

function mostCommonLocation(nearest){
  let freqs = nearest.reduce((memo, current) => {
    if(memo.has(current.location)){
      memo.set(current.location, memo.get(current.location) + 1);
    } else {
      memo.set(current.location, 1)
    }
    return memo
  }, new Map());
  console.log(freqs);
  var biggest = -1;
  var location = "";
  for(var key of freqs.keys()){
    if(freqs.get(key) > biggest){
      biggest = freqs.get(key);
      location = key;
    }
  }
  return location;
}

app.post('/location', function (req, res) {
  readings.getReadings().then( function(readings){
    knearest.fillMissingValues(readings);
    let userReadings = req.body;
    //console.log(req.body);
    let nearest = knearest.findNearestNeighbors(5, readings, userReadings);
    res.json(mostCommonLocation(nearest));
  });
})

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

var io = require('socket.io').listen(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('locationUpdate', function (msg) {
    console.log(msg);
  });
  socket.emit('users', locations);
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
