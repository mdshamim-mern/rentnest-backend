import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../config'; // কনফিগ পাথ ঠিক আছে কিনা চেক করবেন

const signup = async (payload: any) => {
  // পাসওয়ার্ড হ্যাশ করা হচ্ছে
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role,
    },
  });

  // রেসপন্সে যেন পাসওয়ার্ড না যায় তাই সেটা আলাদা করে দিচ্ছি
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

  // পাসওয়ার্ড মিলছে কিনা চেক করা
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Incorrect password!');
  }

  // টোকেন তৈরি করা হচ্ছে
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.access_secret as Secret,
    { expiresIn: '1d' } // ১ দিন মেয়াদ
  );

  const { password, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token,
  };
};

export const AuthService = { signup, login };