import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus, 
  Mail, 
  UserPlus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContactSubmission, Client, Prospect, Interaction } from "@shared/schema";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  currentPackage: z.string().optional(),
  packageStartDate: z.string().optional(),
  monthlyValue: z.string().optional(),
  status: z.enum(["active", "paused", "completed"]).default("active"),
  notes: z.string().optional(),
});

const prospectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "meeting_scheduled", "proposal_sent", "converted", "rejected"]).default("new"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  nextFollowUpDate: z.string().optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

const interactionSchema = z.object({
  prospectId: z.string().min(1, "Prospect is required"),
  type: z.enum(["call", "email", "meeting", "note"]),
  subject: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  outcome: z.enum(["positive", "negative", "neutral", "follow_up_needed"]).optional(),
  nextAction: z.string().optional(),
  nextActionDate: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;
type ProspectFormData = z.infer<typeof prospectSchema>;
type InteractionFormData = z.infer<typeof interactionSchema>;

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProspectDialogOpen, setIsProspectDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isSubmissionDetailOpen, setIsSubmissionDetailOpen] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      currentPackage: "",
      monthlyValue: "",
      status: "active",
      notes: "",
    },
  });

  const prospectForm = useForm<ProspectFormData>({
    resolver: zodResolver(prospectSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      status: "new",
      priority: "medium",
      notes: "",
    },
  });

  const interactionForm = useForm<InteractionFormData>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      prospectId: "",
      type: "call",
      content: "",
    },
  });

  // Fetch submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/contact-submissions"],
  });

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
  });

  // Fetch prospects
  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  // Fetch interactions
  const { data: interactions = [] } = useQuery<Interaction[]>({
    queryKey: ["/api/interactions"],
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: (data: ClientFormData) => 
      apiRequest("/api/clients", "POST", { 
        ...data, 
        packageStartDate: data.packageStartDate ? new Date(data.packageStartDate).toISOString() : null 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Client created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create client", variant: "destructive" });
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientFormData }) =>
      apiRequest(`/api/clients/${id}`, "PUT", { 
        ...data, 
        packageStartDate: data.packageStartDate ? new Date(data.packageStartDate).toISOString() : null 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setIsDialogOpen(false);
      setSelectedClient(null);
      form.reset();
      toast({ title: "Client updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update client", variant: "destructive" });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/clients/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({ title: "Client deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete client", variant: "destructive" });
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/test-email", {}),
    onSuccess: (data) => {
      toast({ 
        title: data.success ? "Test email sent!" : "Email test failed", 
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    },
    onError: () => {
      toast({ title: "Email test failed", variant: "destructive" });
    },
  });

  // Convert submission to client mutation
  const convertToClientMutation = useMutation({
    mutationFn: (submission: ContactSubmission) =>
      apiRequest("POST", "/api/clients", {
        name: submission.name,
        email: submission.email,
        company: "",
        currentPackage: submission.package || "startup",
        packageStartDate: new Date().toISOString(),
        monthlyValue: getDefaultPriceForPackage(submission.package || "startup"),
        status: "active",
        notes: `Converted from consultation submission on ${new Date().toLocaleDateString()}. Original message: ${submission.message.substring(0, 200)}...`
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-submissions"] });
      toast({ 
        title: "Client created successfully!", 
        description: "Consultation submission converted to active client."
      });
    },
    onError: () => {
      toast({ title: "Failed to create client", variant: "destructive" });
    },
  });

  const getDefaultPriceForPackage = (packageType: string) => {
    switch (packageType) {
      case "startup": return "£750";
      case "growth": return "£2,000";
      case "ongoing": return "£1,500";
      default: return "£750";
    }
  };

  // Convert submission to prospect
  const convertToProspectMutation = useMutation({
    mutationFn: (submission: ContactSubmission) =>
      apiRequest("POST", "/api/prospects", {
        submissionId: submission.id,
        name: submission.name,
        email: submission.email,
        company: "",
        status: "new",
        priority: "medium",
        source: "consultation_form",
        notes: `Original inquiry: ${submission.message.substring(0, 200)}...`
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      toast({ title: "Prospect created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create prospect", variant: "destructive" });
    },
  });

  // Create/update prospect
  const prospectMutation = useMutation({
    mutationFn: (data: ProspectFormData) => {
      if (selectedProspect) {
        return apiRequest("PUT", `/api/prospects/${selectedProspect.id}`, data);
      } else {
        return apiRequest("POST", "/api/prospects", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospects"] });
      setIsProspectDialogOpen(false);
      setSelectedProspect(null);
      prospectForm.reset();
      toast({ title: selectedProspect ? "Prospect updated!" : "Prospect created!" });
    },
    onError: () => {
      toast({ title: "Operation failed", variant: "destructive" });
    },
  });

  // Add interaction
  const interactionMutation = useMutation({
    mutationFn: (data: InteractionFormData) =>
      apiRequest("POST", "/api/interactions", {
        ...data,
        nextActionDate: data.nextActionDate ? new Date(data.nextActionDate).toISOString() : null
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/interactions"] });
      setIsInteractionDialogOpen(false);
      interactionForm.reset();
      toast({ title: "Interaction logged successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to log interaction", variant: "destructive" });
    },
  });

  // Check if a submission has already been converted to a client
  const isAlreadyClient = (submissionEmail: string) => {
    return clients.some((client: Client) => client.email === submissionEmail);
  };

  // Check if submission is already a prospect
  const isAlreadyProspect = (email: string) => {
    return prospects.some(prospect => prospect.email === email);
  };

  // Get interactions for a specific prospect
  const getProspectInteractions = (prospectId: string) => {
    return interactions.filter(interaction => interaction.prospectId === prospectId);
  };

  // Helper functions
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "secondary";
      case "contacted": return "outline";
      case "qualified": return "default";
      case "meeting_scheduled": return "default";
      case "proposal_sent": return "default";
      case "converted": return "default";
      case "rejected": return "destructive";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "call": return <Phone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "meeting": return <Calendar className="h-4 w-4" />;
      case "note": return <FileText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const onSubmit = (data: ClientFormData) => {
    if (selectedClient) {
      updateClientMutation.mutate({ id: selectedClient.id, data });
    } else {
      createClientMutation.mutate(data);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    form.reset({
      ...client,
      packageStartDate: client.packageStartDate ? 
        new Date(client.packageStartDate).toISOString().split('T')[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteClientMutation.mutate(id);
    }
  };

  const openNewClientDialog = () => {
    setSelectedClient(null);
    form.reset();
    setIsDialogOpen(true);
  };

  // Calculate dashboard stats
  const totalSubmissions = submissions.length;
  const activeClients = clients.filter((c: Client) => c.status === "active").length;
  const totalRevenue = clients
    .filter((c: Client) => c.status === "active" && c.monthlyValue)
    .reduce((sum: number, c: Client) => sum + (parseFloat(c.monthlyValue?.replace(/[£,]/g, "") || "0")), 0);
  const recentSubmissions = submissions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your business consultations, prospects, and clients</p>
          </div>
          <Button 
            onClick={() => testEmailMutation.mutate()}
            disabled={testEmailMutation.isPending}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>{testEmailMutation.isPending ? "Testing..." : "Test Email"}</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.filter(s => !isAlreadyProspect(s.email) && !isAlreadyClient(s.email)).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Prospects</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prospects.filter(p => !["converted", "rejected"].includes(p.status)).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prospects.filter(p => p.priority === "high").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClients}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">New Submissions</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="clients">Active Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Consultation Submissions</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const unconvertedSubmissions = submissions.filter(
                        (s: ContactSubmission) => !isAlreadyClient(s.email)
                      );
                      unconvertedSubmissions.forEach((submission: ContactSubmission) => {
                        convertToClientMutation.mutate(submission);
                      });
                    }}
                    disabled={convertToClientMutation.isPending || submissions.filter((s: ContactSubmission) => !isAlreadyClient(s.email)).length === 0}
                    className="flex items-center space-x-1"
                  >
                    <Users className="h-4 w-4" />
                    <span>Convert All New</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {submissionsLoading ? (
                  <div>Loading submissions...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Package Interest</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission: ContactSubmission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <button
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setIsSubmissionDetailOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {submission.name}
                            </button>
                          </TableCell>
                          <TableCell>{submission.email}</TableCell>
                          <TableCell>
                            {submission.package ? (
                              <Badge variant="secondary">{submission.package}</Badge>
                            ) : (
                              <span className="text-gray-500">No preference</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {submission.message}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {isAlreadyClient(submission.email) ? (
                                <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                  <Users className="h-3 w-3" />
                                  <span>Client</span>
                                </Badge>
                              ) : isAlreadyProspect(submission.email) ? (
                                <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                                  <CheckCircle2 className="h-3 w-3" />
                                  <span>In Pipeline</span>
                                </Badge>
                              ) : (
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    onClick={() => convertToProspectMutation.mutate(submission)}
                                    disabled={convertToProspectMutation.isPending}
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Pipeline
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => convertToClientMutation.mutate(submission)}
                                    disabled={convertToClientMutation.isPending}
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Client
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Prospect Pipeline</CardTitle>
                <Button onClick={() => {
                  setSelectedProspect(null);
                  prospectForm.reset();
                  setIsProspectDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prospect
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead>Interactions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prospects.map((prospect) => {
                      const prospectInteractions = getProspectInteractions(prospect.id);
                      return (
                        <TableRow key={prospect.id}>
                          <TableCell className="font-medium">{prospect.name}</TableCell>
                          <TableCell>{prospect.company || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(prospect.status)}>
                              {prospect.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={getPriorityColor(prospect.priority)}>
                              {prospect.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            {prospect.nextFollowUpDate ? (
                              new Date(prospect.nextFollowUpDate).toLocaleDateString()
                            ) : (
                              <span className="text-gray-500">Not set</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {prospectInteractions.length} interactions
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedProspect(prospect);
                                  prospectForm.reset({
                                    ...prospect,
                                    nextFollowUpDate: prospect.nextFollowUpDate ? 
                                      new Date(prospect.nextFollowUpDate).toISOString().split('T')[0] : ""
                                  });
                                  setIsProspectDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  interactionForm.reset({ 
                                    prospectId: prospect.id,
                                    type: "call",
                                    content: ""
                                  });
                                  setIsInteractionDialogOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Client Management</CardTitle>
                <Button onClick={openNewClientDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </CardHeader>
              <CardContent>
                {clientsLoading ? (
                  <div>Loading clients...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Monthly Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client: Client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.company || "-"}</TableCell>
                          <TableCell>{client.currentPackage || "-"}</TableCell>
                          <TableCell>{client.monthlyValue || "-"}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                client.status === "active" ? "default" : 
                                client.status === "paused" ? "secondary" : "outline"
                              }
                            >
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(client)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(client.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Client Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedClient ? "Edit Client" : "Add New Client"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentPackage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Package</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select package" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">Startup Solutions</SelectItem>
                            <SelectItem value="growth">Launch & Growth Accelerator</SelectItem>
                            <SelectItem value="ongoing">Ongoing Support</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Value</FormLabel>
                        <FormControl>
                          <Input placeholder="£1,500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="packageStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Package Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createClientMutation.isPending || updateClientMutation.isPending}
                  >
                    {selectedClient ? "Update" : "Create"} Client
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Prospect Dialog */}
        <Dialog open={isProspectDialogOpen} onOpenChange={setIsProspectDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedProspect ? "Edit Prospect" : "Add New Prospect"}
              </DialogTitle>
            </DialogHeader>
            <Form {...prospectForm}>
              <form onSubmit={prospectForm.handleSubmit((data) => prospectMutation.mutate(data))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={prospectForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prospectForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={prospectForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={prospectForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                            <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prospectForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={prospectForm.control}
                    name="nextFollowUpDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Follow-up</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={prospectForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsProspectDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={prospectMutation.isPending}
                  >
                    {selectedProspect ? "Update" : "Create"} Prospect
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Interaction Dialog */}
        <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Log Interaction</DialogTitle>
            </DialogHeader>
            <Form {...interactionForm}>
              <form onSubmit={interactionForm.handleSubmit((data) => interactionMutation.mutate(data))} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={interactionForm.control}
                    name="prospectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prospect</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select prospect" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {prospects.map((prospect) => (
                              <SelectItem key={prospect.id} value={prospect.id}>
                                {prospect.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={interactionForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="note">Note</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={interactionForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} placeholder="Describe the interaction details..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsInteractionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={interactionMutation.isPending}
                  >
                    Log Interaction
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Submission Detail Dialog */}
        <Dialog open={isSubmissionDetailOpen} onOpenChange={setIsSubmissionDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Consultation Submission Details</DialogTitle>
            </DialogHeader>
            {selectedSubmission && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-lg font-semibold">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-lg">{selectedSubmission.email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Package Interest</Label>
                  <div className="mt-1">
                    {selectedSubmission.package ? (
                      <Badge variant="secondary" className="text-sm">
                        {selectedSubmission.package === 'startup' && 'Startup Solutions'}
                        {selectedSubmission.package === 'growth' && 'Growth Accelerator'}
                        {selectedSubmission.package === 'ongoing' && 'Ongoing Support'}
                        {!['startup', 'growth', 'ongoing'].includes(selectedSubmission.package) && selectedSubmission.package}
                      </Badge>
                    ) : (
                      <p className="text-gray-500 italic">No specific package preference</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Submission Date</Label>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedSubmission.createdAt).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Message</Label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedSubmission.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    {isAlreadyClient(selectedSubmission.email) ? (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Already a Client</span>
                      </Badge>
                    ) : isAlreadyProspect(selectedSubmission.email) ? (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>In Prospect Pipeline</span>
                      </Badge>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            convertToProspectMutation.mutate(selectedSubmission);
                            setIsSubmissionDetailOpen(false);
                          }}
                          disabled={convertToProspectMutation.isPending}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add to Pipeline
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            convertToClientMutation.mutate(selectedSubmission);
                            setIsSubmissionDetailOpen(false);
                          }}
                          disabled={convertToClientMutation.isPending}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Convert to Client
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSubmissionDetailOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}