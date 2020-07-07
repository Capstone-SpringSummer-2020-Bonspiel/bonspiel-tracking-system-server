const express = require('express');
const router = express.Router();
const { curlingEventService } = require('../routes/routes');
const AuthService = require('../services/AuthService');
const authService = new AuthService(curlingEventService.getPool());
const Exception = require('../services/Exceptions');
const { config } = require('chai');
const Exceptions = new Exception();

router.post('/signIn', async (req, res) => {
  const { username, password } = req.body;
  try {
    let authData = await authService.signIn(username, password);

    // Max age is in milliseconds.
    res.cookie("token", authData.token, { maxAge: authData.jwtExpirySeconds * 1000 })
    res.end();
  } catch (err) {
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

router.post('/createAdmin', (req, res) => {
  let { username, password } = req.body;
  const result = authService.createNewAdmin(username, password);
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

module.exports = router;