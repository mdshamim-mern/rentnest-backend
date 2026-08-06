import { prisma } from '../../lib/prisma';

const createSavedSearchIntoDB = async (payload: any) => {
  const result = await prisma.savedSearch.create({
    data: payload,
  });
  return result;
};

const getAllSavedSearchesFromDB = async (userId: string) => {
  const whereCondition: any = {};
  if (userId) {
    whereCondition.userId = String(userId);
  }

  const result = await prisma.savedSearch.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
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