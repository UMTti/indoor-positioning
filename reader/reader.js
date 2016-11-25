var stdin = process.openStdin();
const scanner = require('node-wifi-scanner');

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

const MONGO_PASSWORD = process.env['MONGO_PASSWORD'];
var url = `mongodb://gurulansaoyab:${MONGO_PASSWORD}@ds147537.mlab.com:47537/indoor-loc-training-data`;

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
      var i = 0;
      var timeout = setInterval(function(){
        if(i == 10) {
          clearInterval(timeout);
          console.log("ready");
        } else {
          sendData({location: d.toString().split("\n")[0], networks: networks});
          i++;
        }
      }, 5000);
    });
    return;
});
