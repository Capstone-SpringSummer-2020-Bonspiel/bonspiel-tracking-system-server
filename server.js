'use strict'

const express = require('express');
const compression = require('compression');

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0';
const APP_FOLDER = 'dist/app'

const app = express();
app.use(compression());

app.all('*', (req, res) => {
        res.send('Hello World!');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
