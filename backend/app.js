var express = require('express')
var _ = require('lodash')
var app = express()
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');
 var bodyParser = require('body-parser')

var averages = require('./averages.js')
var knearest = require('./knearestneighbors.js')

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

 const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
 var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

app.get('/readings', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('readings').find().toArray((err, docs) => {
      res.json(averages.getAverages(docs));
      db.close();
    })
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
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('readings').find().toArray((err, readings) => {
      knearest.fillMissingValues(readings);
      let userReadings = req.body;
      console.log(req.body);
      let nearest = knearest.findNearestNeighbors(5, readings, userReadings);
      res.json(mostCommonLocation(nearest));
      //res.json(findNearestNeighbors(5, readings, userReadings));
      db.close();
    })
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
