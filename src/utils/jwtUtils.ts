import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { id: string; email: string; role: string },
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};