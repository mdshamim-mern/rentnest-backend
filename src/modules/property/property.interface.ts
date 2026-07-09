export interface IPropertyCreatePayload {
  title: string;
  description: string;
  location: string;
  price: number;
  categoryId: string;
}

export interface IPropertyUpdatePayload {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  categoryId?: string;
}
