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
      Exceptions.throwIfNull({ name, note });
      let success = await curlingEventService.createTeam(name, orgId, note);
      res.status(200).send(success);
    }
    catch (error) {
      console.error(error.message);
      res.status(400).send({ error, message: error.message });
    }
  }

  async createCurler(req, res) {
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
  }

  async createBracket(req, res) {
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
  }

  async createPool(req, res) {
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
  }

  async createBracket(req, res) {
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
  }

  async createOrg(req, res) {
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
  }

  async addTeamToEvent(req, res) {
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
  }

}

module.exports = BatchLoad;