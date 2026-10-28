import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config';
export const adminDemoUser = { id:'demo-admin', name:'Demo Administrator', email:'admin.demo@rentnest.example', role:'ADMIN', status:'ACTIVE', createdAt:'2026-10-01T00:00:00.000Z', profile:null };
export const adminDemoPassword = 'RentNestAdminDemo2026!';
const users = [adminDemoUser, {id:'sample-tenant',name:'Sample Tenant',email:'tenant@example.com',role:'TENANT',status:'ACTIVE',createdAt:'2026-10-02T00:00:00.000Z'}, {id:'sample-landlord',name:'Sample Landlord',email:'landlord@example.com',role:'LANDLORD',status:'ACTIVE',createdAt:'2026-10-03T00:00:00.000Z'}];
const properties = [{id:'sample-home',title:'Demo Garden Apartment',location:'Sample neighborhood, Dhaka',price:650,bedrooms:2,bathrooms:2,area:1200,propertyType:'Apartment',status:'AVAILABLE',description:'Illustrative listing for the admin demo.',image:null,images:[],landlord:users[2],createdAt:'2026-10-03T00:00:00.000Z'}];
const rentals = ['PENDING','APPROVED','ACTIVE'].map((status,index)=>({id:'sample-request-'+index,status,tenant:users[1],property:properties[0],createdAt:'2026-10-0'+(index+4)+'T00:00:00.000Z'}));
// Signed demo identities never fall through to production controllers.
export function adminDemo(req: Request,res: Response,next: NextFunction) {
 const token=req.headers.authorization?.replace(/^Bearer /,'');
 if(!token) return next();
 let identity: any;
 try { identity=jwt.verify(token,config.jwt.access_secret as Secret); } catch { return next(); }
 if(identity.email!==adminDemoUser.email && identity.id!==adminDemoUser.id) return next();
 if(!['GET','HEAD','OPTIONS'].includes(req.method)) return res.status(403).json({success:false,message:'Admin demo is read-only. Production data cannot be changed.'});
 const path=req.path.replace(/\/$/,'');
 const responses: Record<string,unknown> = {
 '/admin/users':users,'/properties':properties,'/admin/properties':properties,'/rentals/all':rentals,'/admin/rentals':rentals,
 '/contact':[{id:'sample-message',name:'Sample Visitor',email:'visitor@example.com',message:'This is a sample support message for the demo workspace.',isRead:false,createdAt:'2026-10-05T00:00:00.000Z'}],
 '/users/demo-admin':adminDemoUser,'/saved-searches':[], '/categories':[],
 '/properties/sample-home':properties[0],'/reviews/sample-home':[]
 };
 if(Object.prototype.hasOwnProperty.call(responses,path)) return res.json({success:true,message:'Read-only sample data',data:responses[path]});
 return res.status(403).json({success:false,message:'This endpoint is unavailable in the isolated admin demo.'});
}
