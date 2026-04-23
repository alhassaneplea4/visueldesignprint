'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const router   = express.Router();
const { log }  = require('../utils/logger');

/**
 * POST /api/auth/login
 * Authentification admin
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nom d\'utilisateur et mot de passe requis'
    });
  }

  // Vérification des identifiants (en production : utiliser une vraie base de données)
  const validUser = username === process.env.ADMIN_USER;
  const validPass = password === process.env.ADMIN_PASS;

  if (!validUser || !validPass) {
    // Délai artificiel pour limiter le brute-force
    await new Promise(resolve => setTimeout(resolve, 500));
    return res.status(401).json({
      success: false,
      message: 'Identifiants incorrects'
    });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  log('LOGIN', `Connexion administrateur — ${username}`, username);
  res.json({
    success: true,
    token,
    user: { username, role: 'admin' }
  });
});

/**
 * GET /api/auth/me
 * Vérifier le token courant
 */
router.get('/me', require('../middleware/auth.middleware'), (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
