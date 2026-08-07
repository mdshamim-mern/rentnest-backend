import { prisma } from '../../lib/prisma';

const createProperty = async (landlordId: string, payload: any) => {
  const { categoryId, ...propertyData } = payload;

  const result = await prisma.property.create({
    data: {
      ...propertyData,
      landlord: {
        connect: { id: landlordId }
      },
      category: {
        connect: { id: categoryId }
      }
    },
    include: {
      category: true,
      landlord: {
        include: {
          profile: true
        }
      }
    }
  });
  return result;
};

const getAllProperties = async (filters: any) => {
  const { location, searchTerm, searchMode, minPrice, maxPrice, categoryId, propertyType, minArea, maxArea, beds, baths, amenities, rentFor, furnished, landlordId } = filters;
  const whereConditions: any = {};

  if (landlordId) {
    whereConditions.landlordId = landlordId;
  }

  if (location && location !== "all") {
    whereConditions.location = { contains: location, mode: 'insensitive' };
  }

  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { location: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }
  
  if (minPrice || maxPrice) {
    whereConditions.price = {};
    if (minPrice) whereConditions.price.gte = Number(minPrice);
    if (maxPrice) whereConditions.price.lte = Number(maxPrice);
  }

  if (minArea || maxArea) {
    whereConditions.floorArea = {};
    if (minArea) whereConditions.floorArea.gte = Number(minArea);
    if (maxArea) whereConditions.floorArea.lte = Number(maxArea);
  }

  if (categoryId && categoryId !== 'all') {
    whereConditions.categoryId = categoryId;
  }
  
  if (propertyType && propertyType !== 'all') {
    whereConditions.propertyType = propertyType;
  }

  if (beds && beds !== 'all') {
    if (beds === 'studio') {
      whereConditions.bedrooms = 0;
    } else if (beds.includes('+')) {
      whereConditions.bedrooms = { gte: Number(beds.replace('+', '')) };
    } else {
      whereConditions.bedrooms = Number(beds);
    }
  }

  if (baths && baths !== 'all') {
    if (baths.includes('+')) {
      whereConditions.bathrooms = { gte: Number(baths.replace('+', '')) };
    } else {
      whereConditions.bathrooms = Number(baths);
    }
  }

  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
    if (amenitiesArray.length > 0) {
      whereConditions.amenities = { hasSome: amenitiesArray };
    }
  }
  
  if (rentFor && rentFor !== 'all') {
    whereConditions.rentFor = { has: rentFor };
  }

  if (furnished && furnished !== 'all') {
    whereConditions.furnished = furnished;
  }

  const result = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: {
        include: {
          profile: true
        }
      }
    }
  });
  return result;
};

const getPropertyById = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        include: {
          profile: true
        }
      },
      reviews: true 
    }
  });
  return result;
};

const updateProperty = async (id: string, payload: any) => {
  const { categoryId, ...propertyData } = payload;
  
  const updateData: any = { ...propertyData };
  
  if (categoryId) {
    updateData.category = {
      connect: { id: categoryId }
    };
  }

  const result = await prisma.property.update({
    where: { id },
    data: updateData,
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