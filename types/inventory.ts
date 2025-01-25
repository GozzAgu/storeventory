export type InventoryData = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  color: string;
  size: string;
  grade?: string;
  swapIn?: string;
  serialNumber?: string;
  modeOfPayment: string;
  supplier: string;
  dateIn: Date;
  dateOut?: Date;
};