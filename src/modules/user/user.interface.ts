// ডাটাবেসে ইউজার সেভ করার টাইপ
export interface IUser {
  name: string;
  email: string;
  password?: string; // পাসওয়ার্ড রেসপন্সে পাঠাবো না, তাই অপশনাল
  role: 'ADMIN' | 'LANDLORD' | 'TENANT';
}

// লগইন করার সময় যে বডি পাঠাবে তার টাইপ
export interface ILoginPayload {
  email: string;
  password: string;
}

// সাইনআপ করার সময় যে বডি পাঠাবে তার টাইপ
export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'LANDLORD' | 'TENANT';
}