const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const authService = new AuthService();
const CurlingEventService = require('../services/CurlingEventService');
const curlingEventService = new CurlingEventService();

router.post('/signIn', authService.signIn);

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
    res.status(400).send(JSON.stringify(error));
  }
});

module.exports = router;