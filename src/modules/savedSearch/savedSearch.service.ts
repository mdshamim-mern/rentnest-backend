import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

const createSavedSearchIntoDB = async (payload: any) => {
  const cleanPayload = { ...payload };
  Object.keys(cleanPayload).forEach((key) => {
    if (cleanPayload[key] === "" || cleanPayload[key] === "all") {
      delete cleanPayload[key];
    }
  });

  const existingSearch = await prisma.savedSearch.findFirst({
    where: {
      userId: cleanPayload.userId,
      searchTerm: cleanPayload.searchTerm,
      selectedLocation: cleanPayload.selectedLocation,
      searchMode: cleanPayload.searchMode,
      selectedCategory: cleanPayload.selectedCategory,
      propertyType: cleanPayload.propertyType,
      minPrice: cleanPayload.minPrice,
      maxPrice: cleanPayload.maxPrice,
      beds: cleanPayload.beds,
      baths: cleanPayload.baths
    }
  });

  if (existingSearch) {
    throw new Error('This exact search is already saved.');
  }

  const result = await prisma.savedSearch.create({
    data: cleanPayload,
  });
  return result;
};

const getAllSavedSearchesFromDB = async (userId: string, role: string) => {
  const whereCondition: any = {};
  
  if (role !== Role.ADMIN) {
    whereCondition.userId = String(userId);
  }

  const result = await prisma.savedSearch.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  return result;
};

const deleteSavedSearchFromDB = async (id: string) => {
  const result = await prisma.savedSearch.delete({
    where: { id: String(id) },
  });
  return result;
};

export const SavedSearchService = {
  createSavedSearchIntoDB,
  getAllSavedSearchesFromDB,
  deleteSavedSearchFromDB,
};