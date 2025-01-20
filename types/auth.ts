export enum AccountType {
  superAdmin = 'SuperAdmin',
  admin = 'Admin',
  user = 'User',
  restricted = 'Restricted'
}
export interface StaffData {
  id: string;
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  accountType?: AccountType.user | AccountType.admin;
  adminName?: string;
  adminId: string;
  imageUrl?: string;
}