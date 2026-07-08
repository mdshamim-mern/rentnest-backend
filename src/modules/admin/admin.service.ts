import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return result;
};

const updateUserRole = async (userId: string, role: Role) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  return result;
};

export const AdminService = { getAllUsers, updateUserRole };