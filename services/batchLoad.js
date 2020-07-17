const { curlingEventService } = require('../routes/routes');
const AuthService = require('../services/AuthService');
const authService = new AuthService(curlingEventService.getPool());
const Exception = require('../services/Exceptions');
const config = require('config');
const Exceptions = new Exception();

class BatchLoad {

  async createTeam(req, res) {
    try {
      let { name, orgId, note } = req.body;
      let pgClient = req.pgClient;
      Exceptions.throwIfNull({ name, note });
      let success = await curlingEventService.createTeam(name, orgId, note, pgClient);

      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createCurler(req, res) {
    try {
      let { name, position, affiliation, curlingTeamId } = req.body;
      let pgClient = req.pgClient;
      Exceptions.throwIfNull({ name, position, affiliation, curlingTeamId });
      let success = await curlingEventService.createCurler(name, position, affiliation, curlingTeamId, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createBracket(req, res) {
    try {
      let { name } = req.body;
      let eventId = req.params.eventId;
      let bracket = req.body;
      let pgClient = req.pgClient;

      Exceptions.throwIfNull({ name, eventId });
      let success = await curlingEventService.addBracket(eventId, bracket, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }

    } catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createPool(req, res) {
    try {
      let { name } = req.body;
      let eventId = req.params.eventId;
      let pool = req.body;
      let pgClient = req.pgClient;

      Exceptions.throwIfNull({ name, eventId });
      let success = await curlingEventService.addPool(eventId, pool, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }

    } catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createEnd(req, res) {
    try {
      let { endNumber, blank, curlingTeam1Scored, score } = req.body;
      let gameId = req.params.gameId;
      let end = req.body;
      let pgClient = req.pgClient;

      Exceptions.throwIfNull({ endNumber, blank, curlingTeam1Scored, score, gameId });
      let success = await curlingEventService.addEnd(gameId, end, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }

    } catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createOrg(req, res) {
    try {
      const { shortName, fullName } = req.body;
      let pgClient = req.pgClient;
      Exceptions.throwIfNull({ shortName, fullName });
      let success = await curlingEventService.createOrganization(shortName, fullName, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async addTeamToEvent(req, res) {
    try {
      let eventId = req.params.eventId;
      let teamId = req.params.teamId;
      let pgClient = req.pgClient;

      Exceptions.throwIfNull({ teamId, eventId });
      let success = await curlingEventService.addTeamToEvent(eventId, teamId, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }

    } catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createGame(req, res) {
    try {
      let game = req.body;
      let pgClient = req.pgClient;
      let { eventType, notes, gameName, bracketId, poolId,
        drawId, curlingTeam1Id, curlingTeam2Id, stoneColor1,
        stoneColor2, destWinner, destLoser, iceSheet, finished, winner } = game;

      let success = await curlingEventService.addGame(game, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createDraw(req, res) {
    try {
      let eventId = req.params.eventId;
      let draw = req.pgClient;
      let { name, start, videoUrl } = draw;
      let pgClient = req.client;

      let success = await curlingEventService.addDraw(draw, eventId, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

  async createEvent(req, res) {
    try {
      let eventId = req.params.eventId;
      let event = req.body;
      let { name, beginDate, endDate, completed, info, eventType } = event;
      let pgClient = req.pgClient;

      let success = await curlingEventService.addEvent(event, pgClient);
      if (res) {
        res.status(200).send(success);
      } else {
        return success;
      }
    }
    catch (error) {
      console.error(error.message);
      let fullError = { error, message: error.message }
      if (res) {
        res.status(400).send(fullError);
      } else {
        throw fullError;
      }
    }
  }

}

module.exports = BatchLoad;