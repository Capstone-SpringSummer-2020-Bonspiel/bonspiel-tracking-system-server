'use strict'

const express = require('express');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

process.env.NODE_CONFIG_DIR = './config';
const config = require('config');

const app = express();

/****************************************************************************/

// Setup postgres db connection
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Fetch curling events
app.get('/api/fetch-curling-events', (req, res) => {
  pool.query('SELECT * FROM public.curlingevent ORDER BY id ASC', (err, _res) => {
    console.log(err, _res);
    res.send(_res);
  });
});

// Create a curling event
app.post('/api/create-curling-event', (req, res) => {
  pool.query(`
    INSERT INTO public.curlingevent (
      name,
      event_type,
      info,
      completed,
      begin_date,
      end_date)
    VALUES (
      '${req.body.name}',
      '${req.body.eventType}',
      '${req.body.info}',
      '${req.body.completed}',
      '${req.body.beginDate}',
      '${req.body.endDate}')`, (err, _res) => {
    console.log(err, _res);
    res.send(_res);
  });
});

/****************************************************************************/

app.all('*', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log("Backend Environment", config.env);
console.log("Backend URL", config.backend.url);