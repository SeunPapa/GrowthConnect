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
import { Users, MessageSquare, TrendingUp, DollarSign, Calendar, Edit, Trash2, Plus, Mail, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContactSubmission, Client } from "@shared/schema";

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

type ClientFormData = z.infer<typeof clientSchema>;

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // Fetch submissions
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/contact-submissions"],
  });

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
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

  // Check if a submission has already been converted to a client
  const isAlreadyClient = (submissionEmail: string) => {
    return clients.some((client: Client) => client.email === submissionEmail);
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
            <p className="text-gray-600 mt-2">Manage your business consultations and clients</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => window.location.href = '/crm'}
              variant="default"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Open CRM</span>
            </Button>
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <TabsTrigger value="submissions">Consultation Submissions</TabsTrigger>
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
                          <TableCell className="font-medium">{submission.name}</TableCell>
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
                            {isAlreadyClient(submission.email) ? (
                              <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                <Users className="h-3 w-3" />
                                <span>Already Client</span>
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => convertToClientMutation.mutate(submission)}
                                disabled={convertToClientMutation.isPending}
                                className="flex items-center space-x-1"
                              >
                                <UserPlus className="h-4 w-4" />
                                <span>Convert to Client</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
      </div>
    </div>
  );
}