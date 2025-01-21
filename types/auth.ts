export enum AccountType {
  superAdmin = 'SuperAdmin',
  admin = 'Admin',
  user = 'User',
  restricted = 'Restricted'
}

export type StaffData = {
  id: string;
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  accountType: AccountType;
  adminId: string;
  adminName?: string;
  imageUrl?: string;
};