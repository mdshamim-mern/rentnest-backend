import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../config'; 

const signup = async (payload: any) => {

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
  });

  const { password, ...userWithoutPassword } = result;
  return userWithoutPassword;
};

const login = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.access_secret as Secret,
    { expiresIn: '1d' } 
  );

  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token,
  };
};

export const AuthService = { signup, login };
