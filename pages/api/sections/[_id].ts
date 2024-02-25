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

  const { _id } = req.query;

  if (req.method === 'PUT') {
    const { name } = req.body;
    const updatedSection = await Section.findOneAndUpdate(
      { _id: _id, user: userId },
      { name },
      { new: true }
    );
    if (!updatedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json(updatedSection);
  } else if (req.method === 'DELETE') {
    const deletedSection = await Section.findOneAndDelete({
      _id: _id,
      user: userId,
    });
    if (!deletedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json({ message: 'Section deleted' });
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
