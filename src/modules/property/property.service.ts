import { prisma } from '../../lib/prisma';

const createProperty = async (landlordId: string, payload: any) => {
  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      price: payload.price,
      category: {
        connect: { id: payload.categoryId }
      },
      landlord: {
        connect: { id: landlordId }
      }
    },
    include: {
      category: true,
      landlord: true
    }
  });
  return result;
};

const getAllProperties = async (filters: any) => {
  const { location, minPrice, maxPrice, categoryId } = filters;
  const whereConditions: any = {};

  if (location) {
    whereConditions.location = { contains: location, mode: 'insensitive' };
  }
  if (minPrice || maxPrice) {
    whereConditions.price = {};
    if (minPrice) whereConditions.price.gte = Number(minPrice);
    if (maxPrice) whereConditions.price.lte = Number(maxPrice);
  }
  if (categoryId) {
    whereConditions.categoryId = categoryId;
  }

  const result = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: true
    }
  });
  return result;
};

const getPropertyById = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: true,
      reviews: true 
    }
  });
  return result;
};

const updateProperty = async (id: string, payload: any) => {
  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteProperty = async (id: string) => {
  try {
    const rentalRequests = await prisma.rentalRequest.findMany({
      where: { propertyId: id }
    });
    
    const requestIds = rentalRequests.map(req => req.id);

    if (requestIds.length > 0) {
      await prisma.payment.deleteMany({
        where: { rentalRequestId: { in: requestIds } }
      });
    }

    await prisma.review.deleteMany({ where: { propertyId: id } });
    await prisma.tourRequest.deleteMany({ where: { propertyId: id } });
    await prisma.rentalRequest.deleteMany({ where: { propertyId: id } });

    const result = await prisma.property.delete({
      where: { id }
    });
    
    return result;
  } catch (error) {
    console.error("\n\n=== DELETE ERROR ===");
    console.error(error);
    console.error("====================\n\n");
    throw error;
  }
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};