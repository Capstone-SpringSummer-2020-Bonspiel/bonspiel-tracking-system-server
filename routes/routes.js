const express = require('express');
const router = express.Router();
const GameService = require('../services/GameService');

router.get('/draw/:drawId/game/:gameId', (req, res) => {
  let gameService = new GameService();
  let drawId = req.params.gameId;
  let gameId = req.params.gameId;

  let game = gameService.get(gameId);
  if (game == undefined || game == null) {
    res.sendStatus(404);
  }
  res.status(200).send(game);
});

module.exports = router;