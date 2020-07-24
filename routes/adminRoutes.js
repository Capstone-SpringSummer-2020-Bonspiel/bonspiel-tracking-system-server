const express = require('express');
const router = express.Router();
const { curlingEventService } = require('../routes/routes');
const AuthService = require('../services/AuthService');
const authService = new AuthService(curlingEventService.getPool());
const Exception = require('../services/Exceptions');
const config = require('config');
const Exceptions = new Exception();
const BatchLoad = require('../services/batchLoad');
const batchLoad = new BatchLoad(curlingEventService.getPool());

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

router.post('/register', (req, res) => {
  let { username, password } = req.body;
  const result = authService.registerUser(username, password);
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

router.post('/team/', async (req, res) => batchLoad.createTeam(req, res));

router.post('/batchUpload', async (req, res) => batchLoad.uploadSpreadsheet(req, res))

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
    let { name, position, affiliation, curlingTeamId, throwingOrder } = req.body;
    Exceptions.throwIfNull({ id, name, affiliation, curlingTeamId });
    let success = await curlingEventService.updateCurler(id, name, position, affiliation, curlingTeamId, throwingOrder);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/curler/', async (req, res) => batchLoad.createCurler(req, res));

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

    if (!bracketId && !poolId) {
      throw new Error('One of bracketId or poolId must be provided')
    }

    if (winner && ![curlingTeam1Id, curlingTeam2Id].includes(winner)) {
      throw new Error('Winner must be one of curlingTeam1Id or curlingTeam2Id')
    }

    if (winner && finished == 'FALSE') {
      throw new Error('Game cannot have a winner without being finished')
    }

    Exceptions.throwIfNull({
      eventType, gameName, drawId, stoneColor1,
      stoneColor2, iceSheet, finished
    })

    let success = await curlingEventService.updateGame(gameId, game);
    res.status(200).send(success);

  } catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});
//fakecommit

router.post('/:eventId/bracket/', async (req, res) => batchLoad.createBracket(req, res));

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

router.post('/:eventId/pool/', async (req, res) => batchLoad.createPool(req, res));

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


router.post('/:gameId/end/', async (req, res) => batchLoad.createEnd(req, res));

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

router.post('/org/', async (req, res) => batchLoad.createOrg(req, res));

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
    const bracketId = req.params.bracketId;
    Exceptions.throwIfNull({ bracketId });
    let success = await curlingEventService.deleteBracket(bracketId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('event/:eventId/team/:teamId', async (req, res) => batchLoad.addTeamToEvent(req, res));

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
    let { username, password, isSuperAdmin, active } = req.body;
    const result = await authService.editAdmin(username, password, isSuperAdmin, active);
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

router.post('/:eventId/game', async (req, res) => batchLoad.createGame(req, res));

router.post('/:eventId/draw', async (req, res) => batchLoad.createDraw(req, res));

router.post('/event', async (req, res) => batchLoad.createEvent(req, res));

module.exports = router;