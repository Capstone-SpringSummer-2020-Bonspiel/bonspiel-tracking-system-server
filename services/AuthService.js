const { Pool } = require('pg');
const Queries = require('./queries/Queries');
const config = require('config');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtKey = "privateKey"; // config.jwtKey
const jwtExpirySeconds = 600 // 10 minutes

function generateSalt(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function hash(password, salt) {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let hashedPassword = hash.digest('hex');
  return {
    salt,
    password: hashedPassword
  }
}

function saltHashPassword(password, hashLength) {
  let salt = generateSalt(hashLength);
  let hashData = hash(password, salt);
  return hashData;
}

class AuthService {
  #pool;

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

  async signIn(username, password) {
    let dbUser = await this.retrieveAdminData(username);
    if (dbUser === null || !password || this.validatePassword(dbUser, password)) {
      throw Error("Invalid username or password");
    }

    const token = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    })

    console.log(token);

    return {
      token,
      jwtExpirySeconds
    }
  }

  validatePassword(dbUser, password) {
    let hashedPassword = hash(password, dbUser.salt);
    return hashedPassword.password !== dbUser.password;
  }

  async retrieveAdminData(username) {
    try {
      const values = [username];
      const dbUser = await this.#pool
        .query(Queries.GET_ADMIN_DATA, values);
      return {
        username: dbUser.rows[0].username,
        password: dbUser.rows[0].hash,
        hashLength: dbUser.rows[0].hashLength,
        salt: dbUser.rows[0].salt
      }
    }
    catch (err) {
      console.error(error.message);
      return null;
    }
  }

  async createNewAdmin(username, password, hashLength) {
    try {
      let hashData = saltHashPassword(password, hashLength);
      const values = [username, hashData.password, hashData.salt, hashLength];
      await this.#pool
        .query(Queries.CREATE_ADMIN, values);
      return {
        username,
        hashedPassword,
        salt,
        hashLength
      }
    }
    catch (err) {
      console.error(err.message);
      return null;
    }
  }

  authorize(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).end();
    }

    var payload;
    try {
      payload = jwt.verify(token, jwtKey);
    }
    catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).end();
      }

      return res.status(400).end();
    }

    next();
  }

  refresh(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).end();
    }
    var payload;
    try {
      payload = jwt.verify(token, jwtKey);
    }
    catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).end();
      }

      return res.status(400).end();
    }

    const currentUnixSeconds = Math.round(Number(new Date()) / 1000);
    const expiryThreshold = 30; // seconds
    if (payload.exp - currentUnixSeconds > expiryThreshold) {
      return res.status(400).end();
    }

    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    })
    res.cookie("token", newToken, { maxAge: jwtExpirySeconds * 1000 });
    res.end();
  }
}

module.exports = AuthService;