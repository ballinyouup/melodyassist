import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN as string}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "0de4a5f14b9120ce02c590eb9cf6c94841569fafbc4be7ab37436ce738bcf49f",

      // This is the text prompt that will be submitted by a form on the frontend
      input: { seed: "-1" },
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify(error));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
};

export default handler;
