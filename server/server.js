'use strict'

const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const routes = require('../routes/routes');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

process.env.NODE_CONFIG_DIR = './config';
const config = require('config');

const app = express();
app.use(cors());

let swaggerConfig = loadSwaggerConfig();

swaggerConfig.host = servers.url;
fs.writeFileSync('./config/swagger.yaml', YAML.safeDump(swaggerConfig), 'utf8');

swaggerConfig = loadSwaggerConfig(); //reload for updated swagger

console.debug("baseUrl", swaggerConfig.host);

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerConfig));

function loadSwaggerConfig() {
  try {
    return YAML.safeLoad(fs.readFileSync('./config/swagger.yaml', 'utf-8'));
  } catch (e) {
    console.error(e);
  }
}


app.use('/api/v1', routes);

app.listen(PORT, HOST);
console.debug(`Running on http://${HOST}:${PORT}`);
console.debug("Backend Environment", config.env);
console.debug("Backend URL", config.backend.url);