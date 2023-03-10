
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${req.query.id as string}`,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN as string}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status !== 200) {
    const error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify(error));
    return;
  }

  const prediction = await response.json();
  res.end(JSON.stringify(prediction));
};
export default handler;
