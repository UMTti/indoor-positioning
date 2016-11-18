var express = require('express')
var _ = require('lodash')
var app = express()
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
 var bodyParser = require('body-parser')

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
 var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

 function calculateAverageFromSums(sums, values_hash_map, mac){
   var averages = {};
   for(var key in sums){
     averages[key] = sums[key] / values_hash_map[mac].length;
   }
   return averages;
 }

 function updateSums(mac, sums, signalStrength){
   if(!(mac in sums)){
     sums[mac] = 0;
   }
   sums[mac] += signalStrength;
   return sums;
 }

function updateValuesHashMap(values_hash_map, network){
  var mac = network["mac"];
  if(!(mac in values_hash_map)){
    values_hash_map[mac] = [];
  }
  values_hash_map[mac].push(network["rssi"]);
  return values_hash_map;
}
 function getAverageByLocation(location_data){
   // values_hash_map is hash map of mac-address keys and rrsi values as values related to mac-addresses
   var values_hash_map = {};
   var sums = {};
   for(var i = 0;i<location_data.length;i++){
     var measurement = location_data[i];
     for(var j = 0;j<measurement["networks"].length;j++){
       var network = measurement["networks"][j];
       values_hash_map = updateValuesHashMap(values_hash_map, network);
       sums = updateSums(network["mac"], sums, network["rssi"]);
     }
   }
   return calculateAverageFromSums(sums, values_hash_map, network["mac"]);
 }

 function getAverages(docs){
   let locations = _.groupBy(docs, "location");
   var averages = {};
   for(var key in locations){
     averages[key] = getAverageByLocation(locations[key]);
   }
   return averages;
 }

app.get('/readings', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('readings').find().toArray((err, docs) => {
      res.json(getAverages(docs));
      db.close();
    })
  });

})

function fillMissingValues(readings){
  let aps = _.uniq(_.flatten(readings.map((r) => {
    return r.networks.map(n => n.mac)
  })));
  readings.forEach((r) => {
    let nAps = r.networks.map(n => n.mac)
    let notFound = aps.filter(ap => nAps.indexOf(ap) === -1)
    notFound.forEach((nF) => {
      r.networks.push({"mac": nF, "rssi": -100})
    })
  })
  return readings;
}

function calcEuclideanDistance(reading, userReadings){
  var distance = 0;
  userReadings.networks.forEach((uR) => {
    let pair = reading.networks.find((n) => uR.mac === n.mac)
    if(pair !== undefined) {
      distance += Math.pow(uR.rssi - pair.rssi, 2)
    }
  })
  reading.distance = Math.sqrt(distance);
}

function findNearestNeighbors(k, readings, userReadings){
  readings.forEach((r) => {
    calcEuclideanDistance(r, userReadings);
  })
  let sorted = _.sortBy(readings, [function(r) { return r.distance; }]);
  return sorted.slice(0, k);
}

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
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('readings').find().toArray((err, readings) => {
      fillMissingValues(readings);
      let userReadings = req.body;
      console.log(req.body);
      let nearest = findNearestNeighbors(5, readings, userReadings);
      res.json(mostCommonLocation(nearest));
      //res.json(findNearestNeighbors(5, readings, userReadings));
      db.close();
    })
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
