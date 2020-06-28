const jwt = require("jsonwebtoken");

const jwtKey = "privateKey"; // config.jwtKey
const jwtExpirySeconds = 600 // 10 minutes

const users = {
  admin: "password"
} // Can store in db later

class AuthService {
  signIn(req, res) {
    const { username, password } = req.body;
    if (!username || !password || users[username] !== password) {
      return res.status(401).end();
    }

    const token = jwt.sign({ username }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds
    })

    console.log(token);

    // Max age is in milliseconds.
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
    res.end();
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