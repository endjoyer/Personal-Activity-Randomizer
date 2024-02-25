import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../utils/dbConnect';
import Section from '../../../../../models/Section';
import { verifyJwt } from '../../../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const userId = verifyJwt(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { _id } = req.query;

  if (req.method === 'POST') {
    const { name } = req.body;
    const section = await Section.findById(_id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    section.activities.push({ name });
    await section.save();
    res.status(201).json(section);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
