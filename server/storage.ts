import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type Client, type InsertClient } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  createClient(insertClient: InsertClient): Promise<Client>;
  getClients(): Promise<Client[]>;
  updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private clients: Map<string, Client>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.clients = new Map();
    
    // Add sample data for demonstration
    this.seedSampleData();
  }

  private seedSampleData() {
    // Sample consultation submissions
    const sampleSubmissions = [
      {
        id: "sub-1",
        name: "Sarah Johnson",
        email: "sarah@innovatetech.co.uk",
        message: "Looking for help with my tech startup launch strategy. Need guidance on market entry and funding approaches.",
        package: "startup",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: "sub-2", 
        name: "Marcus Thompson",
        email: "marcus@greenventures.co.uk",
        message: "Interested in growth acceleration for my sustainable products business. Currently at £50k revenue.",
        package: "growth",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: "sub-3",
        name: "Emma Williams",
        email: "emma@creativestudio.co.uk", 
        message: "Need ongoing support for scaling my creative agency. Looking for operational optimization.",
        package: "ongoing",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    // Sample active clients
    const sampleClients = [
      {
        id: "client-1",
        name: "David Chen",
        email: "david@fintech-solutions.co.uk",
        company: "FinTech Solutions Ltd",
        currentPackage: "startup",
        packageStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        monthlyValue: "£2,500",
        status: "active",
        notes: "Focused on regulatory compliance and investor readiness. Strong technical team.",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: "client-2",
        name: "Rachel Martinez",
        email: "rachel@healthapp.co.uk",
        company: "HealthApp Innovations",
        currentPackage: "growth",
        packageStartDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        monthlyValue: "£4,000",
        status: "active",
        notes: "Scaling health tech platform. Focus on user acquisition and retention strategies.",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: "client-3",
        name: "James Wilson",
        email: "james@eco-logistics.co.uk",
        company: "Eco Logistics",
        currentPackage: "ongoing",
        packageStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        monthlyValue: "£1,800",
        status: "active",
        notes: "Monthly strategic reviews and operational optimization. Sustainable supply chain focus.",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    // Populate maps
    sampleSubmissions.forEach(submission => {
      this.contactSubmissions.set(submission.id, submission as ContactSubmission);
    });

    sampleClients.forEach(client => {
      this.clients.set(client.id, client as Client);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const contactSubmission: ContactSubmission = {
      ...submission,
      package: submission.package || null,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, contactSubmission);
    return contactSubmission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const client: Client = {
      ...insertClient,
      status: insertClient.status || "active",
      company: insertClient.company || null,
      currentPackage: insertClient.currentPackage || null,
      packageStartDate: insertClient.packageStartDate || null,
      monthlyValue: insertClient.monthlyValue || null,
      notes: insertClient.notes || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.clients.set(id, client);
    return client;
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient: Client = {
      ...client,
      ...updateData,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }
}

export const storage = new MemStorage();
