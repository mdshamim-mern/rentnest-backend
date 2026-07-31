import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createTourRequest = async (tenantId: string, propertyId: string) => {
    return await prisma.tourRequest.create({
        data: {
            tenantId,
            propertyId
        }
    });
};

const getLandlordTourRequests = async (landlordId: string) => {
    return await prisma.tourRequest.findMany({
        where: {
            property: { landlordId: landlordId }
        },
        include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const TourService = {
    createTourRequest,
    getLandlordTourRequests
};