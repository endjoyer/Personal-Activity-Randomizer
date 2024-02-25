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

  const { _id, activityId } = req.query;
  console.log(activityId);
  const section = await Section.findById(_id);
  if (!section) {
    return res.status(404).json({ message: 'Section not found' });
  }

  const activityIndex = section.activities.findIndex((a) =>
    a._id.equals(activityId)
  );
  if (activityIndex === -1) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  if (req.method === 'PUT') {
    const { name } = req.body;
    section.activities[activityIndex].name = name;
    await section.save();
    res.status(200).json(section);
  } else if (req.method === 'DELETE') {
    section.activities.splice(activityIndex, 1);
    await section.save();
    res.status(200).json(section);
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
