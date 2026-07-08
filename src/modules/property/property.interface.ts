// প্রপার্টি তৈরি করার সময় ক্লায়েন্ট কী কী ডেটা পাঠাবে তার টাইপ
export interface IPropertyCreatePayload {
  title: string;
  description: string;
  location: string;
  price: number;
  categoryId: string;
}

// প্রপার্টি আপডেট করার সময় ক্লায়েন্ট কী কী ডেটা পাঠাতে পারে (সবগুলো অপশনাল)
export interface IPropertyUpdatePayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  categoryId?: string;
}