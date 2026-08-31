import { ApiFetcherParams } from "../types/api.types";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface EnterpriseOrder {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    tier: "VIP Platinum" | "Gold" | "Silver" | "Standard";
  };
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  currency: string;
  paymentMethod: "Credit Card (Visa)" | "Mastercard" | "Vodafone Cash" | "Cash on Delivery" | "InstaPay";
  paymentStatus: "Paid" | "Pending" | "Refunded" | "Failed";
  fulfillmentStatus: "Delivered" | "In Transit" | "Processing" | "Out for Delivery" | "Cancelled";
  carrier: "Aramex Express" | "DHL Priority" | "Bosta Logistics" | "FedEx Cargo";
  shippingAddress: {
    city: string;
    governorate: string;
    street: string;
  };
  isExpressShipping: boolean;
  isPriorityHandling: boolean;
  isVerified: boolean;
  notes?: string;
  createdAt: string;
  estimatedDelivery: string;
}

const CUSTOMER_NAMES = [
  { name: "Kareem Elbalshe", email: "kareem@elbalshy.dev", tier: "VIP Platinum" },
  { name: "Ahmed Mansour", email: "ahmed.m@techcorp.com", tier: "Gold" },
  { name: "Sara El-Sayed", email: "sara.sayed@fashionhub.eg", tier: "VIP Platinum" },
  { name: "Omar Khaled", email: "omar.khaled@innovate.io", tier: "Silver" },
  { name: "Nouran Khalil", email: "nouran.k@designstudio.com", tier: "Gold" },
  { name: "Mohamed Hassan", email: "m.hassan@logistics.net", tier: "Standard" },
  { name: "Youssef Salem", email: "youssef.salem@ventures.eg", tier: "VIP Platinum" },
  { name: "Layla Ibrahim", email: "layla.ibrahim@retail.com", tier: "Gold" },
  { name: "Hassan Fawzy", email: "hassan.f@cairotech.org", tier: "Standard" },
  { name: "Zainab Kamal", email: "zainab.kamal@ecom.eg", tier: "Silver" },
  { name: "Tarek Shalaby", email: "tarek.shalaby@global.com", tier: "Standard" },
  { name: "Fatima Zaki", email: "fatima.zaki@healthplus.eg", tier: "Gold" },
];

const PRODUCTS_POOL = [
  { name: "MacBook Pro M3 16\"", price: 85000 },
  { name: "Dell XPS 15 OLED", price: 62000 },
  { name: "iPhone 16 Pro Max 512GB", price: 68000 },
  { name: "Sony WH-1000XM5 Headphones", price: 16500 },
  { name: "LG UltraFine 4K 27\" Monitor", price: 21000 },
  { name: "Keychron Q3 Pro Wireless Mechanical Keyboard", price: 8200 },
  { name: "Logitech MX Master 3S Mouse", price: 4800 },
  { name: "Samsung Galaxy S24 Ultra", price: 54000 },
  { name: "Apple Watch Ultra 2", price: 34000 },
  { name: "Anker Prime 200W Power Bank", price: 6500 },
];

const CITIES_EG = [
  { city: "New Cairo", governorate: "Cairo" },
  { city: "Sheikh Zayed", governorate: "Giza" },
  { city: "Maadi", governorate: "Cairo" },
  { city: "Sidi Gaber", governorate: "Alexandria" },
  { city: "Smouha", governorate: "Alexandria" },
  { city: "Dokki", governorate: "Giza" },
  { city: "Nasr City", governorate: "Cairo" },
  { city: "El Gouna", governorate: "Red Sea" },
  { city: "Mansoura City", governorate: "Dakahlia" },
  { city: "Tanta Center", governorate: "Gharbia" },
];

const CARRIERS = ["Aramex Express", "DHL Priority", "Bosta Logistics", "FedEx Cargo"] as const;
const PAYMENT_METHODS = ["Credit Card (Visa)", "Mastercard", "Vodafone Cash", "Cash on Delivery", "InstaPay"] as const;
const PAYMENT_STATUSES = ["Paid", "Pending", "Paid", "Paid", "Refunded", "Failed"] as const;
const FULFILLMENT_STATUSES = ["Delivered", "In Transit", "Processing", "Out for Delivery", "Delivered"] as const;

// Generate 120 rich, realistic enterprise orders
export const REAL_WORLD_ORDERS_DB: EnterpriseOrder[] = Array.from({ length: 120 }).map((_, idx) => {
  const cust = CUSTOMER_NAMES[idx % CUSTOMER_NAMES.length];
  const location = CITIES_EG[idx % CITIES_EG.length];
  const orderNum = `ORD-${(9800 + idx).toString()}`;
  
  // Pick 1 to 3 random products for this order
  const itemCount = (idx % 3) + 1;
  const items: OrderItem[] = Array.from({ length: itemCount }).map((__, pIdx) => {
    const prod = PRODUCTS_POOL[(idx + pIdx * 2) % PRODUCTS_POOL.length];
    const qty = (pIdx % 2) + 1;
    return {
      id: `ITEM-${idx}-${pIdx}`,
      name: prod.name,
      quantity: qty,
      unitPrice: prod.price,
    };
  });

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const tax = Math.round(subtotal * 0.14); // 14% VAT in Egypt
  const shippingFee = idx % 4 === 0 ? 0 : 250;
  const totalAmount = subtotal + tax + shippingFee;

  const paymentStatus = PAYMENT_STATUSES[idx % PAYMENT_STATUSES.length];
  const fulfillmentStatus = paymentStatus === "Failed" || paymentStatus === "Refunded" 
    ? "Cancelled" 
    : FULFILLMENT_STATUSES[idx % FULFILLMENT_STATUSES.length];

  const isExpress = idx % 3 === 0;
  const isPriority = cust.tier === "VIP Platinum" || totalAmount > 70000;
  const createdAt = new Date(Date.now() - idx * 3600000 * 5.5).toISOString();
  const deliveryDate = new Date(Date.now() + (idx % 4 + 1) * 86400000).toISOString();

  return {
    id: `ord_${idx + 100}`,
    orderNumber: orderNum,
    customer: {
      name: cust.name,
      email: cust.email,
      phone: `+20 10${Math.floor(10000000 + Math.random() * 89999999)}`,
      avatar: `https://i.pravatar.cc/150?u=${cust.name.replace(/\s+/g, "")}${idx % 8}`,
      tier: cust.tier as any,
    },
    items,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal,
    tax,
    shippingFee,
    totalAmount,
    currency: "EGP",
    paymentMethod: PAYMENT_METHODS[idx % PAYMENT_METHODS.length],
    paymentStatus: paymentStatus as any,
    fulfillmentStatus: fulfillmentStatus as any,
    carrier: CARRIERS[idx % CARRIERS.length],
    shippingAddress: {
      city: location.city,
      governorate: location.governorate,
      street: `Villa ${idx * 4 + 12}, Street ${(idx % 15) + 1}, District ${Math.floor(idx / 10) + 1}`,
    },
    isExpressShipping: isExpress,
    isPriorityHandling: isPriority,
    isVerified: idx % 11 !== 0,
    notes: idx % 5 === 0 ? "Call before arrival. Security gate code: #4092" : undefined,
    createdAt,
    estimatedDelivery: deliveryDate,
  };
});

/**
 * Real-world remote API simulator for Enterprise Orders
 */
export async function fetchEnterpriseOrdersApi(
  params: ApiFetcherParams,
  signal?: AbortSignal
): Promise<any> {
  // Simulate network latency (200ms)
  await new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 220);
    if (signal) {
      signal.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      });
    }
  });

  let results = [...REAL_WORLD_ORDERS_DB];

  // 1. Search Query across multiple fields
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    results = results.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q) ||
        o.carrier.toLowerCase().includes(q) ||
        o.paymentMethod.toLowerCase().includes(q) ||
        o.items.some((item) => item.name.toLowerCase().includes(q))
    );
  }

  // 2. Extra Filter Param (e.g. status filter)
  if (params.fulfillmentStatus) {
    results = results.filter((o) => o.fulfillmentStatus === params.fulfillmentStatus);
  }
  if (params.tier) {
    results = results.filter((o) => o.customer.tier === params.tier);
  }

  // 3. Sorting
  if (params.sortBy && params.sortOrder) {
    const sortField = params.sortBy;
    const isDesc = params.sortOrder === "desc";
    results.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField.includes(".")) {
        const parts = sortField.split(".");
        valA = parts.reduce((o, k) => o?.[k], a);
        valB = parts.reduce((o, k) => o?.[k], b);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return isDesc ? valB - valA : valA - valB;
      }
      return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
    });
  }

  // 4. Pagination
  const total = results.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const items = results.slice(startIndex, startIndex + pageSize);

  return {
    data: items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
