import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getRequestsForLandlord = async (landlordId: string) => {
    const requests = await prisma.rentalRequest.findMany({
        where: { property: { landlordId: landlordId } },
        include: { property: true, tenant: { select: { id: true, name: true, email: true } } }
    });

    const requestIds = requests.map(req => req.id);
    
    const payments = await prisma.payment.findMany({
        where: { rentalRequestId: { in: requestIds } }
    });

    return requests.map(req => {
        const reqPayments = payments.filter(p => p.rentalRequestId === req.id);
        const totalPaid = reqPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        return {
            ...req,
            totalPaid
        };
    });
};

const getTourRequestsForLandlord = async (landlordId: string) => {
    return await prisma.tourRequest.findMany({
        where: { property: { landlordId: landlordId } },
        include: { property: true, tenant: { select: { id: true, name: true, email: true } } }
    });
};

const updateRentalRequestStatus = async (requestId: string, landlordId: string, status: string) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: { id: requestId },
        include: { property: true }
    });
    if (!rentalRequest || rentalRequest.property.landlordId !== landlordId) {
        throw new Error("Unauthorized or request not found!");
    }
    return await prisma.rentalRequest.update({
        where: { id: requestId },
        data: { status: status as any }
    });
};

const updateTourRequestStatus = async (requestId: string, landlordId: string, status: string) => {
    const tourRequest = await prisma.tourRequest.findUnique({
        where: { id: requestId },
        include: { property: true }
    });
    if (!tourRequest || tourRequest.property.landlordId !== landlordId) {
        throw new Error("Unauthorized or request not found!");
    }
    return await prisma.tourRequest.update({
        where: { id: requestId },
        data: { status: status as any }
    });
};

const updateProperty = async (propertyId: string, landlordId: string, payload: any) => {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.landlordId !== landlordId) {
        throw new Error("Property not found or unauthorized!");
    }
    return await prisma.property.update({
        where: { id: propertyId },
        data: payload
    });
};

const deleteProperty = async (propertyId: string, landlordId: string) => {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.landlordId !== landlordId) {
        throw new Error("Property not found or unauthorized!");
    }

    const rentalRequests = await prisma.rentalRequest.findMany({
        where: { propertyId: propertyId }
    });

    const requestIds = rentalRequests.map(req => req.id);

    if (requestIds.length > 0) {
        await prisma.payment.deleteMany({
            where: { rentalRequestId: { in: requestIds } }
        });

        await prisma.rentalRequest.deleteMany({
            where: { propertyId: propertyId }
        });
    }

    await prisma.tourRequest.deleteMany({
        where: { propertyId: propertyId }
    });

    return await prisma.property.delete({ 
        where: { id: propertyId } 
    });
};

export const LandlordService = {
    getRequestsForLandlord,
    getTourRequestsForLandlord,
    updateRentalRequestStatus,
    updateTourRequestStatus,
    updateProperty,
    deleteProperty
};