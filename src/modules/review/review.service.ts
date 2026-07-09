import { prisma } from '../../lib/prisma';

const createReview = async (tenantId: string, payload: any) => {
  const result = await prisma.review.create({
    data: {
      content: payload.content,
      rating: payload.rating,
      tenant: { connect: { id: tenantId } },
      property: { connect: { id: payload.propertyId } },
    },
    include: { tenant: true, property: true }
  });
  return result;
};

const getReviewsByProperty = async (propertyId: string) => {
  const result = await prisma.review.findMany({
    where: { propertyId },
    include: { tenant: { select: { id: true, name: true } } }   
  });
  return result;
};

export const ReviewService = { createReview, getReviewsByProperty };
