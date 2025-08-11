import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertClientSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res, next) => {
    try {
      const submission = insertContactSubmissionSchema.parse(req.body);
      const result = await storage.createContactSubmission(submission);
      res.json({ success: true, id: result.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact-submissions", async (req, res, next) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  });

  // Client management routes
  app.post("/api/clients", async (req, res, next) => {
    try {
      const client = insertClientSchema.parse(req.body);
      const result = await storage.createClient(client);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid client data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  app.get("/api/clients", async (req, res, next) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/clients/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = insertClientSchema.partial().parse(req.body);
      const result = await storage.updateClient(id, updateData);
      if (!result) {
        res.status(404).json({ success: false, message: "Client not found" });
        return;
      }
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid client data", 
          errors: error.errors 
        });
      } else {
        next(error);
      }
    }
  });

  app.delete("/api/clients/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteClient(id);
      if (!success) {
        res.status(404).json({ success: false, message: "Client not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
