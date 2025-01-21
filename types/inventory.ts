
export type InventoryData = {
  id: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  price: number;
  modeOfPayment: string;
  supplier?: string;
  dateAdded: Date;
  dateUpdated?: Date;
  imageUrl?: string;
};
