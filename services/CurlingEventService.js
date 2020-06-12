const { Pool, Client } = require('pg');
const config = require('config');
const Queries = require('./queries/Queries');

class CurlingEventService {
  #pool

  constructor() {
    this.#pool = new Pool({
      user: config.db.user,
      host: config.db.host,
      database: 'postgres',
      password: config.db.pass,
      port: config.db.port,
    });
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

  async getAllTeamsByCurlingEvent(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_ALL_TEAMS_IN_CURLING_EVENT, values);
      return data.rows;
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
        .query(Queries.GET_ALL_GAMES_BY_TEAM_IN_CURLING_EVENT, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async getStandings(curlingEventId) {
    try {
      const values = [curlingEventId];
      const data = await this.#pool
        .query(Queries.GET_STANDINGS, values);
      return data.rows;
    }
    catch (error) {
      console.error(error.message);
      throw error;
    }

  }

  async getAllGames(curlingeventId) {
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
}

module.exports = CurlingEventService;