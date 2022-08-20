import { NextApiRequest, NextApiResponse } from "next";
import { URL } from "url";
import fetch from "node-fetch";
import { getErrorMessage } from "@/parser";

type Data = {
  status: string;
  message: string;
  balance: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const authToken = process.env.BICONOMY_AUTH_TOKEN!;
  const apiKey = process.env.NEXT_PUBLIC_BICONOMY_API_KEY!;
  const url = new URL("https://data.biconomy.io/api/v1/dapp/gas-tank-balance");
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authToken: authToken,
      apiKey: apiKey,
    },
  };
  console.log(requestOptions);
  try {
    const response = await fetch(url, requestOptions);
    const responseJson = await response.json();
    console.log(responseJson);
    if (response.status === 200) {
      return res.status(200).json({
        status: "success",
        message: "Balance retrieved successfully",
        balance: responseJson.dappGasTankData.effectiveBalanceInStandardForm,
      });
    } else {
      return res.status(response.status).json({
        status: "error",
        message: "Error retrieving balance",
        balance: 0,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: getErrorMessage(error),
      balance: 0,
    });
  }
}
