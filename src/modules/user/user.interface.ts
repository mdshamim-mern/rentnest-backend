export interface IUser {
  name: string;
  email: string;
  password?: string; 
  role: 'ADMIN' | 'LANDLORD' | 'TENANT';
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'LANDLORD' | 'TENANT';
}
