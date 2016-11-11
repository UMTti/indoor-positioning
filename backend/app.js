var express = require('express')
var _ = require('lodash')
var app = express()
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
