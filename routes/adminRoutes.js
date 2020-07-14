const express = require('express');
const router = express.Router();
const { curlingEventService } = require('../routes/routes');
const AuthService = require('../services/AuthService');
const authService = new AuthService(curlingEventService.getPool());
const Exception = require('../services/Exceptions');
const config = require('config');
const Exceptions = new Exception();

router.post('/signIn', async (req, res) => {
  const { username, password } = req.body;
  try {
    let authData = await authService.signIn(username, password);
    let maxAge = authData.jwtExpirySeconds * 1000;

    // Max age is in milliseconds.
    res.send({
      username,
      token: authData.token,
      maxAge,
      isSuperAdmin: authData.isSuperAdmin,
      expiryAt: new Date(new Date().getTime() + maxAge)
    });
  } catch (err) {
    console.log(err);
    return res.status(401).end();
  }
});

if (config.useAuth) {
  router.use(authService.authorize);
}
// Put all routes that need admin auth below 

router.post('/refresh', async (req, res) => authService.refresh(req, res));

router.get('/testAuth', (req, res) => {
  return res.send("Nice");
});

router.post('/createAdmin', (req, res) => {
  let { username, password, isSuperAdmin } = req.body;
  const result = authService.createNewAdmin(username, password, isSuperAdmin);
  result.then((account) => {
    res.status(200).send(account);
  }).catch(err => {
    if (err.message.includes("admin_pkey")) {
      res.status(400).send("Username is taken");
    }
    else {
      res.status(400).send(err.message);
    }
  });
});

router.get('/admins', async (req, res) => {
  try {
    let admins = await authService.getAdmins();
    res.status(200).send(admins);

  } catch (error) {
    res.status(404).send(error);
  }
});

router.delete('/draw/:drawId', async (req, res) => {

  try {
    const drawId = req.params.drawId;
    Exceptions.throwIfNull({ drawId });
    let success = await curlingEventService.deleteDraw(drawId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/team/:teamId', async (req, res) => {
  try {
    const teamId = req.params.teamId;
    Exceptions.throwIfNull({ teamId });
    let success = await curlingEventService.deleteTeam(teamId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/team/:teamId', async (req, res) => {
  try {
    const id = req.params.teamId;
    const { name, orgId, note } = req.body;
    Exceptions.throwIfNull({ id, name, note });
    let success = await curlingEventService.updateTeam(id, name, orgId, note);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/team/', async (req, res) => {
  try {
    let { name, orgId, note } = req.body;
    Exceptions.throwIfNull({ name, note });
    let success = await curlingEventService.createTeam(name, orgId, note);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/curler/:curlerId', async (req, res) => {
  try {
    const curlerId = req.params.curlerId;
    Exceptions.throwIfNull({ curlerId });
    let success = await curlingEventService.deleteCurler(curlerId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/curler/:curlerId', async (req, res) => {
  try {
    const id = req.params.curlerId;
    let { name, position, affiliation, curlingTeamId } = req.body;
    Exceptions.throwIfNull({ id, name, position, affiliation, curlingTeamId });
    let success = await curlingEventService.updateCurler(id, name, position, affiliation, curlingTeamId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/curler/', async (req, res) => {
  try {
    let { name, position, affiliation, curlingTeamId } = req.body;
    Exceptions.throwIfNull({ name, position, affiliation, curlingTeamId });
    let success = await curlingEventService.createCurler(name, position, affiliation, curlingTeamId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/event/:eventId', async (req, res) => {
  try {
    let { name, beginDate, endDate, completed, info, eventType } = req.body;
    let eventId = req.params.eventId;
    let event = req.body;

    Exceptions.throwIfNull({ name, beginDate, endDate, completed, info, eventType, eventId });
    let success = await curlingEventService.updateEvent(eventId, event);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/draw/:drawId', async (req, res) => {
  try {
    let { name, start, videoUrl } = req.body;
    let drawId = req.params.drawId;
    let draw = req.body;

    Exceptions.throwIfNull({ name, start, drawId });
    let success = await curlingEventService.updateDraw(drawId, draw);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/game/:gameId', async (req, res) => {
  try {
    let { notes, gameName, bracketId, poolId, drawId, curlingTeam1Id, curlingTeam2Id,
      stoneColor1, stoneColor2, destLoser, destWinner, iceSheet,
      finished, winner } = req.body;
    let gameId = req.params.gameId;
    let game = req.body;

    let success = await curlingEventService.updateGame(gameId, game);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/:eventId/bracket/', async (req, res) => {
  try {
    let { name } = req.body;
    let eventId = req.params.eventId;
    let bracket = req.body;

    Exceptions.throwIfNull({ name, eventId });
    let success = await curlingEventService.addBracket(eventId, bracket);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/bracket/:bracketId', async (req, res) => {
  try {
    let { eventId, name } = req.body;
    let bracketId = req.params.bracketId;
    let bracket = req.body;

    Exceptions.throwIfNull({ eventId, name, bracketId });
    let success = await curlingEventService.updateBracket(bracketId, bracket);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/:eventId/pool/', async (req, res) => {
  try {
    let { name } = req.body;
    let eventId = req.params.eventId;
    let pool = req.body;

    Exceptions.throwIfNull({ name, eventId });
    let success = await curlingEventService.addPool(eventId, pool);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/pool/:poolId', async (req, res) => {
  try {
    let { eventId, name } = req.body;
    let poolId = req.params.poolId;
    let pool = req.body;

    Exceptions.throwIfNull({ eventId, name, poolId });
    let success = await curlingEventService.updatePool(poolId, pool);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/:gameId/end/', async (req, res) => {
  try {
    let { endNumber, blank, curlingTeam1Scored, score } = req.body;
    let gameId = req.params.gameId;
    let end = req.body;

    Exceptions.throwIfNull({ endNumber, blank, curlingTeam1Scored, score, gameId });
    let success = await curlingEventService.addEnd(gameId, end);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/end/:endId', async (req, res) => {
  try {
    let { blank, curlingTeam1Scored, score } = req.body;
    let endId = req.params.endId;
    let end = req.body;

    Exceptions.throwIfNull({ blank, curlingTeam1Scored, score, endId });
    let success = await curlingEventService.updateEnd(endId, end);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/org/:orgId', async (req, res) => {

  try {
    const orgId = req.params.orgId;
    Exceptions.throwIfNull({ orgId });
    let success = await curlingEventService.deleteOrg(orgId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/org/:orgId', async (req, res) => {
  try {
    const id = req.params.orgId;
    const { shortName, fullName } = req.body;
    Exceptions.throwIfNull({ id, shortName, fullName });
    let success = await curlingEventService.updateOrganization(id, shortName, fullName);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/org/', async (req, res) => {
  try {
    const { shortName, fullName } = req.body;
    Exceptions.throwIfNull({ shortName, fullName });
    let success = await curlingEventService.createOrganization(shortName, fullName);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});



router.delete('/pool/:poolId', async (req, res) => {

  try {
    const poolId = req.params.poolId;
    Exceptions.throwIfNull({ poolId });
    let success = await curlingEventService.deletePool(poolId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/bracket/:bracketId', async (req, res) => {

  try {
    const bracketId = req.params.poolId;
    Exceptions.throwIfNull({ bracketId });
    let success = await curlingEventService.deleteBracket(bracketId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('event/:eventId/team/:teamId', async (req, res) => {
  try {
    let eventId = req.params.eventId;
    let teamId = req.params.teamId;

    Exceptions.throwIfNull({ teamId, eventId });
    let success = await curlingEventService.addTeamToEvent(eventId, teamId);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/event/:eventId/team/:teamId', async (req, res) => {

  try {
    const eventId = req.params.eventId;
    const teamId = req.params.teamId;
    Exceptions.throwIfNull({ teamId, eventId });

    await curlingEventService.checkGamesPlayedByTeamInEvent(eventId, teamId);
    let success = await curlingEventService.deleteTeamInEvent(eventId, teamId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/game/:gameId', async (req, res) => {

  try {
    const gameId = req.params.gameId;
    Exceptions.throwIfNull({ gameId });

    let success = await curlingEventService.deleteGame(gameId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/end/:endId', async (req, res) => {

  try {
    const endId = req.params.endId;
    Exceptions.throwIfNull({ endId });

    await curlingEventService.checkGameIfFinished(endId);
    let success = await curlingEventService.deleteEnd(endId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/event/:eventId', async (req, res) => {

  try {
    const eventId = req.params.eventId;
    Exceptions.throwIfNull({ eventId });

    let success = await curlingEventService.deleteEvent(eventId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.put('/editAdmin', async (req, res) => {
  try {
    let { username, password, isSuperAdmin } = req.body;
    const result = await authService.editAdmin(username, password, isSuperAdmin);
    res.status(200).send(result);
  } catch (error) {
    console.log('/editAdmin', error.message);
    res.status(400).send(error.message);
  }
});

router.delete('/deleteAdmin/:username', async (req, res) => {
  try {
    let username = req.params.username;
    const result = await authService.deleteAdmin(username);
    res.status(200).send(result);
  } catch (error) {
    console.log('/deleteAdmin', error.message);
    res.status(400).send(error.message);
  }
})

router.post('/:eventId/game', async (req, res) => {
  try {
    let game = req.body;
    let { eventType, notes, gameName, bracketId, poolId,
      drawId, curlingTeam1Id, curlingTeam2Id, stoneColor1,
      stoneColor2, destWinner, destLoser, iceSheet, finished, winner } = game;

    let success = await curlingEventService.addGame(game);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/:eventId/draw', async (req, res) => {
  try {
    let eventId = req.params.eventId;
    let draw = req.body;
    let { name, start, videoUrl } = draw;

    let success = await curlingEventService.addDraw(draw, eventId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/event', async (req, res) => {
  try {
    let eventId = req.params.eventId;
    let event = req.body;
    let { name, beginDate, endDate, completed, info, eventType } = event;

    let success = await curlingEventService.addEvent(event);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

module.exports = router;