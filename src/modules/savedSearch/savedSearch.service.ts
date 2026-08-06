import { prisma } from '../../lib/prisma';
import { Role } from '@prisma/client';

const createSavedSearchIntoDB = async (payload: any) => {
  const existingSearch = await prisma.savedSearch.findFirst({
    where: {
      userId: payload.userId,
      searchTerm: payload.searchTerm === "" ? undefined : payload.searchTerm,
      selectedLocation: payload.selectedLocation === "" ? undefined : payload.selectedLocation,
      searchMode: payload.searchMode === "" ? undefined : payload.searchMode,
      selectedCategory: payload.selectedCategory === "" ? undefined : payload.selectedCategory,
      propertyType: payload.propertyType === "" ? undefined : payload.propertyType,
      minPrice: payload.minPrice === "" ? undefined : payload.minPrice,
      maxPrice: payload.maxPrice === "" ? undefined : payload.maxPrice,
      beds: payload.beds === "" ? undefined : payload.beds,
      baths: payload.baths === "" ? undefined : payload.baths
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