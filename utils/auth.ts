import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export const verifyJwt = (req: NextApiRequest): string | null => {
  try {
    const token = req.cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    return decoded.userId;
  } catch (error) {
    return null;
  }
};
