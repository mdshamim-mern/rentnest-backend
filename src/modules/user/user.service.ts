import { prisma } from '../../lib/prisma';

const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const updateProfile = async (userId: string, payload: any) => {
  const { bio, photo } = payload;
  
  const updatedProfile = await prisma.profile.upsert({
    where: { userId },
    update: { bio, photo },
    create: { userId, bio: bio || null, photo: photo || null },
  });

  return updatedProfile;
};

export const UserService = { getProfile, updateProfile };