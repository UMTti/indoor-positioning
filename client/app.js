const electron = require('electron');
var express = require('express');
var app = express();
var scanner = require('node-wifi-scanner');
var _ = require('lodash');
var request = require('request');
const path = require('path')
const url = require('url')

const BrowserWindow = electron.BrowserWindow

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

const eapp = electron.app;

let mainWindow;

function createWindow () {
  console.log('foobar');
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

eapp.on('ready', createWindow)

eapp.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    eapp.quit()
  }
})

eapp.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
