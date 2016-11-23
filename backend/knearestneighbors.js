var _ = require('lodash')

exports.fillMissingValues = function(readings){
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

exports.calcEuclideanDistance = function(reading, userReadings){
  var distance = 0;
  userReadings.networks.forEach((uR) => {
    let pair = reading.networks.find((n) => uR.mac === n.mac)
    if(pair !== undefined) {
      distance += Math.pow(uR.rssi - pair.rssi, 2)
    }
  })
  reading.distance = Math.sqrt(distance);
}

exports.findNearestNeighbors = function(k, readings, userReadings){
  readings.forEach((r) => {
    exports.calcEuclideanDistance(r, userReadings);
  })
  let sorted = _.sortBy(readings, [function(r) { return r.distance; }]);
  return sorted.slice(0, k);
}
