var express = require('express')
var _ = require('lodash')
var app = express()
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

 const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
 var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

 function doSomething(docs){
   let locations = _.groupBy(docs, "location");
   locations.forEach((n) => {
     console.log(n);
   });
 }

app.get('/readings', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");


    db.collection('readings').find().toArray((err, docs) => {
      res.json(doSomething(docs));
      db.close();
    })
  });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
