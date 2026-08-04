import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createMessage = async (payload: { name: string, email: string, message: string }) => {
    return await prisma.contactMessage.create({
        data: payload
    });
};

const getAllMessages = async () => {
    return await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

const updateMessageStatus = async (id: string, isRead: boolean) => {
    return await prisma.contactMessage.update({
        where: { id },
        data: { isRead }
    });
};

const deleteMessage = async (id: string) => {
    return await prisma.contactMessage.delete({
        where: { id }
    });
};

export const ContactService = {
    createMessage,
    getAllMessages,
    updateMessageStatus,
    deleteMessage
}