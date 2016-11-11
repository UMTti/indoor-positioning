var stdin = process.openStdin();
const scanner = require('node-wifi-scanner');

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

var url = 'mongodb://gurulansaoyab:navettamme@ds147537.mlab.com:47537/indoor-loc-training-data';

var list = ["Gurula", "Navetta", "Haxxo"];
console.log("Give place where you are from this list: " + list);

function sendData(data){
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

  // Insert a single document
    db.collection('readings').insertOne(data, function(err, r) {
      console.log("data sent");
      db.close();
    });
  });

}

stdin.addListener("data", function(d) {
    console.log("you entered: [" +
        d.toString().trim() + "]");
    scanner.scan((err, networks) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(networks);
      sendData({location: d.toString().split("\n")[0], networks: networks});
    });

});
