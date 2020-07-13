const express = require('express');
const router = express.Router();
const CurlingEventService = require('../services/CurlingEventService');
const Exceptions = new (require('../services/Exceptions'));
const curlingEventService = new CurlingEventService();

router.get('/events/:curlingEventId/teams/:teamId/games', async (req, res) => {
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

router.get('/events/:curlingEventId/teams/:teamId/scores', async (req, res) => {
  const curlingEventId = req.params.curlingEventId;
  const teamId = req.params.teamId;

  try {
    let gamesByTeam = await curlingEventService.getAllGamesAndScoresByTeam(curlingEventId, teamId);
    res.status(200).send(gamesByTeam);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/events/:curlingEventId/teams', async (req, res) => {
  try {
    let events = await curlingEventService.getAllTeamsByCurlingEvent(req.params.curlingEventId);
    res.status(200).send(events);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/events/:curlingEventId/games', async (req, res) => {
  try {
    let games = await curlingEventService.getAllGames(req.params.curlingEventId);
    res.status(200).send(games);
  }
  catch (error) {
    res.status(404).send(error);
  }

});

router.get('/events/:curlingEventId/draws', async (req, res) => {
  try {
    let draws = await curlingEventService.getAllDraws(req.params.curlingEventId);
    res.status(200).send(draws);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/events/:curlingEventId/scores', async (req, res) => {

  try {
    let scores = await curlingEventService.getAllGamesAndScores(req.params.curlingEventId);
    res.status(200).send(scores);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/events/', async (req, res) => {
  try {
    let events = await curlingEventService.getAllEvents();
    res.status(200).send(events);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/teams/', async (req, res) => {
  try {
    let curlers = await curlingEventService.getAllCurlers();
    res.status(200).send(curlers);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/:eventId/brackets', async (req, res) => {
  try {
    let eventId = req.params.eventId;
    let brackets = await curlingEventService.getBracketsForEvent(eventId);
    res.status(200).send(brackets);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/:eventId/pools', async (req, res) => {
  try {
    let eventId = req.params.eventId;
    let pools = await curlingEventService.getPoolsForEvent(eventId);
    res.status(200).send(brackets);
  }
  catch (error) {
    res.status(404).send(error);
  }
});


router.get('/teams/:teamId', async (req, res) => {
  try {
    let team = await curlingEventService.getCurlingTeam(req.params.teamId);
    res.status(200).send(team);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/orgs/:orgId/curlers', async (req, res) => {
  try {
    Exceptions.throwIfNull({ orgId: req.params.orgId });
    let org = await curlingEventService.getAllCurlersInOrg(req.params.orgId);
    res.status(200).send(org);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/orgs/:orgId', async (req, res) => {
  try {
    Exceptions.throwIfNull({ orgId: req.params.orgId });
    let org = await curlingEventService.getOrg(req.params.orgId);
    res.status(200).send(org);
  }
  catch (error) {
    res.status(404).send(error);
  }
});

router.get('/orgs/', async (req, res) => {
  try {
    let orgs = await curlingEventService.getOrgs();
    res.status(200).send(orgs);
  }
  catch (error) {
    res.status(404).send(error);
  }
});


/*THIS CODE WILL GO AWAY***************************************************************************/

router.post('/getTable/', (req, res) => {
  const tableName = req.body.tableName;
  curlingEventService.getPool().query(`SELECT * from public.${tableName}`)
    .then(data => res.send(data))
    .catch(err => {
      err.message = `Error in getTable ${err.message}`;
      console.error(err.message);
      res.send(err.message);
    });
});

router.post('/DANGEROUSADHOC', async (req, res) => {
  try {
    const sql = req.body.sql;
    const bannedCalls =
      ["CREATE", "UPDATE", "DELETE", "DROP",
        "ALTER", "TRUNCATE", "RENAME", "COMMENT"];

    if (bannedCalls.some(type => sql.toUpperCase().includes(type))) {
      const err = new Error("Illegal call");
      err.status = 400;
      err.message = `Illegal call is one of ${bannedCalls.toString()}`;
      throw err;
    }
    const data = await curlingEventService.getPool().query(sql);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.statusCode = err.status;
    res.send(err.message);
  }
});

/****************************************************************************/



module.exports = { router, curlingEventService };