import { type User, type InsertUser, type ContactSubmission, type InsertContactSubmission, type Client, type InsertClient, type Prospect, type InsertProspect, type Interaction, type InsertInteraction } from "@shared/schema";
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
  // CRM methods
  createProspect(insertProspect: InsertProspect): Promise<Prospect>;
  getProspects(): Promise<Prospect[]>;
  updateProspect(id: string, updateData: Partial<InsertProspect>): Promise<Prospect | undefined>;
  deleteProspect(id: string): Promise<boolean>;
  createInteraction(insertInteraction: InsertInteraction): Promise<Interaction>;
  getInteractionsByProspect(prospectId: string): Promise<Interaction[]>;
  getAllInteractions(): Promise<Interaction[]>;
  updateInteraction(id: string, updateData: Partial<InsertInteraction>): Promise<Interaction | undefined>;
  deleteInteraction(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private clients: Map<string, Client>;
  private prospects: Map<string, Prospect>;
  private interactions: Map<string, Interaction>;

  constructor() {
    this.users = new Map();
    this.contactSubmissions = new Map();
    this.clients = new Map();
    this.prospects = new Map();
    this.interactions = new Map();
    
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

    // Sample prospects
    const sampleProspects = [
      {
        id: "prospect-1",
        submissionId: "sub-1",
        name: "Sarah Johnson",
        email: "sarah@innovatetech.co.uk",
        company: "InnovateTech Ltd",
        status: "qualified",
        priority: "high",
        source: "consultation_form",
        nextFollowUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        assignedTo: "admin",
        notes: "Very promising tech startup. Ready to move forward with startup package.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: "prospect-2",
        submissionId: "sub-2",
        name: "Marcus Thompson", 
        email: "marcus@greenventures.co.uk",
        company: "Green Ventures",
        status: "contacted",
        priority: "medium",
        source: "consultation_form",
        nextFollowUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        assignedTo: "admin",
        notes: "Interested in growth package. Sustainable products business with good revenue.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      }
    ];

    // Sample interactions
    const sampleInteractions = [
      {
        id: "int-1",
        prospectId: "prospect-1",
        type: "call",
        subject: "Initial Discovery Call",
        content: "45-minute discovery call with Sarah. Discussed startup vision, current challenges, and how our services can help. Very engaged and interested in moving forward.",
        outcome: "positive",
        nextAction: "Send proposal with startup package details",
        nextActionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: "admin",
      },
      {
        id: "int-2",
        prospectId: "prospect-2",
        type: "email",
        subject: "Follow-up on growth package inquiry",
        content: "Sent detailed information about growth accelerator package. Included case studies and pricing structure.",
        outcome: "follow_up_needed",
        nextAction: "Schedule call to discuss proposal",
        nextActionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        createdBy: "admin",
      }
    ];

    sampleProspects.forEach(prospect => {
      this.prospects.set(prospect.id, prospect as Prospect);
    });

    sampleInteractions.forEach(interaction => {
      this.interactions.set(interaction.id, interaction as Interaction);
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

  // CRM Methods
  async createProspect(insertProspect: InsertProspect): Promise<Prospect> {
    const id = randomUUID();
    const now = new Date();
    const prospect: Prospect = {
      ...insertProspect,
      status: insertProspect.status || "new",
      priority: insertProspect.priority || "medium",
      source: insertProspect.source || "consultation_form",
      submissionId: insertProspect.submissionId || null,
      company: insertProspect.company || null,
      nextFollowUpDate: insertProspect.nextFollowUpDate || null,
      assignedTo: insertProspect.assignedTo || null,
      notes: insertProspect.notes || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.prospects.set(id, prospect);
    return prospect;
  }

  async getProspects(): Promise<Prospect[]> {
    return Array.from(this.prospects.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateProspect(id: string, updateData: Partial<InsertProspect>): Promise<Prospect | undefined> {
    const prospect = this.prospects.get(id);
    if (!prospect) return undefined;
    
    const updatedProspect: Prospect = {
      ...prospect,
      ...updateData,
      updatedAt: new Date(),
    };
    this.prospects.set(id, updatedProspect);
    return updatedProspect;
  }

  async deleteProspect(id: string): Promise<boolean> {
    return this.prospects.delete(id);
  }

  async createInteraction(insertInteraction: InsertInteraction): Promise<Interaction> {
    const id = randomUUID();
    const interaction: Interaction = {
      ...insertInteraction,
      prospectId: insertInteraction.prospectId || null,
      subject: insertInteraction.subject || null,
      outcome: insertInteraction.outcome || null,
      nextAction: insertInteraction.nextAction || null,
      nextActionDate: insertInteraction.nextActionDate || null,
      createdBy: insertInteraction.createdBy || "admin",
      id,
      createdAt: new Date(),
    };
    this.interactions.set(id, interaction);
    return interaction;
  }

  async getInteractionsByProspect(prospectId: string): Promise<Interaction[]> {
    return Array.from(this.interactions.values())
      .filter(interaction => interaction.prospectId === prospectId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllInteractions(): Promise<Interaction[]> {
    return Array.from(this.interactions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateInteraction(id: string, updateData: Partial<InsertInteraction>): Promise<Interaction | undefined> {
    const interaction = this.interactions.get(id);
    if (!interaction) return undefined;
    
    const updatedInteraction: Interaction = {
      ...interaction,
      ...updateData,
    };
    this.interactions.set(id, updatedInteraction);
    return updatedInteraction;
  }

  async deleteInteraction(id: string): Promise<boolean> {
    return this.interactions.delete(id);
  }
}

export const storage = new MemStorage();
