import { 
  suppliers, inventory, products, categories, customers, orders, orderItems, productOptions, adminUsers,
  type Supplier, type InsertSupplier,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Inventory, type InsertInventory,
  type Customer, type InsertCustomer,
  type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem,
  type ProductOption, type InsertProductOption,
  type AdminUser, type InsertAdminUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(insertSupplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(insertCategory: InsertCategory): Promise<Category>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductsInStock(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Inventory
  getInventoryByProduct(productId: string): Promise<Inventory[]>;
  getInventoryBySupplier(supplierId: string): Promise<Inventory[]>;
  updateInventory(productId: string, supplierId: string, updates: Partial<InsertInventory>): Promise<Inventory | undefined>;
  createInventory(insertInventory: InsertInventory): Promise<Inventory>;
  
  // Product Options
  getProductOptions(productId: string): Promise<ProductOption[]>;
  createProductOption(insertOption: InsertProductOption): Promise<ProductOption>;
  
  // Customers
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(insertCustomer: InsertCustomer): Promise<Customer>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(insertOrder: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Admin Users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser>;
}

export class MemStorage implements IStorage {
  private suppliers = new Map<string, Supplier>();
  private categories = new Map<string, Category>();
  private products = new Map<string, Product>();
  private inventory = new Map<string, Inventory>();
  private productOptions = new Map<string, ProductOption>();
  private customers = new Map<string, Customer>();
  private orders = new Map<string, Order>();
  private orderItems = new Map<string, OrderItem>();
  private adminUsers = new Map<string, AdminUser>();

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const supplier: Supplier = {
      id,
      ...insertSupplier,
      isActive: insertSupplier.isActive ?? true,
      contactPerson: insertSupplier.contactPerson ?? null,
      country: insertSupplier.country ?? "China",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updates: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;
    
    const updated: Supplier = {
      ...supplier,
      ...updates,
      updatedAt: new Date(),
    };
    this.suppliers.set(id, updated);
    return updated;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      id,
      ...insertCategory,
      description: insertCategory.description ?? null,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsInStock(): Promise<Product[]> {
    const inStockProductIds = Array.from(this.inventory.values())
      .filter(inv => inv.stockLevel > 0)
      .map(inv => inv.productId);
    
    return Array.from(this.products.values()).filter(p => 
      p.isActive && inStockProductIds.includes(p.id)
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => 
      p.categoryId === categoryId && p.isActive
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      ...insertProduct,
      description: insertProduct.description ?? null,
      dimensions: insertProduct.dimensions ?? null,
      materials: insertProduct.materials ?? null,
      features: insertProduct.features ?? null,
      images: insertProduct.images ?? null,
      isActive: insertProduct.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated: Product = {
      ...product,
      ...updates,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  // Inventory
  async getInventoryByProduct(productId: string): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(inv => inv.productId === productId);
  }

  async getInventoryBySupplier(supplierId: string): Promise<Inventory[]> {
    return Array.from(this.inventory.values()).filter(inv => inv.supplierId === supplierId);
  }

  async updateInventory(productId: string, supplierId: string, updates: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const inventoryItem = Array.from(this.inventory.values()).find(inv => 
      inv.productId === productId && inv.supplierId === supplierId
    );
    if (!inventoryItem) return undefined;
    
    const updated: Inventory = {
      ...inventoryItem,
      ...updates,
      lastUpdated: new Date(),
    };
    this.inventory.set(inventoryItem.id, updated);
    return updated;
  }

  async createInventory(insertInventory: InsertInventory): Promise<Inventory> {
    const id = randomUUID();
    const inventory: Inventory = {
      id,
      ...insertInventory,
      stockLevel: insertInventory.stockLevel ?? 0,
      estimatedShippingDays: insertInventory.estimatedShippingDays ?? null,
      lastUpdated: new Date(),
    };
    this.inventory.set(id, inventory);
    return inventory;
  }

  // Product Options
  async getProductOptions(productId: string): Promise<ProductOption[]> {
    return Array.from(this.productOptions.values()).filter(opt => opt.productId === productId);
  }

  async createProductOption(insertOption: InsertProductOption): Promise<ProductOption> {
    const id = randomUUID();
    const option: ProductOption = {
      id,
      ...insertOption,
      description: insertOption.description ?? null,
      additionalPrice: insertOption.additionalPrice ?? "0",
      isRequired: insertOption.isRequired ?? false,
      options: insertOption.options ?? null,
      createdAt: new Date(),
    };
    this.productOptions.set(id, option);
    return option;
  }

  // Customers
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(c => c.email === email);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      id,
      ...insertCustomer,
      phone: insertCustomer.phone ?? null,
      shippingAddress: insertCustomer.shippingAddress ?? null,
      createdAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const order: Order = {
      id,
      orderNumber,
      ...insertOrder,
      status: insertOrder.status ?? "pending",
      shippingCost: insertOrder.shippingCost ?? "0",
      vatAmount: insertOrder.vatAmount ?? "0",
      importDuty: insertOrder.importDuty ?? "0",
      paymentStatus: insertOrder.paymentStatus ?? "pending",
      paymentId: insertOrder.paymentId ?? null,
      trackingNumber: insertOrder.trackingNumber ?? null,
      estimatedDelivery: insertOrder.estimatedDelivery ?? null,
      notes: insertOrder.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated: Order = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    this.orders.set(id, updated);
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = {
      id,
      ...insertOrderItem,
      quantity: insertOrderItem.quantity ?? 1,
      selectedOptions: insertOrderItem.selectedOptions ?? null,
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Admin Users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(u => u.email === email);
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const adminUser: AdminUser = {
      id,
      ...insertAdminUser,
      role: insertAdminUser.role ?? "admin",
      isActive: insertAdminUser.isActive ?? true,
      createdAt: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }
}

export const storage = new MemStorage();