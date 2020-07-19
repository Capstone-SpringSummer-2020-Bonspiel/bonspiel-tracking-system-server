const { curlingEventService } = require('../routes/routes');
const Exception = require('../services/Exceptions');
const config = require('config');
const Exceptions = new Exception();
const multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const util = require('util')
const fs = require('fs');
const { json } = require('express');

class BatchLoad {
  #pool;
  #sheetsInOrder = ["organization", "team", "event", "curler", "draw", "teaminevent",
    "bracket", "pool", "game", "end"];

  #sheetsToFunc = {
    organization: this.createOrg,
    team: this.createTeam,
    event: this.addEvent,
    curler: this.createCurler,
    draw: this.createDraw,
    teaminevent: this.addTeamToEvent,
    bracket: this.addBracket,
    pool: this.addPool,
    game: this.addGame,
    end: this.addEnd
  }

  constructor(pool) {
    this.#pool = pool;
  }

  async uploadSpreadsheet(req, res) {
    try {
      let result = await this.parseToJson(req, res);
      console.log('Spreadsheet result', result);
      /*
      const pgClient = await this.#pool.connect();

      try {
        await client.query('BEGIN')
        this.#sheetsInOrder.forEach(sheetName => {
          let
        })
      } catch (error) {
        await pgClient.query('ROLLBACK')
        throw error
      } finally {
        pgClient.release()
      }
      */

      res.status(200).send(result);
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

  async parseToJson(req, res) {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '.')
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
      }
    });
    let upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
          return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
      }
    }).single('file');

    let exceltojson;

    try {
      upload = util.promisify(upload);
      await upload(req, res);

      if (!req.file) {
        throw new Error('no file passed');
      }

      if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
        exceltojson = xlsxtojson;
      } else {
        exceltojson = xlstojson;
      }
    } catch (error) {
      console.log('Error uploading ', error);
      throw error;
    }

    let json = {};
    try {
      exceltojson = util.promisify(exceltojson);
      this.#sheetsInOrder.forEach(async sheet => {
        json[sheet] = await exceltojson({
          input: req.file.path,
          output: null,
          lowerCaseHeaders: false,
          sheet
        });
        json[sheet].forEach(row => {
          Object.keys(row).forEach(k => row[k] = row[k] === '' ? null : row[k])
        })
      })
    } catch (error) {
      error.message = "Corrupted Excel File " + error.message;
      throw error;
    }

    try {
      const unlinkAsync = util.promisify(fs.unlink);
      await unlinkAsync(req.file.path)
    } catch {
      error.message = "Error deleting file " + error.message;
      throw error;
    }

    return json;

  }

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

      let nullCheck;
      if (!bracketId && !poolId) {
        throw new Error('One of bracketId or poolId must be provided')
      }

      Exceptions.throwIfNull({
        eventType, gameName, drawId, stoneColor1,
        stoneColor2, iceSheet, finished, winner
      })

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

      Exceptions.throwIfNull({ name, start, eventId });

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
      let event = req.body;
      let { name, beginDate, endDate, completed, info, eventType } = event;
      let pgClient = req.pgClient;

      Exceptions.throwIfNull({ name, beginDate, endDate, completed, info, eventType });
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