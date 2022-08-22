/* eslint-disable no-console */
const express = require('express');

const { Web3Storage, getFilesFromPath } = require('web3.storage');
const { directory } = require('tempy');
const { execFile } = require('promisify-child-process');
const { resolve } = require('path');
const fsPromises = require('node:fs/promises');

const router = express.Router();

const SINGLEFILE_EXECUTABLE = 'single-file';
const BROWSER_PATH = '/usr/bin/google-chrome';
const BROWSER_ARGS = '["--no-sandbox"]';

router.post('/', async (req, res) => {
  const tempDirectory = directory();
  const { url } = req.body;
  try {
    const command = [
      `--browser-executable-path=${BROWSER_PATH}`,
      `--browser-args='${BROWSER_ARGS}'`,
      url,
      `--output=${resolve(tempDirectory, 'index.html')}`,
      `--base-path=${tempDirectory}`,
      `--localhost=${!process.env.AWS_LAMBDA_FUNCTION_VERSION}`,
    ];
    const { stderr } = await execFile(SINGLEFILE_EXECUTABLE, command);
    if (stderr) {
      console.error(stderr);
      return res.status(500).json({
        status: 'error',
        message: stderr,
        contentID: '',
        title: '',
      });
    }
    const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN, endpoint: new URL('https://api.web3.storage') });
    const files = await getFilesFromPath(tempDirectory);
    // console.log(files);
    const cid = await client.put(files, {
      wrapWithDirectory: false,
      maxRetries: 3,
    });
    const data = await (await fsPromises.readFile(resolve(tempDirectory, 'metadata.json'))).toString();
    const { title } = JSON.parse(data);
    await fsPromises.rm(tempDirectory, { recursive: true, force: true });
    return res.status(200).json({
      status: 'success',
      message: 'Uploaded to Web3.Storage!',
      contentID: cid,
      title,
    });
  } catch (error) {
    console.error(error);
    if (tempDirectory) {
      await fsPromises.rm(tempDirectory, { recursive: true, force: true });
    }
    return res.status(500).json({
      status: 'error',
      message: error.message,
      contentID: '',
      title: '',
    });
  }
});

module.exports = router;
