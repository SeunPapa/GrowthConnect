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
  Target,
  Clock
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
  const [selectedProspectDetail, setSelectedProspectDetail] = useState<Prospect | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProspectDialogOpen, setIsProspectDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isSubmissionDetailOpen, setIsSubmissionDetailOpen] = useState(false);
  const [isProspectDetailOpen, setIsProspectDetailOpen] = useState(false);
  const [isClientDetailOpen, setIsClientDetailOpen] = useState(false);

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submissions">New Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="prospects">Prospects ({prospects.length})</TabsTrigger>
            <TabsTrigger value="clients">Active Clients ({clients.length})</TabsTrigger>
            <TabsTrigger value="todo">To-Do List</TabsTrigger>
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
                          <TableCell className="font-medium">
                            <button
                              onClick={() => {
                                setSelectedProspectDetail(prospect);
                                setIsProspectDetailOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {prospect.name}
                            </button>
                          </TableCell>
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
                          <TableCell className="font-medium">
                            <button
                              onClick={() => {
                                setSelectedClientDetail(client);
                                setIsClientDetailOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              {client.name}
                            </button>
                          </TableCell>
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

          <TabsContent value="todo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Action Items & Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overdue Follow-ups */}
                  {(() => {
                    const overdueProspects = prospects.filter(p => 
                      p.nextFollowUpDate && new Date(p.nextFollowUpDate) < new Date()
                    );
                    
                    return overdueProspects.length > 0 ? (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Overdue Follow-ups ({overdueProspects.length})
                        </h3>
                        <div className="space-y-2">
                          {overdueProspects.map(prospect => {
                            const daysOverdue = Math.ceil((new Date().getTime() - new Date(prospect.nextFollowUpDate!).getTime()) / (1000 * 60 * 60 * 24));
                            return (
                              <div key={prospect.id} className="bg-white p-3 rounded border flex justify-between items-center">
                                <div>
                                  <button
                                    onClick={() => {
                                      setSelectedProspectDetail(prospect);
                                      setIsProspectDetailOpen(true);
                                    }}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {prospect.name}
                                  </button>
                                  <p className="text-sm text-gray-600">
                                    {prospect.company} • <span className="text-red-600 font-medium">{daysOverdue} days overdue</span>
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Badge variant="destructive" className="text-xs">
                                    {prospect.priority}
                                  </Badge>
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
                                    Follow Up
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Today's Follow-ups */}
                  {(() => {
                    const todayProspects = prospects.filter(p => {
                      if (!p.nextFollowUpDate) return false;
                      const followUpDate = new Date(p.nextFollowUpDate);
                      const today = new Date();
                      return followUpDate.toDateString() === today.toDateString();
                    });
                    
                    return todayProspects.length > 0 ? (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Due Today ({todayProspects.length})
                        </h3>
                        <div className="space-y-2">
                          {todayProspects.map(prospect => (
                            <div key={prospect.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <div>
                                <button
                                  onClick={() => {
                                    setSelectedProspectDetail(prospect);
                                    setIsProspectDetailOpen(true);
                                  }}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {prospect.name}
                                </button>
                                <p className="text-sm text-gray-600">
                                  {prospect.company} • Status: {prospect.status.replace('_', ' ')}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <span className={`text-xs font-medium ${getPriorityColor(prospect.priority)}`}>
                                  {prospect.priority.toUpperCase()}
                                </span>
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
                                  Contact
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Upcoming Follow-ups (Next 7 days) */}
                  {(() => {
                    const upcomingProspects = prospects.filter(p => {
                      if (!p.nextFollowUpDate) return false;
                      const followUpDate = new Date(p.nextFollowUpDate);
                      const today = new Date();
                      const nextWeek = new Date();
                      nextWeek.setDate(today.getDate() + 7);
                      return followUpDate > today && followUpDate <= nextWeek;
                    });
                    
                    return upcomingProspects.length > 0 ? (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          Upcoming This Week ({upcomingProspects.length})
                        </h3>
                        <div className="space-y-2">
                          {upcomingProspects.map(prospect => {
                            const daysUntil = Math.ceil((new Date(prospect.nextFollowUpDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return (
                              <div key={prospect.id} className="bg-white p-3 rounded border flex justify-between items-center">
                                <div>
                                  <button
                                    onClick={() => {
                                      setSelectedProspectDetail(prospect);
                                      setIsProspectDetailOpen(true);
                                    }}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {prospect.name}
                                  </button>
                                  <p className="text-sm text-gray-600">
                                    {prospect.company} • Due in {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <span className={`text-xs font-medium ${getPriorityColor(prospect.priority)}`}>
                                    {prospect.priority.toUpperCase()}
                                  </span>
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
                                    Update
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Pending Next Actions from Interactions */}
                  {(() => {
                    const actionsNeeded = interactions.filter(i => 
                      i.nextAction && i.nextAction.trim() && 
                      (!i.nextActionDate || new Date(i.nextActionDate) <= new Date())
                    );
                    
                    return actionsNeeded.length > 0 ? (
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                          <Target className="h-5 w-5 mr-2" />
                          Pending Actions ({actionsNeeded.length})
                        </h3>
                        <div className="space-y-2">
                          {actionsNeeded.map(interaction => {
                            const prospect = prospects.find(p => p.id === interaction.prospectId);
                            return prospect ? (
                              <div key={interaction.id} className="bg-white p-3 rounded border flex justify-between items-center">
                                <div>
                                  <button
                                    onClick={() => {
                                      setSelectedProspectDetail(prospect);
                                      setIsProspectDetailOpen(true);
                                    }}
                                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                    {prospect.name}
                                  </button>
                                  <p className="text-sm text-gray-900 font-medium mt-1">{interaction.nextAction}</p>
                                  <p className="text-xs text-gray-500">
                                    From {interaction.type} on {new Date(interaction.createdAt).toLocaleDateString('en-GB')}
                                    {interaction.nextActionDate && (
                                      <span> • Target: {new Date(interaction.nextActionDate).toLocaleDateString('en-GB')}</span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      interactionForm.reset({ 
                                        prospectId: prospect.id,
                                        type: "note",
                                        content: `Completed: ${interaction.nextAction}`
                                      });
                                      setIsInteractionDialogOpen(true);
                                    }}
                                  >
                                    Complete
                                  </Button>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* New Submissions Needing Attention */}
                  {(() => {
                    const newSubmissions = submissions.filter((s: ContactSubmission) => 
                      !isAlreadyClient(s.email) && !isAlreadyProspect(s.email)
                    );
                    
                    return newSubmissions.length > 0 ? (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                          <UserPlus className="h-5 w-5 mr-2" />
                          New Submissions ({newSubmissions.length})
                        </h3>
                        <div className="space-y-2">
                          {newSubmissions.slice(0, 5).map((submission: ContactSubmission) => (
                            <div key={submission.id} className="bg-white p-3 rounded border flex justify-between items-center">
                              <div>
                                <button
                                  onClick={() => {
                                    setSelectedSubmission(submission);
                                    setIsSubmissionDetailOpen(true);
                                  }}
                                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {submission.name}
                                </button>
                                <p className="text-sm text-gray-600">
                                  {submission.email} • {new Date(submission.createdAt).toLocaleDateString('en-GB')}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => convertToProspectMutation.mutate(submission)}
                                  disabled={convertToProspectMutation.isPending}
                                >
                                  Add to Pipeline
                                </Button>
                              </div>
                            </div>
                          ))}
                          {newSubmissions.length > 5 && (
                            <p className="text-sm text-gray-500 text-center pt-2">
                              +{newSubmissions.length - 5} more submissions in New Submissions tab
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Empty State */}
                  {(() => {
                    const hasAnyTodos = 
                      prospects.some(p => p.nextFollowUpDate && new Date(p.nextFollowUpDate) < new Date()) ||
                      prospects.some(p => p.nextFollowUpDate && new Date(p.nextFollowUpDate).toDateString() === new Date().toDateString()) ||
                      prospects.some(p => p.nextFollowUpDate && new Date(p.nextFollowUpDate) > new Date() && new Date(p.nextFollowUpDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) ||
                      interactions.some(i => i.nextAction && i.nextAction.trim() && (!i.nextActionDate || new Date(i.nextActionDate) <= new Date())) ||
                      submissions.some((s: ContactSubmission) => !isAlreadyClient(s.email) && !isAlreadyProspect(s.email));
                    
                    return !hasAnyTodos ? (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                        <p>No pending actions, overdue follow-ups, or new submissions at the moment.</p>
                        <p className="text-sm mt-2">Great work staying on top of your pipeline!</p>
                      </div>
                    ) : null;
                  })()}
                </div>
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

        {/* Prospect Detail Dialog */}
        <Dialog open={isProspectDetailOpen} onOpenChange={setIsProspectDetailOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prospect Details & Interactions</DialogTitle>
            </DialogHeader>
            {selectedProspectDetail && (
              <div className="space-y-6">
                {/* Prospect Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Prospect Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="text-lg font-semibold">{selectedProspectDetail.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-lg">{selectedProspectDetail.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company</Label>
                      <p>{selectedProspectDetail.company || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Source</Label>
                      <p>{selectedProspectDetail.source || "Unknown"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge variant={getStatusBadgeVariant(selectedProspectDetail.status)}>
                        {selectedProspectDetail.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Priority</Label>
                      <span className={getPriorityColor(selectedProspectDetail.priority)}>
                        {selectedProspectDetail.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-500">Next Follow-up</Label>
                    <p className="text-sm">
                      {selectedProspectDetail.nextFollowUpDate ? 
                        new Date(selectedProspectDetail.nextFollowUpDate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Not scheduled"
                      }
                    </p>
                  </div>
                  {selectedProspectDetail.notes && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-500">Notes</Label>
                      <div className="mt-1 p-3 bg-white rounded border text-sm">
                        {selectedProspectDetail.notes}
                      </div>
                    </div>
                  )}
                </div>

                {/* Original Submission (if linked) */}
                {selectedProspectDetail.submissionId && (() => {
                  const originalSubmission = submissions.find(s => s.id === selectedProspectDetail.submissionId);
                  return originalSubmission ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Original Consultation Request</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Submitted</Label>
                          <p className="text-sm">
                            {new Date(originalSubmission.createdAt).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Package Interest</Label>
                          <div>
                            {originalSubmission.package ? (
                              <Badge variant="secondary" className="text-xs">
                                {originalSubmission.package === 'startup' && 'Startup Solutions'}
                                {originalSubmission.package === 'growth' && 'Growth Accelerator'}
                                {originalSubmission.package === 'ongoing' && 'Ongoing Support'}
                                {!['startup', 'growth', 'ongoing'].includes(originalSubmission.package) && originalSubmission.package}
                              </Badge>
                            ) : (
                              <span className="text-gray-500 text-xs">No preference</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Original Message</Label>
                        <div className="mt-1 p-3 bg-white rounded border text-sm leading-relaxed whitespace-pre-wrap">
                          {originalSubmission.message}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Interactions History */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Interaction History</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        interactionForm.reset({ 
                          prospectId: selectedProspectDetail.id,
                          type: "call",
                          content: ""
                        });
                        setIsInteractionDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Interaction
                    </Button>
                  </div>
                  
                  {(() => {
                    const prospectInteractions = getProspectInteractions(selectedProspectDetail.id);
                    return prospectInteractions.length > 0 ? (
                      <div className="space-y-3">
                        {prospectInteractions.map((interaction) => (
                          <div key={interaction.id} className="bg-white p-4 rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                {getInteractionIcon(interaction.type)}
                                <span className="font-medium capitalize">{interaction.type}</span>
                                {interaction.subject && (
                                  <span className="text-gray-600">- {interaction.subject}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(interaction.createdAt).toLocaleDateString('en-GB')}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                              {interaction.content}
                            </p>
                            {interaction.outcome && (
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant={interaction.outcome === "positive" ? "default" : 
                                          interaction.outcome === "negative" ? "destructive" : "outline"}
                                  className="text-xs"
                                >
                                  {interaction.outcome}
                                </Badge>
                                {interaction.nextAction && (
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">Next:</span> {interaction.nextAction}
                                    {interaction.nextActionDate && (
                                      <span className="ml-2">
                                        ({new Date(interaction.nextActionDate).toLocaleDateString('en-GB')})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No interactions recorded yet</p>
                        <p className="text-sm">Click "Add Interaction" to log your first contact</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Follow-up & Next Steps */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Follow-up & Next Steps</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Scheduled Follow-up</Label>
                      {selectedProspectDetail.nextFollowUpDate ? (
                        <div className="mt-1">
                          <p className="font-medium text-lg">
                            {new Date(selectedProspectDetail.nextFollowUpDate).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {(() => {
                              const followUpDate = new Date(selectedProspectDetail.nextFollowUpDate);
                              const today = new Date();
                              const diffTime = followUpDate.getTime() - today.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
                              if (diffDays === 0) return 'Due today';
                              if (diffDays === 1) return 'Due tomorrow';
                              return `Due in ${diffDays} days`;
                            })()}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-1 p-3 bg-white rounded border border-dashed border-gray-300">
                          <p className="text-gray-500 italic text-sm">No follow-up scheduled</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Priority Level</Label>
                      <div className="mt-1">
                        <span className={`${getPriorityColor(selectedProspectDetail.priority)} text-lg font-medium`}>
                          {selectedProspectDetail.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Actions from Latest Interaction */}
                  {(() => {
                    const prospectInteractions = getProspectInteractions(selectedProspectDetail.id);
                    const latestInteractionWithAction = prospectInteractions
                      .filter(i => i.nextAction && i.nextAction.trim())
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                    
                    return latestInteractionWithAction ? (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Latest Next Action</Label>
                        <div className="mt-1 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-900">{latestInteractionWithAction.nextAction}</p>
                          {latestInteractionWithAction.nextActionDate && (
                            <p className="text-xs text-gray-600 mt-1">
                              Target date: {new Date(latestInteractionWithAction.nextActionDate).toLocaleDateString('en-GB')}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            From {latestInteractionWithAction.type} on {new Date(latestInteractionWithAction.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Quick Follow-up Actions */}
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Quick Actions</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          interactionForm.reset({ 
                            prospectId: selectedProspectDetail.id,
                            type: "call",
                            content: ""
                          });
                          setIsInteractionDialogOpen(true);
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Schedule Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          interactionForm.reset({ 
                            prospectId: selectedProspectDetail.id,
                            type: "email",
                            content: ""
                          });
                          setIsInteractionDialogOpen(true);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          interactionForm.reset({ 
                            prospectId: selectedProspectDetail.id,
                            type: "meeting",
                            content: ""
                          });
                          setIsInteractionDialogOpen(true);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Meeting
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProspect(selectedProspectDetail);
                          prospectForm.reset({
                            ...selectedProspectDetail,
                            nextFollowUpDate: selectedProspectDetail.nextFollowUpDate ? 
                              new Date(selectedProspectDetail.nextFollowUpDate).toISOString().split('T')[0] : ""
                          });
                          setIsProspectDialogOpen(true);
                          setIsProspectDetailOpen(false);
                        }}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Update Follow-up
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedProspect(selectedProspectDetail);
                        prospectForm.reset({
                          ...selectedProspectDetail,
                          nextFollowUpDate: selectedProspectDetail.nextFollowUpDate ? 
                            new Date(selectedProspectDetail.nextFollowUpDate).toISOString().split('T')[0] : ""
                        });
                        setIsProspectDialogOpen(true);
                        setIsProspectDetailOpen(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        interactionForm.reset({ 
                          prospectId: selectedProspectDetail.id,
                          type: "call",
                          content: ""
                        });
                        setIsInteractionDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Log Interaction
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsProspectDetailOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Client Detail Dialog */}
        <Dialog open={isClientDetailOpen} onOpenChange={setIsClientDetailOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Client Profile & Details</DialogTitle>
            </DialogHeader>
            {selectedClientDetail && (
              <div className="space-y-6">
                {/* Client Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Name</Label>
                      <p className="text-lg font-semibold">{selectedClientDetail.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-lg">{selectedClientDetail.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company</Label>
                      <p>{selectedClientDetail.company || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p>{selectedClientDetail.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge 
                        variant={
                          selectedClientDetail.status === "active" ? "default" : 
                          selectedClientDetail.status === "paused" ? "secondary" : "outline"
                        }
                      >
                        {selectedClientDetail.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Source</Label>
                      <p>{selectedClientDetail.source || "Direct"}</p>
                    </div>
                  </div>
                </div>

                {/* Package & Financial Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Package & Billing</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Current Package</Label>
                      <div className="mt-1">
                        {selectedClientDetail.currentPackage ? (
                          <Badge variant="secondary" className="text-sm">
                            {selectedClientDetail.currentPackage === 'startup' && 'Startup Solutions'}
                            {selectedClientDetail.currentPackage === 'growth' && 'Growth Accelerator'}
                            {selectedClientDetail.currentPackage === 'ongoing' && 'Ongoing Support'}
                            {!['startup', 'growth', 'ongoing'].includes(selectedClientDetail.currentPackage) && selectedClientDetail.currentPackage}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">No package assigned</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Monthly Value</Label>
                      <p className="text-lg font-semibold text-green-600">
                        {selectedClientDetail.monthlyValue || "Not set"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Package Start Date</Label>
                      <p className="text-sm">
                        {selectedClientDetail.packageStartDate ? 
                          new Date(selectedClientDetail.packageStartDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "Not specified"
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Account Duration</Label>
                      <p className="text-sm">
                        {selectedClientDetail.packageStartDate ? (() => {
                          const startDate = new Date(selectedClientDetail.packageStartDate);
                          const today = new Date();
                          const diffTime = Math.abs(today.getTime() - startDate.getTime());
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          const months = Math.floor(diffDays / 30);
                          const remainingDays = diffDays % 30;
                          
                          if (months > 0) {
                            return `${months} month${months > 1 ? 's' : ''}, ${remainingDays} days`;
                          }
                          return `${diffDays} days`;
                        })() : "Not calculated"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Original Submission (if linked) */}
                {selectedClientDetail.submissionId && (() => {
                  const originalSubmission = submissions.find(s => s.id === selectedClientDetail.submissionId);
                  return originalSubmission ? (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Original Consultation Request</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Submitted</Label>
                          <p className="text-sm">
                            {new Date(originalSubmission.createdAt).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Package Interest</Label>
                          <div>
                            {originalSubmission.package ? (
                              <Badge variant="secondary" className="text-xs">
                                {originalSubmission.package === 'startup' && 'Startup Solutions'}
                                {originalSubmission.package === 'growth' && 'Growth Accelerator'}
                                {originalSubmission.package === 'ongoing' && 'Ongoing Support'}
                                {!['startup', 'growth', 'ongoing'].includes(originalSubmission.package) && originalSubmission.package}
                              </Badge>
                            ) : (
                              <span className="text-gray-500 text-xs">No preference</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Original Message</Label>
                        <div className="mt-1 p-3 bg-white rounded border text-sm leading-relaxed whitespace-pre-wrap">
                          {originalSubmission.message}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Client Notes & History */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Notes & Comments</h3>
                  {selectedClientDetail.notes ? (
                    <div className="p-3 bg-white rounded border text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedClientDetail.notes}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No notes recorded yet</p>
                      <p className="text-sm">Click "Edit Details" to add client notes</p>
                    </div>
                  )}
                </div>

                {/* Client Metrics */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Account Metrics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedClientDetail.monthlyValue ? 
                          selectedClientDetail.monthlyValue.replace(/[^\d.,]/g, '') : '0'}
                      </div>
                      <p className="text-sm text-gray-600">Monthly Value</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedClientDetail.packageStartDate ? (() => {
                          const startDate = new Date(selectedClientDetail.packageStartDate);
                          const today = new Date();
                          const months = Math.floor(Math.abs(today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                          return months;
                        })() : 0}
                      </div>
                      <p className="text-sm text-gray-600">Months Active</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedClientDetail.monthlyValue && selectedClientDetail.packageStartDate ? (() => {
                          const monthlyValue = parseFloat(selectedClientDetail.monthlyValue.replace(/[^\d.,]/g, ''));
                          const startDate = new Date(selectedClientDetail.packageStartDate);
                          const today = new Date();
                          const months = Math.floor(Math.abs(today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
                          return `£${(monthlyValue * Math.max(months, 1)).toLocaleString()}`;
                        })() : '£0'}
                      </div>
                      <p className="text-sm text-gray-600">Total Value</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedClient(selectedClientDetail);
                        form.reset({
                          ...selectedClientDetail,
                          packageStartDate: selectedClientDetail.packageStartDate ? 
                            new Date(selectedClientDetail.packageStartDate).toISOString().split('T')[0] : ""
                        });
                        setIsDialogOpen(true);
                        setIsClientDetailOpen(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(`mailto:${selectedClientDetail.email}`, '_blank')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    {selectedClientDetail.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`tel:${selectedClientDetail.phone}`, '_blank')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Client
                      </Button>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsClientDetailOpen(false)}
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