import { Request, Response } from 'express';
import { LandlordService } from './landlord.service';

const getLandlordRequests = async (req: Request, res: Response) => {
    try {
        const landlordId = (req as any).user.id;
        const result = await LandlordService.getRequestsForLandlord(landlordId);
        res.status(200).json({ success: true, message: "Rental requests retrieved successfully", data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const landlordId = (req as any).user.id;
        const requestId = req.params.id as string;
        const result = await LandlordService.updateRentalRequestStatus(requestId, landlordId, req.body.status);
        res.status(200).json({ success: true, message: "Status updated successfully", data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateProperty = async (req: Request, res: Response) => {
    try {
        const landlordId = (req as any).user.id;
        const propertyId = req.params.id as string;
        const result = await LandlordService.updateProperty(propertyId, landlordId, req.body);
        res.status(200).json({ success: true, message: "Property updated successfully", data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteProperty = async (req: Request, res: Response) => {
    try {
        const landlordId = (req as any).user.id;
        const propertyId = req.params.id as string;
        await LandlordService.deleteProperty(propertyId, landlordId);
        res.status(200).json({ success: true, message: "Property deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const LandlordController = {
    getLandlordRequests,
    updateRequestStatus,
    updateProperty,
    deleteProperty
};