import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

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

const getAdminInfo = async () => {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    include: { profile: true },
  });

  if (!admin) {
    throw new Error('Admin not found!');
  }

  const { password, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
};

const updateProfile = async (userId: string, payload: any) => {
  const { name, phone, whatsapp, password, bio, photo, address } = payload;
  const userUpdateData: any = {};

  if (name) userUpdateData.name = name;
  if (phone !== undefined) userUpdateData.phone = phone;
  if (whatsapp !== undefined) userUpdateData.whatsapp = whatsapp;
  
  if (password) {
    userUpdateData.password = await bcrypt.hash(password, 12);
  }

  if (Object.keys(userUpdateData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });
  }

  if (bio !== undefined || photo !== undefined || address !== undefined) {
    await prisma.profile.upsert({
      where: { userId },
      update: {
        ...(bio !== undefined && { bio }),
        ...(photo !== undefined && { photo }),
        ...(address !== undefined && { address }),
      },
      create: {
        userId,
        bio: bio || null,
        photo: photo || null,
        address: address || null,
      },
    });
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!updatedUser) {
    throw new Error('Update failed');
  }

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const UserService = { getProfile, getAdminInfo, updateProfile };