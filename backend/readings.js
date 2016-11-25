var readings;

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

exports.getReadings = function(){
      return new Promise( function(resolve, reject){
        if(readings){
          resolve(readings);
        } else {
          MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);

            db.collection('readings').find().toArray((err, docs) => {
              readings = docs;
              resolve(docs);
              db.close();
            })
          });
        }
      });
}
