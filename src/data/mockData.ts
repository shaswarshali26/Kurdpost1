import type { Shipment, User, Branch, SupportTicket } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1', role: 'citizen', firstName: 'Ahmad', lastName: 'Hassan',
    email: 'ahmad@example.com', phone: '+964 750 123 4567',
    nationalId: 'IQ-001-234567', city: 'Sulaymaniyah', address: '45 Salim St, Ankawa',
    isVerified: true, isActive: true, createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'u2', role: 'business', firstName: 'Soran', lastName: 'Karim',
    email: 'soran@kurdshop.com', phone: '+964 770 234 5678',
    city: 'Sulaymaniyah', companyName: 'KurdShop LLC', companyRegNo: 'KS-2023-0042',
    isVerified: true, isActive: true, createdAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'u3', role: 'government', firstName: 'Dilan', lastName: 'Mustafa',
    email: 'dilan@gov.krd', phone: '+964 780 345 6789',
    city: 'Duhok', department: 'Ministry of Interior',
    isVerified: true, isActive: true, createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'u4', role: 'admin', firstName: 'Rzgar', lastName: 'Ali',
    email: 'admin@kurdpost.krd', phone: '+964 750 999 0000',
    city: 'Sulaymaniyah', isVerified: true, isActive: true, createdAt: '2023-12-01T08:00:00Z',
  },
  {
    id: 'u5', role: 'citizen', firstName: 'Shirin', lastName: 'Omar',
    email: 'shirin@example.com', phone: '+964 770 456 7890',
    city: 'Halabja', isVerified: false, isActive: true, createdAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'u6', role: 'business', firstName: 'Karwan', lastName: 'Jalal',
    email: 'karwan@techkrd.com', phone: '+964 750 567 8901',
    city: 'Sulaymaniyah', companyName: 'TechKRD Solutions', companyRegNo: 'TK-2022-0118',
    isVerified: true, isActive: true, createdAt: '2023-11-05T07:00:00Z',
  },
];

const makeHistory = (
  statuses: Array<{ s: Shipment['status']; loc: string; note?: string }>,
  baseDate: string,
): Shipment['statusHistory'] =>
  statuses.map((item, i) => ({
    status: item.s,
    timestamp: new Date(new Date(baseDate).getTime() + i * 3_600_000).toISOString(),
    location: item.loc,
    note: item.note,
    operator: 'KurdPost Staff',
  }));

export const mockShipments: Shipment[] = [
  {
    id: 's1', trackingNumber: 'KP-2024-000001', type: 'standard', scope: 'national',
    status: 'delivered', userId: 'u1',
    sender: { name: 'Ahmad Hassan', phone: '+964 750 123 4567', city: 'Sulaymaniyah', country: 'Iraq' },
    receiver: { name: 'Sara Mohammed', phone: '+964 770 987 6543', city: 'Sulaymaniyah', country: 'Iraq' },
    weight: 2.5, description: 'Books and stationery', isOfficial: false, requiresVerification: false,
    branchId: 'b1', createdAt: '2024-04-01T08:00:00Z', updatedAt: '2024-04-03T14:00:00Z',
    estimatedDelivery: '2024-04-03', actualDelivery: '2024-04-03T14:00:00Z',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Sulaymaniyah Central Branch' },
      { s: 'in_transit', loc: 'Sulaymaniyah Sorting Facility' },
      { s: 'in_transit', loc: 'Koya Distribution Center' },
      { s: 'out_for_delivery', loc: 'Sulaymaniyah Branch' },
      { s: 'delivered', loc: 'Sulaymaniyah - Destination', note: 'Delivered to recipient' },
    ], '2024-04-01T08:00:00Z'),
    value: 45, insurance: false,
  },
  {
    id: 's2', trackingNumber: 'KP-2024-000002', type: 'express', scope: 'local',
    status: 'out_for_delivery', userId: 'u1',
    sender: { name: 'Ahmad Hassan', phone: '+964 750 123 4567', city: 'Sulaymaniyah', country: 'Iraq' },
    receiver: { name: 'Karwan Barzani', phone: '+964 750 111 2222', city: 'Sulaymaniyah', country: 'Iraq' },
    weight: 0.8, description: 'Electronic accessories', isOfficial: false, requiresVerification: false,
    branchId: 'b1', createdAt: '2024-04-20T09:00:00Z', updatedAt: '2024-04-20T15:00:00Z',
    estimatedDelivery: '2024-04-20',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Sulaymaniyah Central Branch' },
      { s: 'in_transit', loc: 'Sulaymaniyah Sorting Facility' },
      { s: 'out_for_delivery', loc: 'Sulaymaniyah North District' },
    ], '2024-04-20T09:00:00Z'),
    value: 120, insurance: true,
  },
  {
    id: 's3', trackingNumber: 'KP-2024-000003', type: 'document', scope: 'national',
    status: 'in_transit', userId: 'u3',
    sender: { name: 'Ministry of Interior', phone: '+964 780 345 6789', city: 'Duhok', country: 'Iraq' },
    receiver: { name: 'Civil Registry Sulaymaniyah', phone: '+964 750 000 1111', city: 'Sulaymaniyah', country: 'Iraq' },
    weight: 0.3, description: 'Official civil documents — CONFIDENTIAL', isOfficial: true,
    requiresVerification: true, verificationCode: 'GOV-VER-2024-003',
    branchId: 'b3', createdAt: '2024-04-19T07:00:00Z', updatedAt: '2024-04-19T12:00:00Z',
    estimatedDelivery: '2024-04-21',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Duhok Government Branch', note: 'Official document accepted — verification complete' },
      { s: 'in_transit', loc: 'Duhok Sorting Facility' },
      { s: 'in_transit', loc: 'Zakho Transfer Point' },
    ], '2024-04-19T07:00:00Z'),
    value: 0, insurance: true,
  },
  {
    id: 's4', trackingNumber: 'KP-2024-000004', type: 'bulk', scope: 'national',
    status: 'delayed', userId: 'u2',
    sender: { name: 'KurdShop LLC', phone: '+964 770 234 5678', city: 'Sulaymaniyah', country: 'Iraq' },
    receiver: { name: 'RetailKRD Store', phone: '+964 750 333 4444', city: 'Sulaymaniyah', country: 'Iraq' },
    weight: 18.5, description: 'Bulk retail goods - 24 items', isOfficial: false, requiresVerification: false,
    branchId: 'b2', createdAt: '2024-04-18T06:00:00Z', updatedAt: '2024-04-20T08:00:00Z',
    estimatedDelivery: '2024-04-20',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Sulaymaniyah Business Hub' },
      { s: 'in_transit', loc: 'Sulaymaniyah Sorting Facility' },
      { s: 'delayed', loc: 'Koya Transfer Point', note: 'Delayed due to road works on Sulaymaniyah-Koya highway' },
    ], '2024-04-18T06:00:00Z'),
    value: 850, insurance: true,
  },
  {
    id: 's5', trackingNumber: 'KP-2024-000005', type: 'fragile', scope: 'international',
    status: 'in_transit', userId: 'u2',
    sender: { name: 'KurdShop LLC', phone: '+964 770 234 5678', city: 'Sulaymaniyah', country: 'Iraq' },
    receiver: { name: 'Nawroz Import Co.', phone: '+90 312 555 1234', city: 'Ankara', country: 'Turkey' },
    weight: 4.2, description: 'Handmade ceramics — FRAGILE', isOfficial: false, requiresVerification: false,
    branchId: 'b2', createdAt: '2024-04-15T10:00:00Z', updatedAt: '2024-04-18T14:00:00Z',
    estimatedDelivery: '2024-04-25',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Sulaymaniyah Business Hub' },
      { s: 'in_transit', loc: 'Sulaymaniyah Sorting Facility' },
      { s: 'in_transit', loc: 'Ibrahim Khalil Border Crossing' },
      { s: 'in_transit', loc: 'Turkish Customs — Habur' },
    ], '2024-04-15T10:00:00Z'),
    value: 320, insurance: true,
  },
  {
    id: 's6', trackingNumber: 'KP-2024-000006', type: 'standard', scope: 'local',
    status: 'returned', userId: 'u5',
    sender: { name: 'Shirin Omar', phone: '+964 770 456 7890', city: 'Halabja', country: 'Iraq' },
    receiver: { name: 'Narin Ahmed', phone: '+964 770 777 8888', city: 'Halabja', country: 'Iraq' },
    weight: 1.2, description: 'Clothing items', isOfficial: false, requiresVerification: false,
    branchId: 'b4', createdAt: '2024-04-10T09:00:00Z', updatedAt: '2024-04-12T11:00:00Z',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Halabja Branch' },
      { s: 'in_transit', loc: 'Halabja Local Dispatch' },
      { s: 'out_for_delivery', loc: 'Halabja — Destination Area' },
      { s: 'returned', loc: 'Halabja Branch', note: 'Recipient unavailable after 3 delivery attempts' },
    ], '2024-04-10T09:00:00Z'),
    value: 65, insurance: false,
  },
  {
    id: 's7', trackingNumber: 'KP-2024-000007', type: 'express', scope: 'national',
    status: 'accepted', userId: 'u6',
    sender: { name: 'TechKRD Solutions', phone: '+964 750 567 8901', city: 'Sulaymaniyah', country: 'Iraq' },
    receiver: { name: 'MedTech Duhok', phone: '+964 780 222 3333', city: 'Duhok', country: 'Iraq' },
    weight: 3.0, description: 'IT equipment', isOfficial: false, requiresVerification: false,
    branchId: 'b1', createdAt: '2024-04-21T07:30:00Z', updatedAt: '2024-04-21T07:30:00Z',
    estimatedDelivery: '2024-04-22',
    statusHistory: makeHistory([
      { s: 'accepted', loc: 'Sulaymaniyah Central Branch', note: 'Shipment accepted and ready for dispatch' },
    ], '2024-04-21T07:30:00Z'),
    value: 1200, insurance: true,
  },
];

export const mockBranches: Branch[] = [
  {
    id: 'b1', name: 'Sulaymaniyah Central Branch', nameKu: 'لقی ناوەندی هەولێر', nameAr: 'فرع أربيل المركزي',
    city: 'Sulaymaniyah', district: 'Ankawa', address: '12 Kurdistan Street, Ankawa, Sulaymaniyah',
    phone: '+964 66 123 4567', email: 'sulay.central@kurdpost.krd', manager: 'Rezan Aziz',
    isActive: true, workingHours: 'Sun–Thu 08:00–17:00', lat: 36.1901, lng: 44.0091,
    services: ['Standard', 'Express', 'Document', 'International', 'Fragile'],
  },
  {
    id: 'b2', name: 'Sulaymaniyah Business Hub', nameKu: 'نووسینگەی بازرگانی سلێمانی', nameAr: 'مركز أعمال السليمانية',
    city: 'Sulaymaniyah', district: 'Salim Street', address: '8 Salim Street, Sulaymaniyah',
    phone: '+964 53 234 5678', email: 'sulay.hub@kurdpost.krd', manager: 'Dashni Karim',
    isActive: true, workingHours: 'Sun–Thu 08:00–17:00', lat: 35.5600, lng: 45.4350,
    services: ['Standard', 'Express', 'Bulk', 'Document', 'International'],
  },
  {
    id: 'b3', name: 'Duhok Government Branch', nameKu: 'لقی حکومەتی دهۆک', nameAr: 'فرع دهوك الحكومي',
    city: 'Duhok', district: 'City Center', address: '3 Martyrs Square, Duhok',
    phone: '+964 62 345 6789', email: 'duhok.gov@kurdpost.krd', manager: 'Faris Barwari',
    isActive: true, workingHours: 'Sun–Thu 08:00–15:00', lat: 36.8670, lng: 42.9470,
    services: ['Standard', 'Document', 'Government'],
  },
  {
    id: 'b4', name: 'Halabja Branch', nameKu: 'لقی هەڵەبجە', nameAr: 'فرع حلبجة',
    city: 'Halabja', district: 'Main Street', address: '5 Anfal Memorial Ave, Halabja',
    phone: '+964 53 456 7890', email: 'halabja@kurdpost.krd', manager: 'Kawa Rashid',
    isActive: true, workingHours: 'Sun–Thu 08:00–16:00', lat: 35.1783, lng: 45.9862,
    services: ['Standard', 'Express', 'Document'],
  },
  {
    id: 'b5', name: 'Zakho Transit Hub', nameKu: 'ناوەندی گواستنەوەی زاخو', nameAr: 'مركز عبور زاخو',
    city: 'Zakho', district: 'Border Zone', address: 'Ibrahim Khalil Road, Zakho',
    phone: '+964 62 567 8901', email: 'zakho@kurdpost.krd', manager: 'Siamand Agha',
    isActive: true, workingHours: 'Daily 06:00–22:00', lat: 37.1441, lng: 42.6836,
    services: ['Standard', 'Express', 'International', 'Customs Clearance'],
  },
  {
    id: 'b6', name: 'Koya Distribution Center', nameKu: 'ناوەندی دابەشکردنی کۆیە', nameAr: 'مركز توزيع كويه',
    city: 'Koya', district: 'Industrial Zone', address: 'Sulaymaniyah–Koya Highway, Koya',
    phone: '+964 66 678 9012', email: 'koya.dc@kurdpost.krd', manager: 'Omed Hama',
    isActive: false, workingHours: 'Sun–Thu 07:00–18:00', lat: 36.0857, lng: 44.6214,
    services: ['Standard', 'Bulk'],
  },
];

export const mockTickets: SupportTicket[] = [
  {
    id: 't1', userId: 'u1', userName: 'Ahmad Hassan',
    subject: 'Shipment KP-2024-000002 delayed',
    message: 'My express shipment has been "out for delivery" for 6 hours. Please investigate.',
    status: 'open', priority: 'high', trackingNumber: 'KP-2024-000002',
    createdAt: '2024-04-20T16:00:00Z', updatedAt: '2024-04-20T16:00:00Z',
  },
  {
    id: 't2', userId: 'u2', userName: 'Soran Karim',
    subject: 'Bulk shipment damage report',
    message: 'Items from shipment KP-2024-000004 arrived damaged. Requesting insurance claim.',
    status: 'in_progress', priority: 'high', trackingNumber: 'KP-2024-000004',
    createdAt: '2024-04-19T10:00:00Z', updatedAt: '2024-04-20T09:00:00Z',
  },
  {
    id: 't3', userId: 'u5', userName: 'Shirin Omar',
    subject: 'Returned shipment — pickup request',
    message: 'My shipment KP-2024-000006 was returned. I need to reschedule delivery.',
    status: 'resolved', priority: 'medium', trackingNumber: 'KP-2024-000006',
    createdAt: '2024-04-12T12:00:00Z', updatedAt: '2024-04-13T08:00:00Z',
  },
  {
    id: 't4', userId: 'u6', userName: 'Karwan Jalal',
    subject: 'API documentation request',
    message: 'We need access to the Kurd Post API for integration with our logistics software.',
    status: 'open', priority: 'low',
    createdAt: '2024-04-21T07:00:00Z', updatedAt: '2024-04-21T07:00:00Z',
  },
];

export const mockDashboardStats = {
  totalShipments: 3847,
  delivered: 3201,
  inTransit: 412,
  delayed: 89,
  returned: 145,
  totalUsers: 12483,
  totalBranches: 6,
  revenueThisMonth: 84_500,
  shipmentsToday: 127,
  avgDeliveryDays: 1.8,
};

export const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  accepted: 'Accepted',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  delayed: 'Delayed',
  returned: 'Returned',
};

export const SERVICES = [
  { id: 'standard', label: 'Standard Delivery', price: 3500, days: '2–4', icon: '📦' },
  { id: 'express', label: 'Express Delivery', price: 7000, days: '1', icon: '⚡' },
  { id: 'document', label: 'Document Service', price: 2500, days: '1–3', icon: '📄' },
  { id: 'fragile', label: 'Fragile Handling', price: 9000, days: '2–5', icon: '🔮' },
  { id: 'bulk', label: 'Bulk / Business', price: 12000, days: '3–6', icon: '🏭' },
  { id: 'international', label: 'International', price: 25000, days: '5–14', icon: '✈️' },
];
