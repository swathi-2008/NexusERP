export type UserRole =
  | 'admin'
  | 'manager'
  | 'sales'
  | 'purchase'
  | 'ADMIN'
  | 'MANAGER'
  | 'SALES'
  | 'PURCHASE';

export interface User {
  id: string; // e.g. ADM001, MGR001, SAL001, PUR001
  userId?: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status?: 'active' | 'inactive';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  maxStock: number;
  unitPrice: number; // Selling price
  costPrice: number; // Purchase cost
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  incomingStock: number;
  outgoingStock: number;
  unit: string; // e.g., Units, Pcs, Boxes
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  ordersCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  leadTimeDays: number;
  rating: number;
  category?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export type SalesOrderStatus = 
  | 'PENDING_STOCK'  // Stock was insufficient, waiting for PR/PO flow
  | 'PROCESSING'     // In progress
  | 'COMPLETED'      // Fulfilled & stock deducted
  | 'CANCELLED';

export interface SalesOrder {
  id: string;
  orderNumber: string; // e.g. SO-2026-001
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: SalesOrderStatus;
  purchaseRequestId?: string; // Linked PR if triggered
  createdAt: string;
  createdBy: string; // User ID
  createdByName: string;
  completedAt?: string;
  notes?: string;
}

export type PurchaseRequestStatus = 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED';

export interface PurchaseRequest {
  id: string;
  prNumber: string; // e.g. PR-2026-001
  salesOrderId?: string; // If auto-triggered by sales order
  salesOrderNumber?: string;
  productId: string;
  productName: string;
  productSku: string;
  requestedQuantity: number;
  currentStockAtRequest: number;
  minThreshold: number;
  estimatedCost: number;
  suggestedSupplierId: string;
  suggestedSupplierName: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  status: PurchaseRequestStatus;
  managerComment?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  reason: string;
}

export type PurchaseOrderStatus = 
  | 'REQUESTED'
  | 'APPROVED'
  | 'ORDERED'
  | 'RECEIVED';

export interface POTimelineEntry {
  status: PurchaseOrderStatus;
  timestamp: string;
  updatedBy: string;
  updatedByName: string;
  note?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string; // e.g. PO-2026-001
  purchaseRequestId?: string;
  purchaseRequestNumber?: string;
  salesOrderIdToFulfill?: string; // If fulfilling a specific sales order
  productId: string;
  productName: string;
  productSku: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: PurchaseOrderStatus;
  timeline: POTimelineEntry[];
  expectedDeliveryDate: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  receivedAt?: string;
  receivedBy?: string;
  receivedByName?: string;
  notes?: string;
}

export type StockTransactionType = 
  | 'SALES_OUT' 
  | 'PURCHASE_IN' 
  | 'ADJUSTMENT' 
  | 'INITIAL';

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  type: StockTransactionType;
  quantity: number; // positive or negative
  previousStock: number;
  newStock: number;
  referenceType: 'SALES_ORDER' | 'PURCHASE_ORDER' | 'MANUAL';
  referenceId: string;
  referenceNumber: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  notes: string;
}

export interface MonthlyBusinessMetric {
  monthIndex: number; // 0 to 11 (Jan = 0)
  monthName: string;
  year: number;
  stockPurchased: number; // total $ cost of stock purchases received
  sales: number;          // total $ revenue of sales completed
  profit: number;         // positive profit
  loss: number;           // loss if sales < stockPurchased or overhead
  unitsPurchased: number;
  unitsSold: number;
  transactionCount: number;
}

export interface NotificationItem {
  id: string;
  targetRoles: UserRole[]; // Which roles should see this
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  relatedModule: 'SALES' | 'PURCHASE' | 'MANAGER' | 'ADMIN' | 'INVENTORY';
  relatedEntityId?: string;
  linkTo?: string;
  createdAt: string;
  readBy: string[]; // List of user IDs who have read it
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  entityId?: string;
}
