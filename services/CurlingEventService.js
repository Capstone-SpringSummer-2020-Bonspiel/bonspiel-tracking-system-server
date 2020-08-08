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

  async getDefaultEventId() {
    try {
      const data = await this.#pool
        .query('SELECT * FROM public.defaultevent WHERE active_flag = true ORDER BY id ASC')
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

  async updateEvent(eventId, event) {
    try {
      const values = [eventId, event.name, event.beginDate, event.endDate,
        event.completed, event.info, event.eventType];
      let data = await this.#pool
        .query(Queries.UPDATE_EVENT, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async updateDraw(drawId, draw) {
    try {
      const values = [drawId, draw.name, draw.start, draw.videoUrl];
      let data = await this.#pool
        .query(Queries.UPDATE_DRAW, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async updateGame(gameId, game) {
    try {
      const values = [gameId, game.notes, game.gameName, game.bracketId, game.poolId,
        game.drawId, game.curlingTeam1Id, game.curlingTeam2Id,
        game.stoneColor1, game.stoneColor2, game.destLoser, game.destWinner, game.iceSheet,
        game.finished, game.winner];
      let data = await this.#pool
        .query(Queries.UPDATE_GAME, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async addBracket(eventId, bracket, pgClient = this.#pool) {
    try {
      const values = [eventId, bracket.name];
      let data = await pgClient
        .query(Queries.ADD_BRACKET, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async updateBracket(bracketId, bracket) {
    try {
      const values = [bracketId, bracket.name, bracket.eventId];
      let data = await this.#pool
        .query(Queries.UPDATE_BRACKET, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async addPool(eventId, pool, pgClient = this.#pool) {
    try {
      const values = [eventId, pool.name];
      let data = await pgClient
        .query(Queries.ADD_POOL, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async updatePool(poolId, pool) {
    try {
      const values = [poolId, pool.name, pool.eventId];
      let data = await this.#pool
        .query(Queries.UPDATE_POOL, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async addEnd(gameId, end, pgClient = this.#pool) {
    try {
      const values = [gameId, end.endNumber, end.blank, end.curlingTeam1Scored, end.score];
      let data = await pgClient
        .query(Queries.ADD_END, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async updateEnd(endId, end) {
    try {
      const values = [endId, end.blank, end.curlingTeam1Scored, end.score];
      let data = await this.#pool
        .query(Queries.UPDATE_END, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
      throw error
    }
  }

  async addTeamToEvent(eventId, teamId, pgClient = this.#pool) {
    try {
      const values = [eventId, teamId];
      let data = await pgClient
        .query(Queries.ADD_TEAM_TO_EVENT, values);
      if (data.rowCount == 0) {
        throw Exceptions.invalidIdException();
      }
      return data;

    } catch (error) {
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
          "note": value.curlingteam_note,
          "id": value.curlingteam_id
        });
      }))].map((val => JSON.parse(val)));

      let teamObj = {};
      for (const team of teamNames) {
        teamObj[team.curlingteam_name] = {
          "team_name": team.curlingteam_name,
          "id": team.id,
          "note": team.note,
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

  async getAllEventTeamsInEvent(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_EVENT_TEAMS_IN_EVENT, values);
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

  async getBracketsForEvent(eventId) {
    try {
      const values = [eventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_BRACKETS_FOR_EVENT, values);

      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      const values = [eventId];
      const data = await this.#pool
        .query(Queries.DELETE_EVENT, values);

      if (data.rowCount == 0) {
        Exceptions.invalidIdException();
      }

      return data;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getPoolsForEvent(eventId) {
    try {
      const values = [eventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_POOLS_FOR_EVENT, values);

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

  async addGame(game, pgClient = this.#pool) {
    try {
      let values = [game.eventType, game.notes, game.gameName, game.bracketId, game.poolId, game.drawId,
      game.curlingTeam1Id, game.curlingTeam2Id, game.stoneColor1, game.stoneColor2,
      game.destWinner, game.destLoser, game.iceSheet, game.finished, game.winner];
      const data = await pgClient
        .query(Queries.INSERT_GAME, values);
      return data;
    }
    catch (error) {
      error.message = Exceptions.invalidIdException().message;
      throw error;
    }
  }

  async addDraw(draw, eventId, pgClient = this.#pool) {
    try {
      let drawData = [eventId, draw.name, draw.start, draw.videoUrl]

      const data = await pgClient
        .query(Queries.INSERT_DRAW, drawData);
      return data;
    }
    catch (error) {
      error.message = Exceptions.invalidIdException().message;
      throw error;
    }
  }

  async addEvent(event, pgClient = this.#pool) {
    try {
      const eventData = [event.name, event.beginDate, event.endDate,
      event.completed, event.info, event.eventType];
      const data = await pgClient
        .query(Queries.INSERT_EVENT, eventData);
      return data;
    }
    catch (error) {
      error.message = Exceptions.invalidIdException().message;
      throw error;
    }
  }

  async createTeam(name, affiliation, note, pgClient = this.#pool) {
    const values = [name, affiliation, note];
    try {
      const data = await pgClient
        .query(Queries.CREATE_TEAM, values);
      return data;
    }
    catch (err) {
      if (err.message.includes('affiliation')) {
        throw Exceptions.insertionException('Invalid affiliation/organization id.');
      }
      throw Exceptions.insertionException(err.message);
    }
  }

  async updateTeam(id, name, affiliation, note) {
    if (affiliation === null || affiliation === undefined) {
      const events = await this.#pool.query(Queries.GET_FRIENDLY_EVENTS_BY_TEAM, [id]);
      if (events.rows.length > 0) {
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
      throw Exceptions.insertionException(err.message);
    }
  }

  async createCurler(name, position, affiliation, curlingTeamId, throwingOrder, pgClient = this.#pool) {
    const values = [name, position, affiliation, curlingTeamId, throwingOrder];
    try {
      const data = await pgClient
        .query(Queries.CREATE_CURLER, values);
      return data;
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

  async updateCurler(id, name, position, affiliation, curlingTeamId, throwingOrder) {
    const values = [id, name, position, affiliation, curlingTeamId, throwingOrder];
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

  async createOrganization(shortName, fullName, pgClient = this.#pool) {
    const values = [shortName, fullName];
    try {
      const data = await pgClient
        .query(Queries.CREATE_ORGANIZATION, values);
      return data;
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

  async getOrgs() {
    try {
      const data = await this.#pool
        .query(Queries.GET_ALL_ORGANIZATIONS);
      return data.rows;
    }
    catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async getOrg(orgId) {
    const values = [orgId];
    try {
      const data = await this.#pool
        .query(Queries.GET_ORGANIZATION, values);
      return data.rows;
    }
    catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async getAllCurlersInOrg(orgId) {
    const values = [orgId];
    try {
      const teamData = await this.#pool.query(Queries.GET_CURLERS_IN_ORG, values);
      return teamData.rows;
    }
    catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  async generateBrackets(curlingEventId) {
    try {
      const games = await this.getAllGamesAndScores(curlingEventId);
      let nodes = this.createBracketNodes(games);
      let edges = this.createBracketEdges(games);

      return {
        nodes,
        edges
      };
    }
    catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  createBracketNodes(games) {
    const nodes = [];
    for (let i = 0; i < games.length; i++) {
      nodes.push({
        id: games[i].game_id.toString(),
        label: `${games[i].game_name}`
      });
    }

    return nodes;
  }

  createBracketEdges(games) {
    const edges = [];
    for (let i = 0; i < games.length; i++) {
      if (games[i].winner_dest && games[i].loser_dest) {
        edges.push({
          source: games[i].game_id.toString(),
          target: games[i].winner_dest.toString(),
          label: ''
        });
      }
    }
    return edges;
  }
}

module.exports = CurlingEventService;