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
      max: config.maxConnections
    });
  }

  getPool() {
    return this.#pool;
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
          "id": team.id,
          "curlers": []
        }
      }

      for (const curler of curlers.rows) {
        teamObj[curler.curlingteam_name].curlers.push(curler);
      }

      return teamObj;
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

  async getAllGamesAndScoresByTeam(curlingEventId, curlingTeamId) {
    try {
      const values = [curlingEventId, curlingTeamId];
      const data = await this.#pool
        .query(Queries.GET_ALL_GAMES_AND_SCORES_BY_TEAM_IN_CURLING_EVENT, values);
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
}

module.exports = CurlingEventService;