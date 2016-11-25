var _ = require('lodash')

exports.calculateAverageFromSums = function(sums, values_hash_map, mac){
  var averages = {};
  for(var key in sums){
    averages[key] = sums[key] / values_hash_map[mac].length;
  }
  return averages;
}

exports.updateSums = function(mac, sums, signalStrength){
  if(!(mac in sums)){
    sums[mac] = 0;
  }
  sums[mac] += signalStrength;
  return sums;
}

exports.updateValuesHashMap = function(values_hash_map, network){
 var mac = network["mac"];
 if(!(mac in values_hash_map)){
   values_hash_map[mac] = [];
 }
 values_hash_map[mac].push(network["rssi"]);
 return values_hash_map;
}

exports.getAverageByLocation = function(location_data){
  // values_hash_map is hash map of mac-address keys and rrsi values as values related to mac-addresses
  var values_hash_map = {};
  var sums = {};
  for(var i = 0;i<location_data.length;i++){
    var measurement = location_data[i];
    for(var j = 0;j<measurement["networks"].length;j++){
      var network = measurement["networks"][j];
      values_hash_map = exports.updateValuesHashMap(values_hash_map, network);
      sums = exports.updateSums(network["mac"], sums, network["rssi"]);
    }
  }
  return exports.calculateAverageFromSums(sums, values_hash_map, network["mac"]);
}

exports.getAverages = function(docs){
  let locations = _.groupBy(docs, "location");
  var averages = {};
  for(var key in locations){
    averages[key] = exports.getAverageByLocation(locations[key]);
  }
  return averages;
}
