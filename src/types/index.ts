export enum UserRole {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER',
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
  BARISTA = 'BARISTA',
}

export enum TableStatus {
  EMPTY = 'EMPTY',
  ORDERED = 'ORDERED',
  WAITING_BILL = 'WAITING_BILL',
  RESERVED = 'RESERVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SERVED = 'SERVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export enum InventoryMovementType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  WASTE = 'WASTE',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  products?: Product[]
}

export interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  costPrice: number
  barcode?: string | null
  sku?: string | null
  categoryId: string
  imageUrl?: string | null
  isActive: boolean
  stockQuantity: number
  minStockLevel: number
  preparationTime?: number | null
  createdAt: Date
  updatedAt: Date
  category?: Category
  orderItems?: OrderItem[]
  inventoryMovements?: InventoryMovement[]
  recipeIngredients?: RecipeIngredient[]
}

export interface Table {
  id: string
  number: number
  capacity: number
  status: TableStatus
  location?: string | null
  qrCode?: string | null
  createdAt: Date
  updatedAt: Date
  orders?: Order[]
  reservations?: Reservation[]
}

export interface Order {
  id: string
  orderNumber: string
  tableId?: string | null
  orderType: OrderType
  status: OrderStatus
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  notes?: string | null
  cashierId?: string | null
  waiterId?: string | null
  createdAt: Date
  updatedAt: Date
  completedAt?: Date | null
  table?: Table | null
  cashier?: User | null
  waiter?: User | null
  items?: OrderItem[]
  payments?: Payment[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  totalPrice: number
  discountAmount: number
  notes?: string | null
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
  order?: Order
  product?: Product
}

export interface Payment {
  id: string
  orderId: string
  method: PaymentMethod
  amount: number
  reference?: string | null
  receivedById?: string | null
  createdAt: Date
  order?: Order
  receivedBy?: User | null
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string | null
  address?: string | null
  loyaltyPoints: number
  totalVisits: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
  orders?: Order[]
  reservations?: Reservation[]
}

export interface Reservation {
  id: string
  customerId: string
  tableId?: string | null
  date: Date
  time: Date
  partySize: number
  status: ReservationStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  customer?: Customer
  table?: Table | null
}

export interface InventoryMovement {
  id: string
  productId: string
  type: InventoryMovementType
  quantity: number
  unitCost: number
  totalCost: number
  notes?: string | null
  performedById?: string | null
  createdAt: Date
  product?: Product
  performedBy?: User | null
}

export interface RecipeIngredient {
  id: string
  productId: string
  ingredientId: string
  quantity: number
  unit: string
  createdAt: Date
  product?: Product
  ingredient?: Product
}

export interface Discount {
  id: string
  code: string
  description: string
  type: DiscountType
  value: number
  minOrderAmount?: number | null
  maxDiscountAmount?: number | null
  startDate: Date
  endDate: Date
  isActive: boolean
  usageLimit?: number | null
  usedCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId?: string | null
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: Date
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  activeTables: number
  pendingOrders: number
  revenueByCategory: { category: string; revenue: number }[]
  ordersByHour: { hour: number; count: number }[]
  topProducts: { product: string; quantity: number; revenue: number }[]
}

export interface SocketEvents {
  'order:created': (order: Order) => void
  'order:updated': (order: Order) => void
  'order:status-changed': (data: { orderId: string; status: OrderStatus }) => void
  'table:updated': (table: Table) => void
  'notification': (notification: Notification) => void
  'kitchen:new-order': (order: Order) => void
  'barista:new-order': (order: Order) => void
}
