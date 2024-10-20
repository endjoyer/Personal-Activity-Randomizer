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

  if (req.method === 'PUT') {
    const { activities } = req.body;
    const section = await Section.findById(_id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.activities = [];

    for (const activity of activities) {
      section.activities.push({ name: activity.name });
    }

    await section.save();
    res.status(200).json(section);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
