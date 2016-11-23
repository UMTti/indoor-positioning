var express = require('express');
var app = express();
var scanner = require('node-wifi-scanner');
var _ = require('lodash');
var request = require('request');

app.use(express.static('public'));

app.get('/location', (req, res) => {

  scanner.scan((err, networks) => {
    const opts = {
      url: "http://52.211.244.135:3000/location",
      method: "POST",
      json: {networks: networks}
    };

    request(opts, (err, resp, body) => {
      res.json({location: body});
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
