import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertSupplierSchema,
  insertCustomerSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertInventorySchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res, next) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/categories", async (req, res, next) => {
    try {
      const category = insertCategorySchema.parse(req.body);
      const result = await storage.createCategory(category);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid category data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  // Products
  app.get("/api/products", async (req, res, next) => {
    try {
      const { inStock, categoryId } = req.query;
      let products;
      
      if (inStock === 'true') {
        products = await storage.getProductsInStock();
      } else if (categoryId) {
        products = await storage.getProductsByCategory(categoryId as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id/options", async (req, res, next) => {
    try {
      const options = await storage.getProductOptions(req.params.id);
      res.json(options);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id/inventory", async (req, res, next) => {
    try {
      const inventory = await storage.getInventoryByProduct(req.params.id);
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res, next) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      next(error);
    }
  });

  // Orders
  app.post("/api/orders", async (req, res, next) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid order data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  app.get("/api/orders", async (req, res, next) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", async (req, res, next) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/orders/:id/status", async (req, res, next) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  // Customers
  app.post("/api/customers", async (req, res, next) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid customer data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
