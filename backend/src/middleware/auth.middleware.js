'use strict';

const jwt = require('jsonwebtoken');

/**
 * Middleware de vérification JWT
 * Protège les routes d'administration
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification manquant'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expirée, veuillez vous reconnecter'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
}

module.exports = authMiddleware;
