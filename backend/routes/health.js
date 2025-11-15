const express = require('express');
const router = express.Router();

/**
 * @route GET /api/v1/health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SproutSense Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

/**
 * @route GET /api/v1/health/detailed
 * @desc Detailed health check with system information
 * @access Public
 */
router.get('/detailed', (req, res) => {
  const healthInfo = {
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100
      }
    },
    services: {
      ollama: {
        url: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL
      }
    }
  };

  res.json(healthInfo);
});

module.exports = router;
