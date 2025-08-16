import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertClientSchema, insertProspectSchema, insertInteractionSchema } from "@shared/schema";
import { z } from "zod";
import { sendConsultationNotification, testEmailConnection } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res, next) => {
    try {
      const submission = insertContactSubmissionSchema.parse(req.body);
      const result = await storage.createContactSubmission(submission);
      
      // Send email notification (don't block response if email fails)
      sendConsultationNotification(result).catch(error => {
        console.error('❌ Email notification failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
      });
      
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

  // Test email endpoint (for admin testing)
  app.post("/api/test-email", async (req, res, next) => {
    try {
      const isConnected = await testEmailConnection();
      if (isConnected) {
        // Send a test email
        const testSubmission = {
          id: "test-" + Date.now(),
          name: "Test User",
          email: "test@example.com",
          message: "This is a test email to verify your notification system is working correctly.",
          package: "startup",
          createdAt: new Date()
        };
        
        const emailSent = await sendConsultationNotification(testSubmission);
        res.json({ 
          success: emailSent, 
          message: emailSent ? "Test email sent successfully!" : "Email connection works but sending failed"
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Email connection failed. Check your Gmail credentials." 
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // CRM Routes
  app.post("/api/prospects", async (req, res, next) => {
    try {
      const prospect = insertProspectSchema.parse(req.body);
      const result = await storage.createProspect(prospect);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid prospect data", errors: error.errors });
      } else {
        next(error);
      }
    }
  });

  app.get("/api/prospects", async (req, res, next) => {
    try {
      const prospects = await storage.getProspects();
      res.json(prospects);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/prospects/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = insertProspectSchema.partial().parse(req.body);
      const result = await storage.updateProspect(id, updateData);
      if (!result) {
        res.status(404).json({ success: false, message: "Prospect not found" });
        return;
      }
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid prospect data", errors: error.errors });
      } else {
        next(error);
      }
    }
  });

  app.post("/api/interactions", async (req, res, next) => {
    try {
      const interaction = insertInteractionSchema.parse(req.body);
      const result = await storage.createInteraction(interaction);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid interaction data", errors: error.errors });
      } else {
        next(error);
      }
    }
  });

  app.get("/api/interactions", async (req, res, next) => {
    try {
      const interactions = await storage.getAllInteractions();
      res.json(interactions);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/prospects/:id/interactions", async (req, res, next) => {
    try {
      const { id } = req.params;
      const interactions = await storage.getInteractionsByProspect(id);
      res.json(interactions);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
