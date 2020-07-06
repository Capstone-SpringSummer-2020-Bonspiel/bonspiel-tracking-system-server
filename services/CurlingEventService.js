const { Pool, Client } = require('pg');
const config = require('config');
const Queries = require('./queries/Queries');
const Exception = require('../services/Exceptions');
const Exceptions = new Exception();

class CurlingEventService {
  #pool

  constructor() {
    this.#pool = new Pool({
      user: config.db.user,
      host: config.db.host,
      database: 'postgres',
      password: config.db.pass,
      port: config.db.port,
      max: config.maxConnections
    });
  }

  getPool() {
    return this.#pool;
  }

  async deleteDraw(drawId) {
    try {
      const values = [drawId];
      const data = await this.#pool
        .query(Queries.DELETE_DRAW, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deleteDrawException(error.message);
      throw error;
    }
  }

  async deleteTeam(teamId) {
    try {
      const values = [teamId];
      const data = await this.#pool
        .query(Queries.DELETE_TEAM, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deleteTeamException(error.message);
      throw error;
    }
  }

  async deleteCurler(curlerId) {
    try {
      const values = [curlerId];
      const data = await this.#pool
        .query(Queries.DELETE_CURLER, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      throw error;
    }
  }

  async deleteOrg(orgId) {
    try {
      const values = [orgId];
      const data = await this.#pool
        .query(Queries.DELETE_ORG, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deleteOrgException(error.message);
      throw error;
    }
  }

  async deletePool(poolId) {
    try {
      const values = [poolId];
      const data = await this.#pool
        .query(Queries.DELETE_POOL, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deletePoolException(error.message);
      throw error;
    }
  }

  async deleteBracket(bracketId) {
    try {
      const values = [bracketId];
      const data = await this.#pool
        .query(Queries.DELETE_BRACKET, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deleteBracketException(error.message);
      throw error;
    }
  }

  async getAllEvents() {
    try {
      const data = await this.#pool
        .query('SELECT * FROM public.curlingevent ORDER BY id ASC')
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async checkGamesPlayedByTeamInEvent(eventId, teamId) {
    try {
      const values = [eventId, teamId];
      let data = await this.#pool
        .query(Queries.GET_GAMES_PLAYED_BY_TEAM_IN_EVENT, values);
      if (data.rows.length != 0) {
        throw new Error(Exceptions.teamHasPlayedGamesException(`${data.rows.length} games played`));
      }
    }
    catch (error) {
      throw error;
    }
  }

  async deleteTeamInEvent(eventId, teamId) {
    try {
      const values = [eventId, teamId];
      let data = await this.#pool
        .query(Queries.DELETE_TEAM_IN_EVENT, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      throw error
    }
  }

  async deleteGame(gameId) {
    try {
      const values = [gameId];
      let data = await this.#pool
        .query(Queries.DELETE_GAME, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      error.message = Exceptions.deleteGameException(error.message);
      throw error;
    }
  }

  async checkGameIfFinished(endId) {
    try {
      const values = [endId];
      let data = await this.#pool
        .query(Queries.GET_GAME_FROM_END_ID, values);
      if (data.rows.length == 0) {
        throw Exceptions.invalidIdException();
      }
      if (data.rows[0].finished) {
        throw new Error(Exceptions.gameFinishedException());
      }
    }
    catch (error) {
      throw error;
    }
  }

  async deleteEnd(endId) {
    try {
      const values = [endId];
      let data = await this.#pool
        .query(Queries.DELETE_END, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;
    }
    catch (error) {
      throw error
    }
  }

  /*
   * Gets all curlers and sorts them into teams.
  */
  async getAllCurlers() {
    try {
      const curlers = await this.#pool
        .query(Queries.GET_ALL_CURLERS);

      /*
      {
        "{curlingteam_name}": {
          id: {curlingteam_id}
          curlers: [{}, {}, ...]
        }
      }
      */
      let teamNames = [...new Set(curlers.rows.map((value, index, self) => {
        return JSON.stringify({
          "curlingteam_name": value.curlingteam_name,
          "id": value.curlingteam_id
        });
      }))].map((val => JSON.parse(val)));

      let teamObj = {};
      for (const team of teamNames) {
        teamObj[team.curlingteam_name] = {
          "team_name": team.curlingteam_name,
          "id": team.id,
          "curlers": []
        }
      }

      for (const curler of curlers.rows) {
        if (curler.curler_id !== null) {
          teamObj[curler.curlingteam_name].curlers.push(curler);
        }
      }

      return Object.values(teamObj);
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getCurlingTeam(teamId) {
    try {
      const values = [teamId];
      const data = await this.#pool
        .query(Queries.GET_CURLING_TEAM, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }


  async getAllTeamsByCurlingEvent(curlingEventId) {
    try {
      const values = [curlingEventId];
      const curlers = await this.#pool
        .query(Queries.GET_ALL_TEAMS_IN_CURLING_EVENT, values);

      if (curlers.rows.length <= 0) return [];
      let teamNames = [...new Set(curlers.rows.map((value, index, self) => {
        return JSON.stringify({
          "curlingteam_name": value.curlingteam_name,
          "id": value.curlingteam_id
        });
      }))].map((val => JSON.parse(val)));

      let teamObj = {};
      for (const team of teamNames) {
        teamObj[team.curlingteam_name] = {
          "team_name": team.curlingteam_name,
          "id": team.id,
          "curlers": []
        }
      }

      for (const curler of curlers.rows) {
        if (curler.curler_id !== null) {
          teamObj[curler.curlingteam_name].curlers.push(curler);
        }
      }

      return Object.values(teamObj);
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getAllGamesByTeam(curlingEventId, curlingTeamId) {
    try {
      const values = [curlingEventId, curlingTeamId];
      const data = await this.#pool
        .query(Queries.GET_ALL_GAMES_BY_TEAM, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getAllGamesAndScoresByTeam(curlingEventId, curlingTeamId) {
    try {
      const values = [curlingEventId, curlingTeamId];
      const data = await this.#pool
        .query(Queries.GET_ALL_GAMES_AND_SCORES_BY_TEAM, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getAllGamesAndScores(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_GAMES_AND_SCORES, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }

  }

  async getAllGames(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_GAMES_IN_CURLING_EVENT, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getAllDraws(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_DRAWS_IN_CURLING_EVENT, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async createTeam(name, affiliation, note) {
    const values = [name, affiliation, note];
    try {
      const data = await this.#pool
        .query(Queries.CREATE_TEAM, values);
      return data.rows;
    }
    catch (err) {
      if (err.message.includes('affiliation')) {
        throw Exceptions.insertionException('Invalid affiliation/organization id.');
      }
    }
  }

  async updateTeam(id, name, affiliation, note) {
    if (affiliation === null || affiliation === undefined) {
      const events = await this.#pool.query(Queries.GET_FRIENDLY_EVENTS_BY_TEAM, [id]);
      if (events.rowCount > 0) {
        throw Exceptions.updateException('Team is a part of a "friendly" curling event');
      }
    }
    const values = [id, name, affiliation, note];
    try {
      const data = await this.#pool
        .query(Queries.UPDATE_TEAM, values);
      return data.rows;
    }
    catch (err) {
      if (err.message.includes('affiliation')) {
        throw Exceptions.insertionException('Invalid affiliation/organization id.');
      }
    }
  }

  async createCurler(name, position, affiliation, curlingTeamId) {
    const values = [name, position, affiliation, curlingTeamId];
    try {
      const data = await this.#pool
        .query(Queries.CREATE_CURLER, values);
      return data.rows;
    }
    catch (err) {
      if (err.message.includes("valid_position_types")) {
        throw Exceptions.insertionException("Invalid position type.");
      }
      if (err.message.includes("curlingteam_id")) {
        throw Exceptions.insertionException("Invalid curlingteam id.");
      }
      throw Exceptions.insertionException(err.message);
    }
  }

  async updateCurler(id, name, position, affiliation, curlingTeamId) {
    const values = [id, name, position, affiliation, curlingTeamId];
    try {
      const data = await this.#pool
        .query(Queries.UPDATE_CURLER, values);
      return data.rows;
    }
    catch (err) {
      if (err.message.includes("valid_position_types")) {
        throw Exceptions.insertionException("Invalid position type.");
      }
      if (err.message.includes("curlingteam_id")) {
        throw Exceptions.insertionException("Invalid curlingteam id.");
      }
      throw Exceptions.insertionException(err.message);
    }
  }

  async createOrganization(shortName, fullName) {
    const values = [shortName, fullName];
    try {
      const data = await this.#pool
        .query(Queries.CREATE_ORGANIZATION, values);
      return data.rows;
    }
    catch (err) {
      throw Exceptions.insertionException(err.message);
    }
  }

  async updateOrganization(id, shortName, fullName) {
    const values = [id, shortName, fullName];
    try {
      const data = await this.#pool
        .query(Queries.UPDATE_ORGANIZATION, values);
      return data.rows;
    }
    catch (err) {
      throw Exceptions.insertionException(err.message);
    }
  }
}

module.exports = CurlingEventService;