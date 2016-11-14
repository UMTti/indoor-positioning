var express = require('express');
var app = express();
var scanner = require('node-wifi-scanner');
var _ = require('lodash');

// Get these from the server in the future
const readings = {"Navetta":{"58:ac:78:44:a7:9f":-87.63636363636364,"d8:b1:90:3c:83:4c":-89.63636363636364,"d8:b1:90:3c:83:4e":-87.72727272727273,"d8:b1:90:3c:83:4f":-88.72727272727273,"d8:b1:90:3c:83:4d":-87.72727272727273,"b0:aa:77:9f:12:ce":-85.81818181818181,"b0:aa:77:9f:11:2c":-73.36363636363636,"b0:aa:77:9f:11:2d":-74.27272727272727,"b0:aa:77:9f:11:2f":-74.27272727272727,"b0:aa:77:9f:11:2e":-73.36363636363636,"f4:4e:05:ad:65:81":-7.363636363636363,"b0:aa:77:9f:11:23":-72.72727272727273,"b0:aa:77:9f:11:21":-71.9090909090909,"b0:aa:77:9f:11:22":-72.81818181818181,"b0:aa:77:9f:11:20":-71.9090909090909,"e4:8d:8c:c9:6f:32":-44.90909090909091,"b0:aa:77:cc:ce:c0":-3.8181818181818183,"ec:8e:b5:1d:c6:d7":-85,"c0:ee:fb:d0:8a:f3":-49.18181818181818,"b0:aa:77:cc:ce:cc":-53,"b0:aa:77:cc:ce:ce":-52.09090909090909,"b0:aa:77:cc:ce:cd":-52,"b0:aa:77:cc:ce:cf":-52.09090909090909,"58:97:bd:62:03:90":-77.27272727272727,"58:97:bd:62:03:93":-77.27272727272727,"58:97:bd:62:03:91":-77.27272727272727,"58:97:bd:62:03:92":-76.36363636363636,"b0:aa:77:cc:ce:c2":-44.54545454545455,"40:b8:37:d6:6c:a4":-81.81818181818181},"Gurula":{"58:ac:78:44:a7:9d":-73,"d8:b1:90:3c:83:4e":-76.70588235294117,"b0:aa:77:9f:12:ce":-79.6470588235294,"b0:aa:77:9f:12:cd":-79.05882352941177,"b0:aa:77:9f:12:cf":-79.76470588235294,"b0:aa:77:9f:12:cc":-79.52941176470588,"58:97:bd:62:03:9c":-85.70588235294117,"58:97:bd:62:03:9d":-85.05882352941177,"58:97:bd:62:03:9f":-84.41176470588235,"58:97:bd:62:03:9e":-85.05882352941177,"b0:aa:77:9f:11:2c":-57.64705882352941,"b0:aa:77:9f:11:2d":-57.705882352941174,"b0:aa:77:9f:11:2f":-65.41176470588235,"b0:aa:77:9f:11:2e":-64.94117647058823,"b0:aa:77:9f:11:23":-51.1764705882353,"b0:aa:77:9f:11:21":-50.588235294117645,"58:97:bd:62:03:93":-64.58823529411765,"58:97:bd:62:03:91":-73.6470588235294,"58:97:bd:62:03:92":-69.6470588235294,"58:97:bd:62:03:90":-68.52941176470588,"b0:aa:77:9f:11:20":-61.705882352941174,"b0:aa:77:9f:11:22":-54.35294117647059,"e4:8d:8c:c9:6f:32":-51.1764705882353,"ec:8e:b5:1d:c6:d7":-75.88235294117646,"b0:aa:77:cc:ce:c2":-50.11764705882353,"b0:aa:77:cc:ce:c3":-44,"c0:ee:fb:d0:8a:f3":-61.294117647058826,"b0:aa:77:cc:ce:cc":-53.23529411764706,"b0:aa:77:cc:ce:ce":-53.35294117647059,"b0:aa:77:cc:ce:cd":-53.23529411764706,"b0:aa:77:cc:ce:cf":-53,"04:62:73:86:87:e0":-5.0588235294117645,"04:62:73:86:87:e3":-5,"d8:b1:90:3c:7e:8f":-15.529411764705882,"d8:b1:90:3c:7e:8e":-25.41176470588235,"00:f6:63:2c:1c:bc":-5.117647058823529,"58:ac:78:44:a7:9c":-22.41176470588235,"58:ac:78:44:a7:9e":-31.352941176470587,"58:ac:78:44:a7:9f":-22.529411764705884,"d8:b1:90:3c:83:4c":-33.411764705882355,"d8:b1:90:3c:83:4f":-23.58823529411765,"d8:b1:90:3c:83:4d":-23.529411764705884,"00:f6:63:2c:1c:bf":-15.411764705882353,"04:62:73:86:87:ec":-35.529411764705884,"04:62:73:86:87:ee":-35.411764705882355,"04:62:73:86:87:ed":-35.294117647058826,"04:62:73:86:87:ef":-35.529411764705884,"ec:bd:1d:61:11:1e":-36.23529411764706,"ec:bd:1d:61:11:1d":-36.35294117647059,"ec:bd:1d:61:11:1f":-36.294117647058826,"ec:bd:1d:61:11:1c":-36.1764705882353,"d8:b1:90:3c:7e:8d":-5.235294117647059,"d8:b1:90:3c:7e:8c":-35.05882352941177,"4e:66:41:6e:c4:b5":-14.176470588235293,"d8:b1:90:3c:7e:81":-14.058823529411764,"b0:aa:77:cc:ce:c1":-14.705882352941176,"b0:aa:77:cc:ce:c0":-20.705882352941178,"5c:f8:a1:e8:a7:be":-14.529411764705882,"1c:74:0d:36:a3:e3":-31.176470588235293,"52:74:0d:36:a3:e0":-31.352941176470587,"04:62:73:86:87:e1":-5.0588235294117645,"04:62:73:86:87:e2":-5,"40:b8:37:d6:6c:a4":-4.823529411764706,"84:b8:02:e2:a5:9c":-36,"84:b8:02:e2:a5:9e":-36,"84:b8:02:e2:a5:9d":-35.705882352941174,"84:b8:02:e2:a5:9f":-35.76470588235294,"fa:fd:9f:df:fd:f3":-24.058823529411764,"f4:4e:05:ad:65:80":-10.117647058823529,"d8:b1:90:41:8a:3e":-10.588235294117647,"00:f6:63:2c:1c:bd":-20.705882352941178,"b0:aa:77:9f:12:c1":-8.588235294117647,"b0:aa:77:9f:12:c2":-8.705882352941176,"d8:b1:90:3c:7e:83":-9.411764705882353,"34:21:09:14:de:60":-8.941176470588236,"d8:b1:90:41:8a:3c":-10.588235294117647},"Haxxo":{"b0:aa:77:9f:11:2d":-90,"d8:b1:90:23:15:43":-78,"d8:b1:90:23:15:41":-78,"d8:b1:90:23:15:42":-78,"d8:b1:90:23:15:40":-78,"b0:aa:77:9f:11:23":-84,"b0:aa:77:9f:11:21":-85,"b0:aa:77:9f:11:22":-84,"28:37:37:13:b3:7b":-78,"e4:8d:8c:c9:6f:32":-57,"b0:aa:77:cc:ce:c3":-60,"b0:aa:77:cc:ce:c1":-60,"b0:aa:77:cc:ce:c2":-60,"b0:aa:77:cc:ce:c0":-60,"c0:ee:fb:d0:8a:f3":-53,"b0:aa:77:cc:ce:cc":-65,"b0:aa:77:cc:ce:ce":-66,"b0:aa:77:cc:ce:cd":-65,"b0:aa:77:cc:ce:cf":-66}};

const accessPoints = [
        {
            "ssid": "CSGuestNet_optout",
            "mac": "58:ac:78:44:a7:9d",
            "channel": 140,
            "rssi": -86
        },
        {
            "ssid": "eduroam",
            "mac": "d8:b1:90:3c:83:4e",
            "channel": 132,
            "rssi": -90
        },
        {
            "ssid": "eduroam",
            "mac": "b0:aa:77:9f:12:ce",
            "channel": 112,
            "rssi": -85
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "b0:aa:77:9f:12:cd",
            "channel": 112,
            "rssi": -84
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "b0:aa:77:9f:12:cf",
            "channel": 112,
            "rssi": -85
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "b0:aa:77:9f:12:cc",
            "channel": 112,
            "rssi": -85
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "58:97:bd:62:03:9c",
            "channel": 60,
            "rssi": -89
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "58:97:bd:62:03:9d",
            "channel": 60,
            "rssi": -88
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "58:97:bd:62:03:9f",
            "channel": 60,
            "rssi": -87
        },
        {
            "ssid": "eduroam",
            "mac": "58:97:bd:62:03:9e",
            "channel": 60,
            "rssi": -88
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "b0:aa:77:9f:11:2c",
            "channel": 52,
            "rssi": -68
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "b0:aa:77:9f:11:2d",
            "channel": 52,
            "rssi": -68
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "b0:aa:77:9f:11:2f",
            "channel": 52,
            "rssi": -69
        },
        {
            "ssid": "eduroam",
            "mac": "b0:aa:77:9f:11:2e",
            "channel": 52,
            "rssi": -68
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "b0:aa:77:9f:11:23",
            "channel": 11,
            "rssi": -63
        },
        {
            "ssid": "eduroam",
            "mac": "b0:aa:77:9f:11:21",
            "channel": 11,
            "rssi": -62
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "58:97:bd:62:03:93",
            "channel": 11,
            "rssi": -80
        },
        {
            "ssid": "eduroam",
            "mac": "58:97:bd:62:03:91",
            "channel": 11,
            "rssi": -80
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "58:97:bd:62:03:92",
            "channel": 11,
            "rssi": -81
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "58:97:bd:62:03:90",
            "channel": 11,
            "rssi": -80
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "b0:aa:77:9f:11:20",
            "channel": 11,
            "rssi": -62
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "b0:aa:77:9f:11:22",
            "channel": 11,
            "rssi": -62
        },
        {
            "ssid": "NT-kerho",
            "mac": "e4:8d:8c:c9:6f:32",
            "channel": 8,
            "rssi": -51
        },
        {
            "ssid": "DIRECT-D6-HP Officejet 5740",
            "mac": "ec:8e:b5:1d:c6:d7",
            "channel": 6,
            "rssi": -76
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "b0:aa:77:cc:ce:c2",
            "channel": 6,
            "rssi": -50
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "b0:aa:77:cc:ce:c3",
            "channel": 6,
            "rssi": -50
        },
        {
            "ssid": "OnePlus3",
            "mac": "c0:ee:fb:d0:8a:f3",
            "channel": 6,
            "rssi": -57
        },
        {
            "ssid": "Univ Helsinki CS",
            "mac": "b0:aa:77:cc:ce:cc",
            "channel": 36,
            "rssi": -55
        },
        {
            "ssid": "eduroam",
            "mac": "b0:aa:77:cc:ce:ce",
            "channel": 36,
            "rssi": -55
        },
        {
            "ssid": "CSGuestNet_optout",
            "mac": "b0:aa:77:cc:ce:cd",
            "channel": 36,
            "rssi": -55
        },
        {
            "ssid": "Univ Helsinki HUPnet",
            "mac": "b0:aa:77:cc:ce:cf",
            "channel": 36,
            "rssi": -55
        }
    ];

// Ask the app to check our current location
// Networks is a list of
//{ ssid: 'ZyXEL7C81CD',
//    mac: '90:ef:68:7c:81:cd',
//    channel: 100,
//    rssi: -87 }
app.get('/location', (req, res) => {
  scanner.scan((err, accessPoints2) => {

    Object.keys(readings).forEach((loc) => {
      readings[loc].matchingAPs = accessPoints.filter((ap) => {
        return readings[loc][ap.mac] !== undefined;
      }).map((apr) => {
        return {mac: apr.mac, rssi: readings[loc][apr.mac]};
      });
      console.log(`Found ${Object.keys(readings[loc].matchingAPs).length} APs for ${loc}`);
    });

    let most = Object.keys(readings).reduce((largest, loc) => {
      let current = readings[loc];
      return largest > current.matchingAPs.length ? largest : current.matchingAPs.length;
    }, 0);

    const dropBelow = most / 2;

    // At least half as many common APs with current reading as the best possible location
    let possibleLocations = Object.keys(readings).map((loc) => {
      if (readings[loc].matchingAPs.length > (dropBelow)) return {location: loc, readings: readings[loc].matchingAPs};
    });

    possibleLocations = possibleLocations.filter((pl) => { return !!pl });

    // list of AP MACs [mac1, mac2, mac3...] that are found from all the possible locations
    //let matchThese = _.intersection((
    let macs = possibleLocations.map((pl) => {
      return pl.readings.map(r => r.mac);
    });
    let matchThese = _.intersection.apply(_, macs);

    possibleLocations.forEach((pl) => {
      pl.dist = 0;
      matchThese.forEach((m) => {
        let readingAtLocation = -1 * pl.readings.find((r) => { return r.mac === m}).rssi;
        let readingAtCurrent = -1 * accessPoints.find((ap) => { return ap.mac === m}).rssi;
        let dist = Math.abs(readingAtLocation - readingAtCurrent);
        pl.dist += dist;
      });
    });

    //console.log(matchThese.length)
    res.json(possibleLocations);
    // res.json({'Location': location});
  });
});

// Probably turn this into a socket over to the server
// Monitors the users of the app in real time and sends the
// locations to the front-end.
app.get('/people', (req, res) => {

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
