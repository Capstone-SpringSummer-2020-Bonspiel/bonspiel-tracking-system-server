const { Pool, Client } = require('pg');

class GameService {
  get(gameId) {
    return {
      gameId: gameId
    }
  }
}

module.exports = GameService;