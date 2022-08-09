import type { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage, getFilesFromPath } from "web3.storage";
import { parse } from 'node-html-parser';
import { temporaryDirectory } from "tempy";
import { execFile } from "promisify-child-process";
import { resolve } from "path";
import fsPromises from "node:fs/promises";

type Data = {
  status: string;
  message: string;
  contentID: string;
  title: string;
};

const SINGLEFILE_EXECUTABLE = resolve(
  "..",
  "..",
  "node_modules/single-file-cli/single-file"
);
const BROWSER_PATH = "/usr/bin/google-chrome";
const BROWSER_ARGS = '["--no-sandbox"]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    let tempDirectory = temporaryDirectory();
    const url = req.body.url;
    try {
      const command = [
        `--browser-executable-path=${BROWSER_PATH}`,
        `--browser-args='${BROWSER_ARGS}'`,
        url,
        `--output=${resolve(tempDirectory, "index.html")}`,
        `--screenshot-path=${resolve(tempDirectory, "screenshot.png")}`,
        `--browser-width=1920`,
        `--browser-height=1080`,
      ];
      const { stderr } = await execFile(SINGLEFILE_EXECUTABLE, command);
      if (stderr) {
        console.error(stderr);
        return res.status(500).json({
          status: "error",
          message: stderr as string,
          contentID: "",
          title: "",
        });
      }
      const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
      const files = await getFilesFromPath(tempDirectory);
      console.log(files);
      const cid = await client.put(files, {
        wrapWithDirectory: false,
        maxRetries: 3,
      });
      const html = await fsPromises.readFile(resolve(tempDirectory, "index.html"));
      const parsed = parse(html.toString());
      const title = parsed.querySelector("title")?.text ?? "";
      console.log(title);
      await fsPromises.rm(tempDirectory, { recursive: true, force: true });
      return res.status(200).json({
        status: "success",
        message: "Uploaded to Web3.Storage!",
        contentID: cid,
        title,
      });
    } catch (error) {
      console.error(error);
      if (tempDirectory) {
        await fsPromises.rm(tempDirectory, { recursive: true, force: true });
      }
      return res.status(500).json({
        status: "error",
        message: "Error uploading to Web3.Storage!",
        contentID: "",
        title: "",
      });
    }
  }
}
