const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const authService = new AuthService();

router.post('/signIn', authService.signIn);

router.use(authService.authorize);

// Put all routes that need admin auth below 

router.get('/testAuth', (req, res) => {
  return res.send("Nice");
})

module.exports = router;