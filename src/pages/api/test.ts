import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

// POST /api/test
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { punctuation, numbers, mode, length, wpm, accuracy } = req.body;

  const session = await getSession({ req });
  const result = await prisma.test.create({
    data: {
      punctuation: punctuation,
      numbers: numbers,
      mode: mode,
      length: length,
      wpm: wpm,
      accuracy: accuracy,
      user: { connect: { email: session?.user?.email as string | undefined } },
    },
  });
  res.json(result);
}
