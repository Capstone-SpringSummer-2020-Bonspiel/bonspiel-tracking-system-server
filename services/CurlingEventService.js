const { Pool, Client } = require('pg');
const config = require('config');

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

  getAllEvents() {
    pool.query('SELECT * FROM public.curlingevent ORDER BY id ASC', (err, _res) => {
    });
  }

}

module.exports = CurlingEventService;