import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Section from '../../../models/Section';
import { verifyJwt } from '../../../utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const userId = verifyJwt(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const sections = await Section.find({ user: userId });
    res.status(200).json(sections);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const newSection = new Section({ user: userId, name, activities: [] });
    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
