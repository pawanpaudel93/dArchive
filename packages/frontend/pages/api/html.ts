// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { execFile } from "promisify-child-process";
import { resolve } from "path";

type Data = {
  status: string;
  html: string;
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
    const url = req.body.url;
    try {
      const command = [
        `--browser-executable-path=${BROWSER_PATH}`,
        `--browser-args='${BROWSER_ARGS}'`,
        url,
        `--dump-content`,
      ];
      const { stdout, stderr } = await execFile(
        SINGLEFILE_EXECUTABLE,
        command,
        {
          maxBuffer: 1024 * 1024 * 10,
        }
      );
      if (stderr) {
        res.status(500).json({
          status: "error",
          html: "",
        });
      }
      res.status(200).json({
        status: "success",
        html: stdout as string,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        html: "",
      });
    }
  }
}
