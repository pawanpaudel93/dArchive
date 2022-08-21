const express = require('express');

const html = require('./html');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/html', html);

module.exports = router;
