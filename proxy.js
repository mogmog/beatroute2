let express = require('express');
let proxy = require('http-proxy-middleware');
let app = express();
let repng = require('repng')
var fs = require('fs');

let React = require('react');

var puppeteer = require('puppeteer');

const server  = require('react-dom/server');

app.use((req, res, next) => {
  res.append('X-Frame-Options', ['ALLOW-FROM https://jsfiddle.net/29jhy681/']);
  next();
});

app.use('/api', proxy({target: 'http://0.0.0.0:5001', changeOrigin: true}));
app.use('/', proxy({target: 'http://0.0.0.0:8000', changeOrigin: true}));


app.listen(3000);
