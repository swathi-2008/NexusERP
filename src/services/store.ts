import {
  User,
  UserRole,
  Product,
  Customer,
  Supplier,
  SalesOrder,
  PurchaseRequest,
  PurchaseOrder,
  StockTransaction,
  MonthlyBusinessMetric,
  NotificationItem,
  AuditLogItem,
} from '../types/erp';

export function normalizeRole(role: any): 'admin' | 'manager' | 'sales' | 'purchase' | null {
  if (!role || typeof role !== 'string') return null;
  const lower = role.trim().toLowerCase();
  if (lower === 'admin' || lower === 'manager' || lower === 'sales' || lower === 'purchase') {
    return lower as 'admin' | 'manager' | 'sales' | 'purchase';
  }
  return null;
}

export function getRoleDashboardPath(role: any): string | null {
  const norm = normalizeRole(role);
  if (!norm) return null;
  switch (norm) {
    case 'admin':
      return '/admin-dashboard';
    case 'manager':
      return '/manager-dashboard';
    case 'sales':
      return '/sales-dashboard';
    case 'purchase':
      return '/purchase-dashboard';
    default:
      return null;
  }
}

export function getRoleFromDashboardPath(path: string): 'admin' | 'manager' | 'sales' | 'purchase' | null {
  if (!path) return null;
  const cleanPath = path.split('?')[0].replace(/\/+$/, '');
  switch (cleanPath) {
    case '/admin-dashboard':
      return 'admin';
    case '/manager-dashboard':
      return 'manager';
    case '/sales-dashboard':
      return 'sales';
    case '/purchase-dashboard':
      return 'purchase';
    default:
      return null;
  }
}

export function isUserTargetForRoles(userRole: any, targetRoles: any[]): boolean {
  const normUserRole = normalizeRole(userRole);
  if (!normUserRole || !Array.isArray(targetRoles)) return false;
  return targetRoles.some((tr) => normalizeRole(tr) === normUserRole);
}

// Default Demo Credentials
export const INITIAL_USERS: User[] = [
  {
    id: 'ADM001',
    userId: 'ADM001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@enterprise-erp.com',
    role: 'admin',
    department: 'Executive Administration',
    status: 'active',
    isActive: true,
    createdAt: '2026-01-05T09:00:00Z',
    lastLogin: '2026-09-22T17:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'MGR001',
    userId: 'MGR001',
    name: 'David Ross',
    email: 'david.ross@enterprise-erp.com',
    role: 'manager',
    department: 'Operations & Approvals',
    status: 'active',
    isActive: true,
    createdAt: '2026-01-10T09:00:00Z',
    lastLogin: '2026-09-22T16:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'SAL001',
    userId: 'SAL001',
    name: 'Emily Watson',
    email: 'emily.watson@enterprise-erp.com',
    role: 'sales',
    department: 'Commercial Sales',
    status: 'active',
    isActive: true,
    createdAt: '2026-01-15T09:00:00Z',
    lastLogin: '2026-09-22T18:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'PUR001',
    userId: 'PUR001',
    name: 'Michael Chen',
    email: 'michael.chen@enterprise-erp.com',
    role: 'purchase',
    department: 'Procurement & Supply Chain',
    status: 'active',
    isActive: true,
    createdAt: '2026-01-20T09:00:00Z',
    lastLogin: '2026-09-22T17:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

// Initial Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    name: 'Enterprise Laptop Pro 15"',
    sku: 'LAP-PRO-15',
    category: 'Computers & Laptops',
    currentStock: 8, // Low stock, min threshold is 15
    minThreshold: 15,
    maxStock: 100,
    unitPrice: 1250,
    costPrice: 820,
    status: 'LOW_STOCK',
    incomingStock: 25,
    outgoingStock: 0,
    unit: 'Units',
  },
  {
    id: 'PROD-002',
    name: 'UltraSharp 27" 4K Monitor',
    sku: 'MON-4K-27',
    category: 'Displays & Monitors',
    currentStock: 4, // Low stock
    minThreshold: 12,
    maxStock: 80,
    unitPrice: 420,
    costPrice: 260,
    status: 'LOW_STOCK',
    incomingStock: 0,
    outgoingStock: 0,
    unit: 'Units',
  },
  {
    id: 'PROD-003',
    name: 'Ergonomic Executive Mesh Chair',
    sku: 'CHR-ERGO-01',
    category: 'Office Furniture',
    currentStock: 32,
    minThreshold: 10,
    maxStock: 60,
    unitPrice: 280,
    costPrice: 160,
    status: 'IN_STOCK',
    incomingStock: 0,
    outgoingStock: 0,
    unit: 'Units',
  },
  {
    id: 'PROD-004',
    name: 'Wireless Mechanical Keyboard',
    sku: 'KB-WL-87',
    category: 'Peripherals',
    currentStock: 48,
    minThreshold: 20,
    maxStock: 150,
    unitPrice: 95,
    costPrice: 52,
    status: 'IN_STOCK',
    incomingStock: 0,
    outgoingStock: 0,
    unit: 'Units',
  },
  {
    id: 'PROD-005',
    name: 'Universal USB-C Thunderbolt Dock',
    sku: 'DCK-USBC-10',
    category: 'Peripherals',
    currentStock: 65,
    minThreshold: 15,
    maxStock: 120,
    unitPrice: 140,
    costPrice: 78,
    status: 'IN_STOCK',
    incomingStock: 0,
    outgoingStock: 0,
    unit: 'Units',
  },
  {
    id: 'PROD-006',
    name: 'Active Noise Cancelling Headset',
    sku: 'HD-ANC-500',
    category: 'Audio Equipment',
    currentStock: 22,
    minThreshold: 15,
    maxStock: 100,
    unitPrice: 175,
    costPrice: 95,
    status: 'IN_STOCK',
    incomingStock: 0,
    outgoingStock: 0,
    unit: 'Units',
  },
];

// Initial Customers
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Apex Solutions Corp',
    company: 'Apex Solutions Corp',
    email: 'purchasing@apexsolutions.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, Sector 4, Silicon Bay',
    ordersCount: 14,
  },
  {
    id: 'CUST-002',
    name: 'Horizon Logistics Ltd',
    company: 'Horizon Logistics Ltd',
    email: 'ops@horizonlogistics.io',
    phone: '+1 (555) 876-5432',
    address: '108 Industrial Parkway, Suite 200, Logistics City',
    ordersCount: 8,
  },
  {
    id: 'CUST-003',
    name: 'Vanguard FinTech Group',
    company: 'Vanguard FinTech Group',
    email: 'procure@vanguardfin.com',
    phone: '+1 (555) 345-9876',
    address: '45 Wall Street Plaza, 18th Floor, Financial District',
    ordersCount: 22,
  },
  {
    id: 'CUST-004',
    name: 'Nexus BioHealth Labs',
    company: 'Nexus BioHealth Labs',
    email: 'lab.tech@nexusbio.org',
    phone: '+1 (555) 654-3210',
    address: '99 Research Way, Innovation Hub, Bio Valley',
    ordersCount: 5,
  },
];

// Initial Suppliers
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUPP-001',
    name: 'TechDirect Global Hardware',
    contactPerson: 'Robert Sterling',
    email: 'b2b@techdirectglobal.com',
    phone: '+1 (800) 555-0199',
    address: '400 Technology Drive, Tech Park, Austin, TX',
    leadTimeDays: 3,
    rating: 4.9,
  },
  {
    id: 'SUPP-002',
    name: 'ErgoCraft Manufacturing Ltd',
    contactPerson: 'Elena Rostova',
    email: 'orders@ergocraft.com',
    phone: '+1 (800) 555-0245',
    address: '12 Furniture Row, Grand Rapids, MI',
    leadTimeDays: 5,
    rating: 4.8,
  },
  {
    id: 'SUPP-003',
    name: 'OptiVision Electronics Co.',
    contactPerson: 'Kenji Sato',
    email: 'sales@optivision-displays.com',
    phone: '+1 (800) 555-0377',
    address: '88 Silicon Boulevard, San Jose, CA',
    leadTimeDays: 4,
    rating: 4.7,
  },
];

// Chronological 12 Months Business History (Jan to Dec 2026)
export const INITIAL_MONTHLY_METRICS: MonthlyBusinessMetric[] = [
  {
    monthIndex: 0,
    monthName: 'January',
    year: 2026,
    stockPurchased: 24500,
    sales: 42800,
    profit: 18300,
    loss: 0,
    unitsPurchased: 180,
    unitsSold: 165,
    transactionCount: 38,
  },
  {
    monthIndex: 1,
    monthName: 'February',
    year: 2026,
    stockPurchased: 28000,
    sales: 48500,
    profit: 20500,
    loss: 0,
    unitsPurchased: 210,
    unitsSold: 195,
    transactionCount: 44,
  },
  {
    monthIndex: 2,
    monthName: 'March',
    year: 2026,
    stockPurchased: 31200,
    sales: 54900,
    profit: 23700,
    loss: 0,
    unitsPurchased: 240,
    unitsSold: 228,
    transactionCount: 52,
  },
  {
    monthIndex: 3,
    monthName: 'April',
    year: 2026,
    stockPurchased: 29800,
    sales: 51200,
    profit: 21400,
    loss: 0,
    unitsPurchased: 225,
    unitsSold: 210,
    transactionCount: 48,
  },
  {
    monthIndex: 4,
    monthName: 'May',
    year: 2026,
    stockPurchased: 35000,
    sales: 62400,
    profit: 27400,
    loss: 0,
    unitsPurchased: 270,
    unitsSold: 255,
    transactionCount: 60,
  },
  {
    monthIndex: 5,
    monthName: 'June',
    year: 2026,
    stockPurchased: 38500,
    sales: 68100,
    profit: 29600,
    loss: 0,
    unitsPurchased: 290,
    unitsSold: 280,
    transactionCount: 66,
  },
  {
    monthIndex: 6,
    monthName: 'July',
    year: 2026,
    stockPurchased: 33000,
    sales: 58900,
    profit: 25900,
    loss: 0,
    unitsPurchased: 250,
    unitsSold: 240,
    transactionCount: 55,
  },
  {
    monthIndex: 7,
    monthName: 'August',
    year: 2026,
    stockPurchased: 36400,
    sales: 64200,
    profit: 27800,
    loss: 0,
    unitsPurchased: 280,
    unitsSold: 265,
    transactionCount: 62,
  },
  {
    monthIndex: 8,
    monthName: 'September',
    year: 2026,
    stockPurchased: 32500,
    sales: 59800,
    profit: 27300,
    loss: 0,
    unitsPurchased: 245,
    unitsSold: 235,
    transactionCount: 58,
  },
  {
    monthIndex: 9,
    monthName: 'October',
    year: 2026,
    stockPurchased: 39000,
    sales: 71500,
    profit: 32500,
    loss: 0,
    unitsPurchased: 310,
    unitsSold: 295,
    transactionCount: 70,
  },
  {
    monthIndex: 10,
    monthName: 'November',
    year: 2026,
    stockPurchased: 45000,
    sales: 84200,
    profit: 39200,
    loss: 0,
    unitsPurchased: 350,
    unitsSold: 340,
    transactionCount: 82,
  },
  {
    monthIndex: 11,
    monthName: 'December',
    year: 2026,
    stockPurchased: 48000,
    sales: 92600,
    profit: 44600,
    loss: 0,
    unitsPurchased: 380,
    unitsSold: 375,
    transactionCount: 95,
  },
];

// Initial Sales Orders
export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'SO-101',
    orderNumber: 'SO-2026-0101',
    customerId: 'CUST-001',
    customerName: 'Apex Solutions Corp',
    customerEmail: 'purchasing@apexsolutions.com',
    productId: 'PROD-003',
    productName: 'Ergonomic Executive Mesh Chair',
    productSku: 'CHR-ERGO-01',
    quantity: 6,
    unitPrice: 280,
    totalAmount: 1680,
    status: 'COMPLETED',
    createdAt: '2026-09-21T10:15:00Z',
    createdBy: 'SAL001',
    createdByName: 'Emily Watson',
    completedAt: '2026-09-21T10:15:00Z',
    notes: 'Fulfilled immediately from current available stock.',
  },
  {
    id: 'SO-102',
    orderNumber: 'SO-2026-0102',
    customerId: 'CUST-003',
    customerName: 'Vanguard FinTech Group',
    customerEmail: 'procure@vanguardfin.com',
    productId: 'PROD-001',
    productName: 'Enterprise Laptop Pro 15"',
    productSku: 'LAP-PRO-15',
    quantity: 20, // Insufficient stock (only 8 available)
    unitPrice: 1250,
    totalAmount: 25000,
    status: 'PENDING_STOCK',
    purchaseRequestId: 'PR-201',
    createdAt: '2026-09-22T09:30:00Z',
    createdBy: 'SAL001',
    createdByName: 'Emily Watson',
    notes: 'Auto-triggered PR-2026-0201 sent to Manager for approval due to stock deficit.',
  },
];

// Initial Purchase Requests
export const INITIAL_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: 'PR-201',
    prNumber: 'PR-2026-0201',
    salesOrderId: 'SO-102',
    salesOrderNumber: 'SO-2026-0102',
    productId: 'PROD-001',
    productName: 'Enterprise Laptop Pro 15"',
    productSku: 'LAP-PRO-15',
    requestedQuantity: 25, // covers order deficit + buffer
    currentStockAtRequest: 8,
    minThreshold: 15,
    estimatedCost: 20500,
    suggestedSupplierId: 'SUPP-001',
    suggestedSupplierName: 'TechDirect Global Hardware',
    urgency: 'HIGH',
    status: 'PENDING_APPROVAL',
    createdAt: '2026-09-22T09:30:05Z',
    createdBy: 'SAL001',
    createdByName: 'System Auto-Trigger (Emily Watson)',
    reason: 'Insufficient stock for Sales Order SO-2026-0102 (Deficit: 12 units + min stock buffer).',
  },
  {
    id: 'PR-202',
    prNumber: 'PR-2026-0200',
    productId: 'PROD-002',
    productName: 'UltraSharp 27" 4K Monitor',
    productSku: 'MON-4K-27',
    requestedQuantity: 20,
    currentStockAtRequest: 4,
    minThreshold: 12,
    estimatedCost: 5200,
    suggestedSupplierId: 'SUPP-003',
    suggestedSupplierName: 'OptiVision Electronics Co.',
    urgency: 'MEDIUM',
    status: 'APPROVED',
    managerComment: 'Approved. Essential inventory for Q3 delivery pipeline.',
    reviewedBy: 'MGR001',
    reviewedByName: 'David Ross',
    reviewedAt: '2026-09-22T11:00:00Z',
    createdAt: '2026-09-22T08:15:00Z',
    createdBy: 'PUR001',
    createdByName: 'Michael Chen',
    reason: 'Stock breached safety threshold (4 units remaining vs 12 min).',
  },
];

// Initial Purchase Orders
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-301',
    poNumber: 'PO-2026-0301',
    purchaseRequestId: 'PR-202',
    purchaseRequestNumber: 'PR-2026-0200',
    productId: 'PROD-002',
    productName: 'UltraSharp 27" 4K Monitor',
    productSku: 'MON-4K-27',
    supplierId: 'SUPP-003',
    supplierName: 'OptiVision Electronics Co.',
    quantity: 20,
    unitCost: 260,
    totalCost: 5200,
    status: 'ORDERED',
    timeline: [
      {
        status: 'REQUESTED',
        timestamp: '2026-09-22T08:15:00Z',
        updatedBy: 'PUR001',
        updatedByName: 'Michael Chen',
        note: 'PR created for low stock alert',
      },
      {
        status: 'APPROVED',
        timestamp: '2026-09-22T11:00:00Z',
        updatedBy: 'MGR001',
        updatedByName: 'David Ross',
        note: 'Manager authorization granted',
      },
      {
        status: 'ORDERED',
        timestamp: '2026-09-22T11:30:00Z',
        updatedBy: 'PUR001',
        updatedByName: 'Michael Chen',
        note: 'Dispatched to OptiVision Electronics via EDI',
      },
    ],
    expectedDeliveryDate: '2026-09-26',
    createdAt: '2026-09-22T11:30:00Z',
    createdBy: 'PUR001',
    createdByName: 'Michael Chen',
  },
];

// Initial Stock Transactions
export const INITIAL_STOCK_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'TXN-001',
    productId: 'PROD-003',
    productName: 'Ergonomic Executive Mesh Chair',
    productSku: 'CHR-ERGO-01',
    type: 'SALES_OUT',
    quantity: -6,
    previousStock: 38,
    newStock: 32,
    referenceType: 'SALES_ORDER',
    referenceId: 'SO-101',
    referenceNumber: 'SO-2026-0101',
    createdAt: '2026-09-21T10:15:00Z',
    createdBy: 'SAL001',
    createdByName: 'Emily Watson',
    notes: 'Order fulfillment for Apex Solutions Corp',
  },
  {
    id: 'TXN-002',
    productId: 'PROD-004',
    productName: 'Wireless Mechanical Keyboard',
    productSku: 'KB-WL-87',
    type: 'PURCHASE_IN',
    quantity: 30,
    previousStock: 18,
    newStock: 48,
    referenceType: 'PURCHASE_ORDER',
    referenceId: 'PO-299',
    referenceNumber: 'PO-2026-0299',
    createdAt: '2026-09-20T14:20:00Z',
    createdBy: 'PUR001',
    createdByName: 'Michael Chen',
    notes: 'Procurement delivery received and inspected',
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    targetRoles: ['MANAGER'],
    title: 'Urgent Approval Needed: PR-2026-0201',
    message: 'Low stock for Enterprise Laptop Pro 15" holding up Sales Order SO-2026-0102. Action required.',
    type: 'WARNING',
    relatedModule: 'MANAGER',
    relatedEntityId: 'PR-201',
    createdAt: '2026-09-22T09:30:10Z',
    readBy: [],
  },
  {
    id: 'NOTIF-002',
    targetRoles: ['SALES'],
    title: 'Sales Order SO-2026-0102 Awaiting Stock',
    message: 'Automated Purchase Request PR-2026-0201 has been dispatched to Manager for stock replenishment.',
    type: 'INFO',
    relatedModule: 'SALES',
    relatedEntityId: 'SO-102',
    createdAt: '2026-09-22T09:30:08Z',
    readBy: [],
  },
  {
    id: 'NOTIF-003',
    targetRoles: ['PURCHASE'],
    title: 'Approved Purchase Request PR-2026-0200',
    message: 'Manager David Ross approved PR-2026-0200 for 20 units of 4K Monitors. Ready for PO creation.',
    type: 'SUCCESS',
    relatedModule: 'PURCHASE',
    relatedEntityId: 'PR-202',
    createdAt: '2026-09-22T11:00:15Z',
    readBy: [],
  },
  {
    id: 'NOTIF-004',
    targetRoles: ['ADMIN'],
    title: 'System Activity: Stock Breached Threshold',
    message: 'Product LAP-PRO-15 current stock is 8 units (Threshold: 15). Automated ERP workflow engaged.',
    type: 'ALERT',
    relatedModule: 'ADMIN',
    relatedEntityId: 'PROD-001',
    createdAt: '2026-09-22T09:30:06Z',
    readBy: [],
  },
];

// LocalStorage Keys
const STORAGE_PREFIX = 'SME_ERP_';
const KEYS = {
  USERS: `${STORAGE_PREFIX}USERS`,
  PASSWORDS: `${STORAGE_PREFIX}PASSWORDS`,
  CURRENT_USER: `${STORAGE_PREFIX}CURRENT_USER`,
  PRODUCTS: `${STORAGE_PREFIX}PRODUCTS`,
  CUSTOMERS: `${STORAGE_PREFIX}CUSTOMERS`,
  SUPPLIERS: `${STORAGE_PREFIX}SUPPLIERS`,
  SALES_ORDERS: `${STORAGE_PREFIX}SALES_ORDERS`,
  PURCHASE_REQUESTS: `${STORAGE_PREFIX}PURCHASE_REQUESTS`,
  PURCHASE_ORDERS: `${STORAGE_PREFIX}PURCHASE_ORDERS`,
  STOCK_TRANSACTIONS: `${STORAGE_PREFIX}STOCK_TRANSACTIONS`,
  MONTHLY_METRICS: `${STORAGE_PREFIX}MONTHLY_METRICS`,
  NOTIFICATIONS: `${STORAGE_PREFIX}NOTIFICATIONS`,
  AUDIT_LOGS: `${STORAGE_PREFIX}AUDIT_LOGS`,
};

// Listeners for reactive updates
type StoreListener = () => void;
const listeners = new Set<StoreListener>();

export function subscribeToStore(listener: StoreListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in store listener', e);
    }
  });

  // Cross-tab broadcast
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const bc = new BroadcastChannel('sme_erp_sync');
      bc.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
      bc.close();
    } catch {
      // Ignore broadcast errors
    }
  }
}

// Setup Cross-tab Listener
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    const bc = new BroadcastChannel('sme_erp_sync');
    bc.onmessage = () => {
      listeners.forEach((l) => l());
    };
  } catch {
    // Ignore
  }
}

// Initializer
export function initStore() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }

  // Pre-seed passwords (User ID -> password)
  if (!localStorage.getItem(KEYS.PASSWORDS)) {
    const passwords: Record<string, string> = {
      ADM001: 'admin123',
      MGR001: 'manager123',
      SAL001: 'sales123',
      PUR001: 'purchase123',
    };
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwords));
  }

  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  if (!localStorage.getItem(KEYS.CUSTOMERS)) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  }

  if (!localStorage.getItem(KEYS.SUPPLIERS)) {
    localStorage.setItem(KEYS.SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
  }

  if (!localStorage.getItem(KEYS.SALES_ORDERS)) {
    localStorage.setItem(KEYS.SALES_ORDERS, JSON.stringify(INITIAL_SALES_ORDERS));
  }

  if (!localStorage.getItem(KEYS.PURCHASE_REQUESTS)) {
    localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(INITIAL_PURCHASE_REQUESTS));
  }

  if (!localStorage.getItem(KEYS.PURCHASE_ORDERS)) {
    localStorage.setItem(KEYS.PURCHASE_ORDERS, JSON.stringify(INITIAL_PURCHASE_ORDERS));
  }

  if (!localStorage.getItem(KEYS.STOCK_TRANSACTIONS)) {
    localStorage.setItem(KEYS.STOCK_TRANSACTIONS, JSON.stringify(INITIAL_STOCK_TRANSACTIONS));
  }

  if (!localStorage.getItem(KEYS.MONTHLY_METRICS)) {
    localStorage.setItem(KEYS.MONTHLY_METRICS, JSON.stringify(INITIAL_MONTHLY_METRICS));
  }

  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }

  if (!localStorage.getItem(KEYS.AUDIT_LOGS)) {
    const initialLogs: AuditLogItem[] = [
      {
        id: 'LOG-001',
        timestamp: '2026-09-22T09:30:05Z',
        userId: 'SAL001',
        userName: 'Emily Watson',
        userRole: 'SALES',
        action: 'ORDER_SUBMITTED_STOCK_DEFICIT',
        module: 'Sales & Inventory',
        details: 'Submitted SO-2026-0102 with insufficient stock. Automated PR-2026-0201 dispatched.',
        entityId: 'SO-102',
      },
    ];
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
  }
}

// Auto-initialize store in browser environment
if (typeof window !== 'undefined') {
  initStore();
}

// ----------------- GETTERS -----------------

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEYS.CURRENT_USER);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || (!parsed.id && !parsed.userId)) return null;
    const norm = normalizeRole(parsed.role);
    return {
      ...parsed,
      id: parsed.id || parsed.userId,
      userId: parsed.userId || parsed.id,
      role: (norm || parsed.role || 'admin') as UserRole,
      status: parsed.status || (parsed.isActive === false ? 'inactive' : 'active'),
      isActive: parsed.isActive !== undefined ? Boolean(parsed.isActive) : (parsed.status !== 'inactive'),
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
  notifyListeners();
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.USERS);
  if (!raw) return INITIAL_USERS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_USERS;
    return parsed.map((u) => {
      const norm = normalizeRole(u.role);
      return {
        ...u,
        id: u.id || u.userId,
        userId: u.userId || u.id,
        role: (norm || u.role || 'admin') as UserRole,
        status: u.status || (u.isActive === false ? 'inactive' : 'active'),
        isActive: u.isActive !== undefined ? Boolean(u.isActive) : (u.status !== 'inactive'),
      };
    });
  } catch {
    return INITIAL_USERS;
  }
}

export function getAllProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.PRODUCTS);
  if (!raw) return INITIAL_PRODUCTS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_PRODUCTS;
    return parsed.map((p) => {
      let status = p.status;
      if (!status) {
        if (p.currentStock === 0) status = 'OUT_OF_STOCK';
        else if (p.currentStock <= p.minThreshold) status = 'LOW_STOCK';
        else status = 'IN_STOCK';
      }
      return { ...p, status };
    });
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function getAllCustomers(): Customer[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.CUSTOMERS);
  return raw ? JSON.parse(raw) : INITIAL_CUSTOMERS;
}

export function getAllSuppliers(): Supplier[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.SUPPLIERS);
  return raw ? JSON.parse(raw) : INITIAL_SUPPLIERS;
}

export function getAllSalesOrders(): SalesOrder[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.SALES_ORDERS);
  return raw ? JSON.parse(raw) : INITIAL_SALES_ORDERS;
}

export function getAllPurchaseRequests(): PurchaseRequest[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.PURCHASE_REQUESTS);
  return raw ? JSON.parse(raw) : INITIAL_PURCHASE_REQUESTS;
}

export function getAllPurchaseOrders(): PurchaseOrder[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.PURCHASE_ORDERS);
  return raw ? JSON.parse(raw) : INITIAL_PURCHASE_ORDERS;
}

export function getAllStockTransactions(): StockTransaction[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.STOCK_TRANSACTIONS);
  return raw ? JSON.parse(raw) : INITIAL_STOCK_TRANSACTIONS;
}

export function getMonthlyMetrics(): MonthlyBusinessMetric[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.MONTHLY_METRICS);
  return raw ? JSON.parse(raw) : INITIAL_MONTHLY_METRICS;
}

export function getAllNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
  return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
}

export function getAllAuditLogs(): AuditLogItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.AUDIT_LOGS);
  return raw ? JSON.parse(raw) : [];
}

// ----------------- AUTHENTICATION -----------------

export function authenticateUser(
  userIdInput: string,
  passwordInput: string
): {
  success: boolean;
  user?: User;
  role?: 'admin' | 'manager' | 'sales' | 'purchase';
  redirectUrl?: string;
  error?: string;
} {
  initStore();
  const trimmedId = (userIdInput || '').trim().toUpperCase();
  const trimmedPassword = (passwordInput || '').trim();

  if (!trimmedId || !trimmedPassword) {
    return { success: false, error: 'Invalid User ID or Password' };
  }

  // STEP 1: Authenticate user credentials against trusted user records
  const users = getAllUsers();
  const user = users.find(
    (u) =>
      (u.id || '').toUpperCase() === trimmedId ||
      (u.userId || '').toUpperCase() === trimmedId
  );

  if (!user) {
    return { success: false, error: 'Invalid User ID or Password' };
  }

  const rawPasswords = localStorage.getItem(KEYS.PASSWORDS);
  const passwords: Record<string, string> = rawPasswords ? JSON.parse(rawPasswords) : {};
  const storedPassword = passwords[user.id] || passwords[user.userId || ''];
  const userRoleStr = normalizeRole(user.role) || String(user.role).toLowerCase();
  const defaultPass = userRoleStr + '123';
  const expectedPassword = storedPassword || defaultPass;

  if (trimmedPassword !== expectedPassword) {
    return { success: false, error: 'Invalid User ID or Password' };
  }

  // STEP 2 & 3: Retrieve authenticated user's trusted record and verify role and status
  if (user.isActive === false || user.status === 'inactive') {
    return {
      success: false,
      error: 'Your account is inactive. Please contact the administrator.',
    };
  }

  const normalizedRole = normalizeRole(user.role);
  if (!normalizedRole) {
    console.error(
      `[Auth Error] User document ${user.id} has invalid or unconfigured role:`,
      user.role
    );
    return {
      success: false,
      error: 'User role is not configured. Please contact the administrator.',
    };
  }

  // STEP 4: Determine redirect URL according to role
  const redirectUrl = getRoleDashboardPath(normalizedRole);
  if (!redirectUrl) {
    console.error(`[Auth Error] Could not determine route for role: ${normalizedRole}`);
    return {
      success: false,
      error: 'User role is not configured. Please contact the administrator.',
    };
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  user.role = normalizedRole;
  const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
  localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));

  // Set session
  setCurrentUser(user);

  addAuditLog(
    user.id,
    user.name,
    user.role,
    'USER_LOGIN',
    'Authentication',
    `User ${user.id} logged in successfully with role '${normalizedRole}'. Redirecting to ${redirectUrl}.`
  );

  return { success: true, user, role: normalizedRole, redirectUrl };
}

export function logoutUser() {
  const current = getCurrentUser();
  if (current) {
    addAuditLog(current.id, current.name, current.role, 'USER_LOGOUT', 'Authentication', `User ${current.id} logged out.`);
  }
  setCurrentUser(null);
}

// ----------------- ADMIN ACTIONS -----------------

export function createNewUser(userData: {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  password?: string;
}): { success: boolean; user?: User; error?: string } {
  const users = getAllUsers();
  
  // Check duplicate email
  if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, error: 'A user with this email address already exists.' };
  }

  const normalizedRole = normalizeRole(userData.role) || 'sales';

  // Generate role-based ID: ADM002, MGR002, SAL002, PUR002
  const prefixMap: Record<'admin' | 'manager' | 'sales' | 'purchase', string> = {
    admin: 'ADM',
    manager: 'MGR',
    sales: 'SAL',
    purchase: 'PUR',
  };
  const prefix = prefixMap[normalizedRole];
  const sameRoleUsers = users.filter((u) =>
    (u.id || u.userId || '').toUpperCase().startsWith(prefix)
  );
  const nextNum = sameRoleUsers.length + 1;
  const newId = `${prefix}${String(nextNum).padStart(3, '0')}`;

  const newUser: User = {
    id: newId,
    userId: newId,
    name: userData.name,
    email: userData.email,
    role: normalizedRole,
    department: userData.department,
    status: 'active',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  // Save password
  const rawPasswords = localStorage.getItem(KEYS.PASSWORDS);
  const passwords = rawPasswords ? JSON.parse(rawPasswords) : {};
  passwords[newId] = userData.password || (normalizedRole + '123');
  localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwords));

  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'USER_CREATED',
      'User Management',
      `Admin created new user ${newUser.userId} (${newUser.name}, Role: ${newUser.role})`,
      newUser.userId
    );
  }

  // Push notification to Admin
  addNotification(
    ['admin', 'ADMIN'],
    'New Employee Account Created',
    `${newUser.name} assigned role ${newUser.role} with User ID ${newUser.userId}`,
    'INFO',
    'ADMIN',
    newUser.userId
  );

  notifyListeners();
  return { success: true, user: newUser };
}

export function toggleUserStatus(userId: string): boolean {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId || u.userId === userId);
  if (!user) return false;

  user.isActive = !user.isActive;
  user.status = user.isActive ? 'active' : 'inactive';
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'USER_STATUS_TOGGLED',
      'User Management',
      `User ${user.id} status changed to ${user.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      user.id
    );
  }

  notifyListeners();
  return true;
}

export function addProduct(product: Omit<Product, 'id' | 'incomingStock' | 'outgoingStock' | 'status'>): Product {
  const products = getAllProducts();
  const newId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
  
  let status: Product['status'] = 'IN_STOCK';
  if (product.currentStock === 0) status = 'OUT_OF_STOCK';
  else if (product.currentStock <= product.minThreshold) status = 'LOW_STOCK';

  const newProd: Product = {
    ...product,
    id: newId,
    incomingStock: 0,
    outgoingStock: 0,
    status,
  };

  products.push(newProd);
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

  const currentUser = getCurrentUser();
  if (currentUser) {
    addAuditLog(currentUser.id, currentUser.name, currentUser.role, 'PRODUCT_ADDED', 'Inventory', `Added product ${newProd.name} (${newProd.sku})`, newProd.id);
  }

  notifyListeners();
  return newProd;
}

// ----------------- AUTOMATIC ERP WORKFLOW ENGINE -----------------

/**
 * CORE WORKFLOW 1: SALES ORDER CREATION & AUTOMATIC STOCK CHECK
 * - If stock available: Order processed immediately, stock deducted, logged, sales/profit recorded.
 * - If stock insufficient: System AUTOMATICALLY generates a Purchase Request,
 *   places Sales Order in PENDING_STOCK, sends approval request to Manager.
 */
export function createSalesOrder(orderInput: {
  customerId: string;
  productId: string;
  quantity: number;
  notes?: string;
}): { success: boolean; order?: SalesOrder; purchaseRequestCreated?: boolean; message: string } {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'You must be logged in to create a sales order.' };
  }

  const products = getAllProducts();
  const product = products.find((p) => p.id === orderInput.productId);
  if (!product) {
    return { success: false, message: 'Product not found.' };
  }

  const customers = getAllCustomers();
  const customer = customers.find((c) => c.id === orderInput.customerId);
  if (!customer) {
    return { success: false, message: 'Customer not found.' };
  }

  const salesOrders = getAllSalesOrders();
  const orderNumber = `SO-${new Date().getFullYear()}-${String(salesOrders.length + 101).padStart(4, '0')}`;
  const totalAmount = orderInput.quantity * product.unitPrice;

  // 1. Check stock availability
  if (product.currentStock >= orderInput.quantity) {
    // STOCK IS AVAILABLE -> Process Order Directly
    const previousStock = product.currentStock;
    product.currentStock -= orderInput.quantity;
    
    // Update product status
    if (product.currentStock === 0) product.status = 'OUT_OF_STOCK';
    else if (product.currentStock <= product.minThreshold) product.status = 'LOW_STOCK';
    else product.status = 'IN_STOCK';

    const newOrder: SalesOrder = {
      id: `SO-${Date.now()}`,
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: orderInput.quantity,
      unitPrice: product.unitPrice,
      totalAmount,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      completedAt: new Date().toISOString(),
      notes: orderInput.notes || 'Stock available - processed and fulfilled immediately.',
    };

    salesOrders.unshift(newOrder);
    localStorage.setItem(KEYS.SALES_ORDERS, JSON.stringify(salesOrders));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

    // Increment customer orders count
    customer.ordersCount += 1;
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));

    // Log Stock Transaction
    addStockTransaction({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      type: 'SALES_OUT',
      quantity: -orderInput.quantity,
      previousStock,
      newStock: product.currentStock,
      referenceType: 'SALES_ORDER',
      referenceId: newOrder.id,
      referenceNumber: newOrder.orderNumber,
      notes: `Order fulfillment for ${customer.name}`,
    });

    // Update Monthly Business Financials
    recordSalesRevenue(totalAmount, (product.unitPrice - product.costPrice) * orderInput.quantity, orderInput.quantity);

    // Audit log
    addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'SALES_ORDER_COMPLETED',
      'Sales & Inventory',
      `Processed order ${orderNumber} for ${orderInput.quantity}x ${product.name} ($${totalAmount}). Stock updated: ${previousStock} -> ${product.currentStock}.`,
      newOrder.id
    );

    // Notifications
    addNotification(
      ['SALES', 'ADMIN'],
      `Sales Order ${orderNumber} Completed`,
      `Order for ${customer.name} (${orderInput.quantity}x ${product.name}) fulfilled. Total: $${totalAmount.toLocaleString()}.`,
      'SUCCESS',
      'SALES',
      newOrder.id
    );

    // If stock reached low threshold, alert Manager & Purchase
    if (product.status === 'LOW_STOCK') {
      addNotification(
        ['MANAGER', 'PURCHASE', 'ADMIN'],
        `Low Stock Alert: ${product.name}`,
        `Current stock has dropped to ${product.currentStock} units (Threshold: ${product.minThreshold}).`,
        'WARNING',
        'INVENTORY',
        product.id
      );
    }

    notifyListeners();
    return {
      success: true,
      order: newOrder,
      purchaseRequestCreated: false,
      message: `Stock available! Sales Order ${orderNumber} has been processed and fulfilled immediately.`,
    };
  } else {
    // STOCK IS INSUFFICIENT -> Trigger Automatic Purchase Request & Approval Workflow
    const purchaseRequests = getAllPurchaseRequests();
    const suppliers = getAllSuppliers();
    const suggestedSupplier = suppliers[0] || { id: 'SUPP-001', name: 'TechDirect Global Hardware' };

    const prNumber = `PR-${new Date().getFullYear()}-${String(purchaseRequests.length + 201).padStart(4, '0')}`;
    const prId = `PR-${Date.now()}`;

    // Calculate required quantity: deficit + buffer to restore to at least minThreshold + 5
    const deficit = orderInput.quantity - product.currentStock;
    const requestedQuantity = Math.max(deficit + product.minThreshold, deficit + 10);
    const estimatedCost = requestedQuantity * product.costPrice;

    const newOrder: SalesOrder = {
      id: `SO-${Date.now()}`,
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      quantity: orderInput.quantity,
      unitPrice: product.unitPrice,
      totalAmount,
      status: 'PENDING_STOCK',
      purchaseRequestId: prId,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      notes: `Insufficient current stock (${product.currentStock} available, ${orderInput.quantity} requested). Automatic Purchase Request ${prNumber} generated.`,
    };

    const newPR: PurchaseRequest = {
      id: prId,
      prNumber,
      salesOrderId: newOrder.id,
      salesOrderNumber: newOrder.orderNumber,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      requestedQuantity,
      currentStockAtRequest: product.currentStock,
      minThreshold: product.minThreshold,
      estimatedCost,
      suggestedSupplierId: suggestedSupplier.id,
      suggestedSupplierName: suggestedSupplier.name,
      urgency: 'HIGH',
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      createdByName: `Auto-Triggered (${currentUser.name})`,
      reason: `Automated replenishment for Sales Order ${orderNumber}. Deficit of ${deficit} units + threshold buffer.`,
    };

    salesOrders.unshift(newOrder);
    purchaseRequests.unshift(newPR);

    localStorage.setItem(KEYS.SALES_ORDERS, JSON.stringify(salesOrders));
    localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(purchaseRequests));

    // Audit log
    addAuditLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'CROSS_MODULE_TRIGGER_PR',
      'Workflow Automation',
      `Insufficient stock (${product.currentStock}/${orderInput.quantity}). Sales Order ${orderNumber} placed on hold. Automatic PR ${prNumber} dispatched to Manager for approval.`,
      newPR.id
    );

    // Manager Notification (High priority approval request)
    addNotification(
      ['MANAGER'],
      `Action Required: Approval for ${prNumber}`,
      `Sales Order ${orderNumber} needs ${product.name} (Deficit: ${deficit}). Please approve replenishment request.`,
      'WARNING',
      'MANAGER',
      newPR.id
    );

    // Sales Staff Notification
    addNotification(
      ['SALES'],
      `Order ${orderNumber} Queued for Restock`,
      `Stock insufficient (${product.currentStock} in stock). Automatic Purchase Request ${prNumber} sent to Manager for approval.`,
      'INFO',
      'SALES',
      newOrder.id
    );

    notifyListeners();
    return {
      success: true,
      order: newOrder,
      purchaseRequestCreated: true,
      message: `Stock is insufficient (${product.currentStock} available vs ${orderInput.quantity} requested). System automatically generated Purchase Request ${prNumber} and notified the Manager for approval!`,
    };
  }
}

/**
 * CORE WORKFLOW 2: MANAGER REVIEW (APPROVE / REJECT)
 */
export function reviewPurchaseRequest(
  prId: string,
  approved: boolean,
  comment?: string
): { success: boolean; message: string } {
  const currentUser = getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);
  if (!currentUser || (currentRole !== 'manager' && currentRole !== 'admin')) {
    return { success: false, message: 'Only Managers or Admins can review purchase requests.' };
  }

  const purchaseRequests = getAllPurchaseRequests();
  const pr = purchaseRequests.find((r) => r.id === prId);
  if (!pr) {
    return { success: false, message: 'Purchase request not found.' };
  }

  pr.status = approved ? 'APPROVED' : 'REJECTED';
  pr.managerComment = comment || (approved ? 'Approved for procurement.' : 'Declined by management.');
  pr.reviewedBy = currentUser.id;
  pr.reviewedByName = currentUser.name;
  pr.reviewedAt = new Date().toISOString();

  localStorage.setItem(KEYS.PURCHASE_REQUESTS, JSON.stringify(purchaseRequests));

  // If rejected and linked to a Sales Order, update Sales Order note
  if (!approved && pr.salesOrderId) {
    const salesOrders = getAllSalesOrders();
    const order = salesOrders.find((o) => o.id === pr.salesOrderId);
    if (order) {
      order.notes = `Manager rejected replenishment request (${comment || 'No reason provided'}). Customer notification needed.`;
      localStorage.setItem(KEYS.SALES_ORDERS, JSON.stringify(salesOrders));
    }
  }

  // Audit log
  addAuditLog(
    currentUser.id,
    currentUser.name,
    currentUser.role,
    approved ? 'PR_APPROVED' : 'PR_REJECTED',
    'Approvals',
    `Manager ${approved ? 'APPROVED' : 'REJECTED'} Purchase Request ${pr.prNumber} for ${pr.requestedQuantity}x ${pr.productName}. Note: ${comment || 'None'}`,
    pr.id
  );

  // Notify Purchase Staff
  if (approved) {
    addNotification(
      ['PURCHASE'],
      `Purchase Request Approved: ${pr.prNumber}`,
      `Manager approved ${pr.requestedQuantity}x ${pr.productName}. You can now generate the Purchase Order.`,
      'SUCCESS',
      'PURCHASE',
      pr.id
    );

    // Also notify Sales Staff
    addNotification(
      ['SALES'],
      `Replenishment Approved for ${pr.salesOrderNumber || pr.productName}`,
      `Manager approved PR ${pr.prNumber}. Procurement is now processing.`,
      'INFO',
      'SALES',
      pr.id
    );
  } else {
    addNotification(
      ['PURCHASE', 'SALES'],
      `Purchase Request Rejected: ${pr.prNumber}`,
      `Manager declined request for ${pr.productName}. Reason: ${comment || 'Not specified'}.`,
      'ALERT',
      'MANAGER',
      pr.id
    );
  }

  notifyListeners();
  return {
    success: true,
    message: approved
      ? `Purchase Request ${pr.prNumber} approved! Purchase Staff has been notified to place the order.`
      : `Purchase Request ${pr.prNumber} rejected. Relevant team members notified.`,
  };
}

/**
 * CORE WORKFLOW 3: PURCHASE STAFF DISPATCHES PURCHASE ORDER
 */
export function createPurchaseOrder(poInput: {
  purchaseRequestId?: string;
  productId: string;
  supplierId: string;
  quantity: number;
  unitCost: number;
  expectedDeliveryDate: string;
  notes?: string;
}): { success: boolean; po?: PurchaseOrder; message: string } {
  const currentUser = getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);
  if (!currentUser || (currentRole !== 'purchase' && currentRole !== 'admin')) {
    return { success: false, message: 'Only Purchase Staff or Admins can create purchase orders.' };
  }

  const products = getAllProducts();
  const product = products.find((p) => p.id === poInput.productId);
  if (!product) return { success: false, message: 'Product not found.' };

  const suppliers = getAllSuppliers();
  const supplier = suppliers.find((s) => s.id === poInput.supplierId);
  if (!supplier) return { success: false, message: 'Supplier not found.' };

  const purchaseOrders = getAllPurchaseOrders();
  const poNumber = `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 301).padStart(4, '0')}`;
  const totalCost = poInput.quantity * poInput.unitCost;

  let linkedPRNumber: string | undefined;
  let linkedSalesOrderId: string | undefined;

  if (poInput.purchaseRequestId) {
    const prs = getAllPurchaseRequests();
    const pr = prs.find((r) => r.id === poInput.purchaseRequestId);
    if (pr) {
      linkedPRNumber = pr.prNumber;
      linkedSalesOrderId = pr.salesOrderId;
    }
  }

  const newPO: PurchaseOrder = {
    id: `PO-${Date.now()}`,
    poNumber,
    purchaseRequestId: poInput.purchaseRequestId,
    purchaseRequestNumber: linkedPRNumber,
    salesOrderIdToFulfill: linkedSalesOrderId,
    productId: product.id,
    productName: product.name,
    productSku: product.sku,
    supplierId: supplier.id,
    supplierName: supplier.name,
    quantity: poInput.quantity,
    unitCost: poInput.unitCost,
    totalCost,
    status: 'ORDERED',
    timeline: [
      {
        status: 'REQUESTED',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        updatedBy: currentUser.id,
        updatedByName: currentUser.name,
        note: linkedPRNumber ? `Derived from ${linkedPRNumber}` : 'Direct procurement need',
      },
      {
        status: 'APPROVED',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        updatedBy: currentUser.id,
        updatedByName: currentUser.name,
        note: 'Procurement budget verified',
      },
      {
        status: 'ORDERED',
        timestamp: new Date().toISOString(),
        updatedBy: currentUser.id,
        updatedByName: currentUser.name,
        note: `Order transmitted to supplier ${supplier.name}. Expected ETA: ${poInput.expectedDeliveryDate}`,
      },
    ],
    expectedDeliveryDate: poInput.expectedDeliveryDate,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.id,
    createdByName: currentUser.name,
    notes: poInput.notes,
  };

  // Update product incomingStock
  product.incomingStock += poInput.quantity;
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

  purchaseOrders.unshift(newPO);
  localStorage.setItem(KEYS.PURCHASE_ORDERS, JSON.stringify(purchaseOrders));

  // Audit log
  addAuditLog(
    currentUser.id,
    currentUser.name,
    currentUser.role,
    'PO_ORDERED',
    'Procurement',
    `Created and dispatched Purchase Order ${poNumber} to ${supplier.name} for ${poInput.quantity}x ${product.name} ($${totalCost}). Expected: ${poInput.expectedDeliveryDate}`,
    newPO.id
  );

  // Notifications
  addNotification(
    ['ADMIN', 'MANAGER'],
    `Purchase Order Placed: ${poNumber}`,
    `${poInput.quantity}x ${product.name} ordered from ${supplier.name}. Value: $${totalCost.toLocaleString()}.`,
    'INFO',
    'PURCHASE',
    newPO.id
  );

  notifyListeners();
  return {
    success: true,
    po: newPO,
    message: `Purchase Order ${poNumber} created and dispatched to ${supplier.name}!`,
  };
}

/**
 * CORE WORKFLOW 4: GOODS RECEIVED -> STOCK UPDATED -> AUTOMATIC SALES ORDER FULFILLMENT
 * When goods are received:
 * 1. PO status updated to 'RECEIVED'
 * 2. Product currentStock increases, incomingStock decreases
 * 3. Stock transaction logged (PURCHASE_IN)
 * 4. Monthly stockPurchased expense recorded
 * 5. Automatic Check: Can any 'PENDING_STOCK' Sales Order now be fulfilled?
 *    - If yes: automatically complete sales order, deduct stock, log SALES_OUT, record profit, notify Sales & Admin!
 */
export function receivePurchaseOrderGoods(poId: string): {
  success: boolean;
  message: string;
  autoFulfilledOrdersCount: number;
} {
  const currentUser = getCurrentUser();
  const currentRole = normalizeRole(currentUser?.role);
  if (!currentUser || (currentRole !== 'purchase' && currentRole !== 'admin')) {
    return { success: false, message: 'Only Purchase Staff or Admins can mark goods as received.', autoFulfilledOrdersCount: 0 };
  }

  const purchaseOrders = getAllPurchaseOrders();
  const po = purchaseOrders.find((o) => o.id === poId);
  if (!po) return { success: false, message: 'Purchase Order not found.', autoFulfilledOrdersCount: 0 };

  if (po.status === 'RECEIVED') {
    return { success: false, message: 'This purchase order has already been marked as received.', autoFulfilledOrdersCount: 0 };
  }

  const products = getAllProducts();
  const product = products.find((p) => p.id === po.productId);
  if (!product) return { success: false, message: 'Linked product not found.', autoFulfilledOrdersCount: 0 };

  // 1. Update PO Status and Timeline
  po.status = 'RECEIVED';
  po.receivedAt = new Date().toISOString();
  po.receivedBy = currentUser.id;
  po.receivedByName = currentUser.name;
  po.timeline.push({
    status: 'RECEIVED',
    timestamp: new Date().toISOString(),
    updatedBy: currentUser.id,
    updatedByName: currentUser.name,
    note: `Shipment received, verified, and placed into active warehouse inventory.`,
  });

  // 2. Update Product Stock
  const previousStock = product.currentStock;
  product.currentStock += po.quantity;
  product.incomingStock = Math.max(0, product.incomingStock - po.quantity);

  // Recalculate status
  if (product.currentStock === 0) product.status = 'OUT_OF_STOCK';
  else if (product.currentStock <= product.minThreshold) product.status = 'LOW_STOCK';
  else product.status = 'IN_STOCK';

  // 3. Log Stock Transaction
  addStockTransaction({
    productId: product.id,
    productName: product.name,
    productSku: product.sku,
    type: 'PURCHASE_IN',
    quantity: po.quantity,
    previousStock,
    newStock: product.currentStock,
    referenceType: 'PURCHASE_ORDER',
    referenceId: po.id,
    referenceNumber: po.poNumber,
    notes: `Receipt from ${po.supplierName} (${po.quantity} units)`,
  });

  // 4. Update Financial History (Stock Purchased Cost)
  recordStockPurchaseExpense(po.totalCost, po.quantity);

  // 5. Check if any Sales Order waiting on this product can be fulfilled!
  const salesOrders = getAllSalesOrders();
  const pendingOrdersForProduct = salesOrders.filter(
    (so) => so.productId === product.id && so.status === 'PENDING_STOCK'
  );

  let autoFulfilledCount = 0;
  for (const pendingOrder of pendingOrdersForProduct) {
    if (product.currentStock >= pendingOrder.quantity) {
      // Auto fulfill this order!
      const stockBeforeFulfill = product.currentStock;
      product.currentStock -= pendingOrder.quantity;
      
      // Update stock status
      if (product.currentStock === 0) product.status = 'OUT_OF_STOCK';
      else if (product.currentStock <= product.minThreshold) product.status = 'LOW_STOCK';
      else product.status = 'IN_STOCK';

      pendingOrder.status = 'COMPLETED';
      pendingOrder.completedAt = new Date().toISOString();
      pendingOrder.notes = `Auto-fulfilled automatically upon warehouse arrival of PO ${po.poNumber}.`;

      // Log Sales Out Transaction
      addStockTransaction({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        type: 'SALES_OUT',
        quantity: -pendingOrder.quantity,
        previousStock: stockBeforeFulfill,
        newStock: product.currentStock,
        referenceType: 'SALES_ORDER',
        referenceId: pendingOrder.id,
        referenceNumber: pendingOrder.orderNumber,
        notes: `Automated fulfillment following receipt of PO ${po.poNumber}`,
      });

      // Record Sales Revenue
      recordSalesRevenue(
        pendingOrder.totalAmount,
        (product.unitPrice - product.costPrice) * pendingOrder.quantity,
        pendingOrder.quantity
      );

      // Audit log
      addAuditLog(
        'SYSTEM',
        'ERP Workflow Engine',
        'ADMIN',
        'AUTO_FULFILLMENT_SUCCESS',
        'Cross-Module Automation',
        `Sales Order ${pendingOrder.orderNumber} automatically fulfilled following delivery of PO ${po.poNumber}. Remaining stock: ${product.currentStock}`,
        pendingOrder.id
      );

      // Notify Sales Staff
      addNotification(
        ['SALES', 'ADMIN'],
        `Order ${pendingOrder.orderNumber} Automatically Fulfilled!`,
        `Goods for ${product.name} arrived from PO ${po.poNumber}. Order for ${pendingOrder.customerName} is now COMPLETE!`,
        'SUCCESS',
        'SALES',
        pendingOrder.id
      );

      autoFulfilledCount++;
    }
  }

  // Save all changes
  localStorage.setItem(KEYS.PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  localStorage.setItem(KEYS.SALES_ORDERS, JSON.stringify(salesOrders));

  // Audit log for PO receipt
  addAuditLog(
    currentUser.id,
    currentUser.name,
    currentUser.role,
    'GOODS_RECEIVED',
    'Inventory & Purchasing',
    `Received ${po.quantity} units of ${product.name} via ${po.poNumber}. Stock increased: ${previousStock} -> ${previousStock + po.quantity}.`,
    po.id
  );

  // Notifications
  addNotification(
    ['PURCHASE', 'MANAGER', 'ADMIN'],
    `Goods Received: ${po.poNumber}`,
    `${po.quantity}x ${product.name} successfully stocked into inventory from ${po.supplierName}.`,
    'SUCCESS',
    'PURCHASE',
    po.id
  );

  notifyListeners();

  const msg = autoFulfilledCount > 0
    ? `Goods received! Stock increased by ${po.quantity} units. Additionally, ${autoFulfilledCount} waiting Sales Order(s) were AUTOMATICALLY fulfilled!`
    : `Goods received! Stock increased by ${po.quantity} units. Product inventory updated.`;

  return {
    success: true,
    message: msg,
    autoFulfilledOrdersCount: autoFulfilledCount,
  };
}

// ----------------- FINANCIAL & INVENTORY METRICS -----------------

function recordSalesRevenue(revenue: number, profit: number, units: number) {
  const currentMonthIdx = new Date().getMonth();
  const metrics = getMonthlyMetrics();
  const metric = metrics[currentMonthIdx];
  if (metric) {
    metric.sales += revenue;
    metric.profit += profit;
    metric.unitsSold += units;
    metric.transactionCount += 1;
    // Loss is calculated if costs exceed sales
    metric.loss = Math.max(0, metric.stockPurchased - metric.sales);
    localStorage.setItem(KEYS.MONTHLY_METRICS, JSON.stringify(metrics));
  }
}

function recordStockPurchaseExpense(cost: number, units: number) {
  const currentMonthIdx = new Date().getMonth();
  const metrics = getMonthlyMetrics();
  const metric = metrics[currentMonthIdx];
  if (metric) {
    metric.stockPurchased += cost;
    metric.unitsPurchased += units;
    metric.transactionCount += 1;
    // Re-evaluate loss/profit
    metric.loss = Math.max(0, metric.stockPurchased - metric.sales);
    localStorage.setItem(KEYS.MONTHLY_METRICS, JSON.stringify(metrics));
  }
}

function addStockTransaction(txn: Omit<StockTransaction, 'id' | 'createdAt' | 'createdBy' | 'createdByName'>) {
  const currentUser = getCurrentUser();
  const transactions = getAllStockTransactions();
  const newTxn: StockTransaction = {
    ...txn,
    id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    createdBy: currentUser?.id || 'SYSTEM',
    createdByName: currentUser?.name || 'ERP Engine',
  };
  transactions.unshift(newTxn);
  localStorage.setItem(KEYS.STOCK_TRANSACTIONS, JSON.stringify(transactions));
}

export function addNotification(
  targetRoles: UserRole[],
  title: string,
  message: string,
  type: NotificationItem['type'],
  relatedModule: NotificationItem['relatedModule'],
  relatedEntityId?: string
) {
  const notifications = getAllNotifications();
  const newNotif: NotificationItem = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    targetRoles,
    title,
    message,
    type,
    relatedModule,
    relatedEntityId,
    createdAt: new Date().toISOString(),
    readBy: [],
  };
  notifications.unshift(newNotif);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function markNotificationAsRead(notifId: string) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const notifications = getAllNotifications();
  const notif = notifications.find((n) => n.id === notifId);
  if (notif && !notif.readBy.includes(currentUser.id)) {
    notif.readBy.push(currentUser.id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    notifyListeners();
  }
}

export function markAllNotificationsAsRead() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const notifications = getAllNotifications();
  const currentRole = normalizeRole(currentUser.role);
  notifications.forEach((n) => {
    const isTarget = n.targetRoles.some((tr) => normalizeRole(tr) === currentRole);
    if (isTarget && !n.readBy.includes(currentUser.id)) {
      n.readBy.push(currentUser.id);
    }
  });
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  notifyListeners();
}

export function addAuditLog(
  userId: string,
  userName: string,
  userRole: UserRole,
  action: string,
  module: string,
  details: string,
  entityId?: string
) {
  const logs = getAllAuditLogs();
  const newLog: AuditLogItem = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    action,
    module,
    details,
    entityId,
  };
  logs.unshift(newLog);
  // Keep last 300 logs
  if (logs.length > 300) logs.pop();
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

// Reset store to fresh initial state
export function resetDemoData() {
  localStorage.removeItem(KEYS.USERS);
  localStorage.removeItem(KEYS.PASSWORDS);
  localStorage.removeItem(KEYS.PRODUCTS);
  localStorage.removeItem(KEYS.CUSTOMERS);
  localStorage.removeItem(KEYS.SUPPLIERS);
  localStorage.removeItem(KEYS.SALES_ORDERS);
  localStorage.removeItem(KEYS.PURCHASE_REQUESTS);
  localStorage.removeItem(KEYS.PURCHASE_ORDERS);
  localStorage.removeItem(KEYS.STOCK_TRANSACTIONS);
  localStorage.removeItem(KEYS.MONTHLY_METRICS);
  localStorage.removeItem(KEYS.NOTIFICATIONS);
  localStorage.removeItem(KEYS.AUDIT_LOGS);
  initStore();
  notifyListeners();
}

// Convenience Aliases & Helpers for Cross-Module Components
export const subscribeStore = subscribeToStore;

export function approvePurchaseRequest(prId: string, note?: string) {
  return reviewPurchaseRequest(prId, true, note);
}

export function rejectPurchaseRequest(prId: string, reason: string) {
  return reviewPurchaseRequest(prId, false, reason);
}

export function createPurchaseOrderFromRequest(prId: string): { success: boolean; message: string } {
  const prs = getAllPurchaseRequests();
  const pr = prs.find((r) => r.id === prId);
  if (!pr) return { success: false, message: 'Purchase Request not found.' };

  const products = getAllProducts();
  const product = products.find((p) => p.id === pr.productId);
  if (!product) return { success: false, message: 'Linked product not found.' };

  const suppliers = getAllSuppliers();
  const supplier = suppliers.find((s) => s.id === pr.suggestedSupplierId) || suppliers[0];

  const deliveryDate = new Date(Date.now() + (supplier.leadTimeDays || 3) * 86400000)
    .toISOString()
    .split('T')[0];

  const res = createPurchaseOrder({
    purchaseRequestId: pr.id,
    productId: product.id,
    supplierId: supplier.id,
    quantity: pr.requestedQuantity,
    unitCost: product.costPrice,
    expectedDeliveryDate: deliveryDate,
    notes: `Derived automatically from approved request ${pr.prNumber}.`,
  });

  return { success: res.success, message: res.message };
}

export function createPurchaseOrderManual(input: {
  supplierId: string;
  productId: string;
  quantity: number;
  expectedDeliveryDays?: number;
}): { success: boolean; message: string } {
  const products = getAllProducts();
  const product = products.find((p) => p.id === input.productId);
  if (!product) return { success: false, message: 'Product not found.' };

  const suppliers = getAllSuppliers();
  const supplier = suppliers.find((s) => s.id === input.supplierId);
  if (!supplier) return { success: false, message: 'Supplier not found.' };

  const days = input.expectedDeliveryDays || supplier.leadTimeDays || 3;
  const deliveryDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

  const res = createPurchaseOrder({
    productId: product.id,
    supplierId: supplier.id,
    quantity: input.quantity,
    unitCost: product.costPrice,
    expectedDeliveryDate: deliveryDate,
    notes: 'Direct purchase order issued by Purchase Staff.',
  });

  return { success: res.success, message: res.message };
}
