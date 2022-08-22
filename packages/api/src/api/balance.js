/* eslint-disable no-console */
const express = require('express');
const { URL } = require('url');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', async (req, res) => {
  const authToken = process.env.BICONOMY_AUTH_TOKEN;
  const apiKey = process.env.BICONOMY_API_KEY;
  const url = new URL('https://data.biconomy.io/api/v1/dapp/gas-tank-balance');
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      authToken,
      apiKey,
    },
  };
  try {
    const response = await fetch(url, requestOptions);
    const responseJson = await response.json();
    if (response.status === 200) {
      return res.status(200).json({
        status: 'success',
        message: 'Balance retrieved successfully',
        balance: responseJson.dappGasTankData.effectiveBalanceInStandardForm,
      });
    }
    return res.status(response.status).json({
      status: 'error',
      message: 'Error retrieving balance',
      balance: 0,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      balance: 0,
    });
  }
});

module.exports = router;
