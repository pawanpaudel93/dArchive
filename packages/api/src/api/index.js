const express = require('express');

const html = require('./html');
const balance = require('./balance');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/html', html);
router.use('/balance', balance);

module.exports = router;
