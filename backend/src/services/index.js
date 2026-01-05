/**
 * Services Index
 * Central export point for all service modules
 * Allows clean imports: const { authService, urlService } = require('./services');
 */

module.exports = {
  authService: require('./auth.service'),
  urlService: require('./url.service')
};
