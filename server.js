'use strict'

const express = require('express');

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0';
const APP_FOLDER = 'dist/app'
const config = require('config');
process.env.NODE_CONFIG_DIR = './config'

const app = express();

app.all('*', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log("Backend Environment", config.env);
console.log("Backend URl", config.backend.url);
