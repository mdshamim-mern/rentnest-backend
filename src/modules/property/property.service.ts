import { prisma } from '../../lib/prisma';

// নতুন প্রপার্টি তৈরি করার ফাংশন
const createProperty = async (landlordId: string, payload: any) => {
  const result = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      price: payload.price,
      // ক্যাটাগরি আইডি দিয়ে ক্যাটাগরি মডেলের সাথে রিলেশন তৈরি করছি
      category: {
        connect: {
          id: payload.categoryId
        }
      },
      // যে ল্যান্ডলর্ড রিকোয়েস্ট পাঠাচ্ছে, তার আইডির সাথে প্রপার্টি কানেক্ট করছি
      landlord: {
        connect: {
          id: landlordId
        }
      }
    },
    // রেসপন্সের সাথে ক্যাটাগরি এবং ল্যান্ডলর্ডের পুরা ডেটাও দেখতে চাচ্ছি
    include: {
      category: true,
      landlord: true
    }
  });
  return result;
};

// সব প্রপার্টি দেখার ফাংশন
const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      category: true,
      landlord: true
    }
  });
  return result;
};

// নির্দিষ্ট একটি প্রপার্টি আইডি দিয়ে দেখার ফাংশন
const getPropertyById = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: true,
      reviews: true // প্রপার্টির রিভিউগুলোও সাথে নিয়ে আসছি
    }
  });
  return result;
};

// প্রপার্টির ডেটা আপডেট করার ফাংশন
const updateProperty = async (id: string, payload: any) => {
  const result = await prisma.property.update({
    where: { id },
    data: payload,
  });
  return result;
};

// প্রপার্টি ডিলিট করার ফাংশন
const deleteProperty = async (id: string) => {
  const result = await prisma.property.delete({
    where: { id }
  });
  return result;
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};