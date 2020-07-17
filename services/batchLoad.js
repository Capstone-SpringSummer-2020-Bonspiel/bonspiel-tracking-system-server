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

}

module.exports = BatchLoad;