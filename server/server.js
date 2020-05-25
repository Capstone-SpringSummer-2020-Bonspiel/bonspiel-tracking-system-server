'use strict'

const express = require('express');
const routes = require('../routes/routes');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

process.env.NODE_CONFIG_DIR = './config';
const config = require('config');

const app = express();

app.use('/', routes);

app.all('*', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log("Backend Environment", config.env);
console.log("Backend URl", config.backend.url);
