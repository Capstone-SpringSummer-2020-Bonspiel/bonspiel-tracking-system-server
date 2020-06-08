const express = require('express');
const router = express.Router();
const CurlingEventService = require('../services/CurlingEventService');

router.get('/curlingEvent/:curlingEventId/teams/:teamId/games', async (req, res) => {
  const curlingEventService = new CurlingEventService();
  const curlingEventId = req.params.curlingEventId;
  const teamId = req.params.teamId;

  try {
    let gamesByTeam = await curlingEventService.getAllGamesByTeam(curlingEventId, teamId);
    res.status(200).send(gamesByTeam);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/curlingEvent/:curlingEventId/teams', async (req, res) => {
  const curlingEventService = new CurlingEventService();
  try {
    let events = await curlingEventService.getAllTeamsByCurlingEvent(req.params.curlingEventId);
    res.status(200).send(events);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/curlingEvent/', async (req, res) => {
  const curlingEventService = new CurlingEventService();

  try {
    let events = await curlingEventService.getAllEvents();
    res.status(200).send(events);
  }
  catch (error) {
    res.status(404).send(error);
  }
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
  const tableName = [req.body.tableName];
  pool.query(`SELECT * from public.$1`, tableName, (err, data) => {
    if (err !== null || err !== undefined) {
      console.log(err, data);
      res.send(err.message);
    }
    else {
      res.send(data);
    }
  });
});

router.post('/DANGEROUSADHOC', (req, res) => {
  const sql = [req.body.sql];
  pool.query('$1', sql, (err, data) => {
    if (err !== null || err !== undefined) {
      console.log(err, data);
      res.send(err.message);
    }
    else {
      res.send(data);
    }
  });
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