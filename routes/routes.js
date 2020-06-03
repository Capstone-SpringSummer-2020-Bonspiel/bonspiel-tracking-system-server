const express = require('express');
const router = express.Router();
const CurlingEventService = require('../services/CurlingEventService');

router.get('/curlingEvent/', (req, res) => {
  let gameService = new CurlingEventService();

  let events = CurlingEventService.getAllEvents();
  if (events == undefined || events == null) {
    res.sendStatus(404);
  }
  res.status(200).send(events);
});

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

// TEMP Fetch curling events
router.get('/fetch-curling-events', (req, res) => {
  pool.query('SELECT * FROM public.curlingevent ORDER BY id ASC', (err, _res) => {
    console.log(err, _res);
    res.send(_res);
  });
});

router.post('/getTable/', (req, res) => {
  const tableName = req.body.tableName
  pool.query(`SELECT * from public.${tableName}`, (err, data) => {
    console.log(err, data);
    res.send(data);
  });
});

router.post('/DANGEROUSADHOC', (req, res) => {
  const sql = req.body.sql;
  if (sql.includes("DROP") || sql.includes("drop")) {
    res.sendStatus(500);
  }
  pool.query(sql);
})

// TEMP Create a curling event
router.post('/create-curling-event', (req, res) => {
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



module.exports = router;