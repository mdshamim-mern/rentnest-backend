import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

const createSavedSearchIntoDB = async (payload: any) => {
  const existingSearch = await prisma.savedSearch.findFirst({
    where: {
      userId: payload.userId,
      searchTerm: payload.searchTerm,
      selectedLocation: payload.selectedLocation,
      searchMode: payload.searchMode,
      selectedCategory: payload.selectedCategory,
      propertyType: payload.propertyType,
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
      beds: payload.beds,
      baths: payload.baths
    }
  });

  if (existingSearch) {
    throw new Error('This exact search is already saved.');
  }

  const result = await prisma.savedSearch.create({
    data: payload,
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