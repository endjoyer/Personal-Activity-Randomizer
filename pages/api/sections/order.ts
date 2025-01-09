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

  if (req.method === 'PUT') {
    const { orderedSections } = req.body;
    const sections = await Section.find({ user: userId });

    const sectionsMap = sections.reduce((acc, section) => {
      acc[section._id] = section;
      return acc;
    }, {});

    // Обновляем порядок в базе данных
    await Promise.all(
      orderedSections.map((id: string, index: number) => {
        const section = sectionsMap[id];
        if (section) {
          section.order = index;
          return section.save();
        }
      })
    );

    const orderedSectionsData = orderedSections.map(
      (id: string) => sectionsMap[id]
    );

    res.status(200).json({ sections: orderedSectionsData });
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
