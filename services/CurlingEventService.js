const { Pool, Client } = require('pg');
const config = require('config');

class CurlingEventService {
  #pool

  constructor() {
    this.#pool = new Pool({
      user: config.db.DB_USER,
      host: config.db.DB_HOST,
      database: 'postgres',
      password: config.db.DB_PASS,
      port: config.db.DB_PORT,
    });
  }

  GetAllEvents() {
    pool.query('SELECT * FROM public.curlingevent ORDER BY id ASC', (err, _res) => {
    });
  }

}

module.exports = CurlingEventService;