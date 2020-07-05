const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const authService = new AuthService();
const { curlingEventService } = require('../routes/routes');

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

router.use(authService.authorize);

// Put all routes that need admin auth below 

router.get('/testAuth', (req, res) => {
  return res.send("Nice");
});

router.delete('/draw/:drawId', async (req, res) => {
  const drawId = req.params.drawId;

  try {
    let success = await curlingEventService.deleteDraw(drawId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/team/:teamId', async (req, res) => {
  const teamId = req.params.teamId;

  try {
    let success = await curlingEventService.deleteTeam(teamId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/curler/:curlerId', async (req, res) => {
  const curlerId = req.params.curlerId;

  try {
    let success = await curlingEventService.deleteCurler(curlerId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.delete('/org/:orgId', async (req, res) => {
  const orgId = req.params.orgId;

  try {
    let success = await curlingEventService.deleteOrg(curleorgIdrId);
    res.status(200).send(success);
  }
  catch (error) {
    console.error(error.message);
    res.status(400).send({ error, message: error.message });
  }
});

router.post('/createAdmin', (req, res) => {
  let { username, password, hashLength } = req.body;
  const result = authService.createNewAdmin(username, password, hashLength);
  res.status(result !== null ? 200 : 400).send(result);
});

module.exports = router;