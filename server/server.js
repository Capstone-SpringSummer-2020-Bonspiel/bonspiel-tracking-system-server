'use strict'

const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const routes = require('../routes/routes').router;
const adminRoutes = require('../routes/adminRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

process.env.NODE_CONFIG_DIR = './config';
const config = require('config');

const app = express();
app.use(cors({
  origin: ["http://localhost", "https://bonspiel-tracking-system-devl.herokuapp.com"],
  credentials: true
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cookieParser())

let swaggerConfig = loadSwaggerConfig();

swaggerConfig.servers[0].url = config.backend.url + "api/v1";
swaggerConfig.servers[1].url = config.backend.url + "api/v1/admin";
fs.writeFileSync('./config/swagger.yaml', YAML.safeDump(swaggerConfig), 'utf8');

swaggerConfig = loadSwaggerConfig(); //reload for updated swagger
function loadSwaggerConfig() {
  try {
    return YAML.safeLoad(fs.readFileSync('./config/swagger.yaml', 'utf-8'));
  } catch (e) {
    console.error(e);
  }
}

console.debug("baseUrl", swaggerConfig.host);

app.use('/api/v1/', routes);
app.use('/api/v1/admin', adminRoutes);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerConfig));

app.listen(PORT, HOST);
console.debug(`Running on http://${HOST}:${PORT}`);
console.debug("Backend Environment", config.env);
console.debug("Backend URL", config.backend.url);
