import { prisma } from '../../lib/prisma';
import { Status } from '@prisma/client';

const createRentalRequest = async (tenantId: string, payload: any) => {
  return await prisma.rentalRequest.create({
    data: {
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      property: {
        connect: { id: payload.propertyId },
      },
      tenant: {
        connect: { id: tenantId },
      },
    },
    include: { tenant: true, property: true }
  });
};

const getAllRentalRequests = async () => {
  return await prisma.rentalRequest.findMany({
    include: { tenant: true, property: true },
  });
};

const updateRentalRequestStatus = async (id: string, status: Status) => {
  return await prisma.rentalRequest.update({
    where: { id },
    data: { status },
  });
};

export const RentalService = { 
  createRentalRequest, 
  getAllRentalRequests, 
  updateRentalRequestStatus 
};
