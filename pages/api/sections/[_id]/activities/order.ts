import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../utils/dbConnect';
import Section, { IActivity } from '../../../../../models/Section';
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
    const { orderedActivities } = req.body;
    const section = await Section.findById(_id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const activityIds = section.activities.map((a: IActivity) =>
      a._id.toString()
    );
    if (!orderedActivities.every((id: string) => activityIds.includes(id))) {
      return res.status(400).json({ message: 'Invalid activity IDs' });
    }

    section.activities = orderedActivities.map((id: string) =>
      section.activities.find((a: IActivity) => a._id.toString() === id)
    );
    await section.save();
    res.status(200).json(section);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
