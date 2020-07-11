const { Pool } = require('pg');
const Queries = require('./queries/Queries');
const config = require('config');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Exceptions = new (require('./Exceptions'));


const jwtKey = "privateKey"; // config.jwtKey
const jwtExpirySeconds = config.jwtExpirySeconds // 10 minutes

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

  constructor(pool) {
    this.#pool = pool;
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
      jwtExpirySeconds,
      isSuperAdmin: dbUser.isSuperAdmin
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
        salt: dbUser.rows[0].salt,
        isSuperAdmin: dbUser.rows[0].issuperadmin
      }
    }
    catch (err) {
      console.error(err.message);
      return null;
    }
  }

  async createNewAdmin(username, password, isSuperAdmin) {
    Exceptions.throwIfNull({ username, password, isSuperAdmin });
    let hashLength = config.hashLength;
    let hashData = saltHashPassword(password, hashLength);
    const values = [username, hashData.password, hashData.salt, hashLength, isSuperAdmin];
    await this.#pool
      .query(Queries.CREATE_ADMIN, values);
    return {
      username,
      password: hashData.password,
      salt: hashData.salt,
      hashLength,
      isSuperAdmin
    }
  }

  async editAdmin(username, password, isSuperAdmin) {
    Exceptions.throwIfNull({ username, isSuperAdmin });
    let values;
    let query;

    if (!password) {
      values = [username, isSuperAdmin];
      query = Queries.UPDATE_ADMIN_NO_PASSWORD;
    } else {
      let hashLength = config.hashLength;
      let hashData = saltHashPassword(password, hashLength);
      values = [username, hashData.password, hashData.salt, hashLength, isSuperAdmin];
      query = Queries.UPDATE_ADMIN;
    }

    const result = await this.#pool
      .query(query, values);

    if (result.rowCount == 0) {
      throw Exceptions.invalidIdException();
    }

    return result;
  }

  async deleteAdmin(username) {
    Exceptions.throwIfNull({ username });
    const values = [username];
    const result = await this.#pool
      .query(Queries.DELETE_ADMIN, values);
    if (result.rowCount == 0) {
      throw Exceptions.invalidIdException();
    }
    return result;
  }

  authorize(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      console.log('No token authorize');
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
      console.log('No token refresh');
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
    });
    let maxAge = jwtExpirySeconds * 1000;
    res.cookie("token", newToken, { maxAge, secure: true, sameSite: 'none' });
    res.send({
      token: newToken,
      maxAge,
      expiryAt: new Date(new Date().getTime() + maxAge)
    });
  }
}

module.exports = AuthService;