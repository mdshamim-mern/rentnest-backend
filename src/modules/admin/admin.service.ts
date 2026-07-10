import { prisma } from '../../lib/prisma';
import { UserStatus } from '@prisma/client';

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
  return result;
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  return result;
};

const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        select: { id: true, name: true, email: true },
      },
      category: true,
    },
  });
  return result;
};

const getAllRentals = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: { id: true, name: true, email: true },
      },
      property: true,
    },
  });
  return result;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
};