let express = require('express');
let proxy = require('http-proxy-middleware');
let app = express();
let repng = require('repng')
var fs = require('fs');

let React = require('react');

var puppeteer = require('puppeteer');

let componentImage = require('component-image')

const server  = require('react-dom/server');

const Component = require('./Component');

// app.use('/api', proxy({target: 'http://0.0.0.0:5001', changeOrigin: true}));
// app.use('/', proxy({target: 'http://0.0.0.0:8000', changeOrigin: true}));


app.get('/search', function (req, res) {

  const body = server.renderToString(Component.default);

  console.log(body);

  componentImage.generateImage(body, {
    puppeteerOptions : {executablePath: '/usr/bin/chromium-browser'},
    viewport: {
      width: 1300,
      height: 1860
    }
  }).then(x=> {
    res.end(x, 'binary');
  })

});

app.listen(3000);
