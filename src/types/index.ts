export type ShipmentStatus =
  | 'accepted'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed'
  | 'returned';

export type ShipmentType = 'standard' | 'express' | 'document' | 'fragile' | 'bulk';
export type DeliveryScope = 'local' | 'national' | 'international';
export type UserRole = 'citizen' | 'business' | 'government' | 'admin';

export interface StatusEvent {
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  note?: string;
  operator?: string;
}

export interface Address {
  name: string;
  phone: string;
  city: string;
  district?: string;
  street?: string;
  postalCode?: string;
  country: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  type: ShipmentType;
  scope: DeliveryScope;
  status: ShipmentStatus;
  sender: Address;
  receiver: Address;
  weight: number;
  dimensions?: { length: number; width: number; height: number };
  description: string;
  isOfficial: boolean;
  requiresVerification: boolean;
  verificationCode?: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  statusHistory: StatusEvent[];
  notes?: string;
  value?: number;
  insurance?: boolean;
  userId: string;
}

export interface User {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId?: string;
  city: string;
  address?: string;
  companyName?: string;
  companyRegNo?: string;
  department?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface Branch {
  id: string;
  name: string;
  nameKu?: string;
  nameAr?: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  isActive: boolean;
  workingHours: string;
  lat: number;
  lng: number;
  services: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Invoice {
  id: string;
  shipmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  issuedAt: string;
  dueAt: string;
  items: { label: string; amount: number }[];
}

export interface DashboardStats {
  totalShipments: number;
  delivered: number;
  inTransit: number;
  delayed: number;
  totalUsers: number;
  totalBranches: number;
  revenueThisMonth: number;
}
