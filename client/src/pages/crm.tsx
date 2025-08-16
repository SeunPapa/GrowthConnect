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
  Phone, 
  Calendar, 
  Edit, 
  Plus, 
  UserPlus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Target,
  Mail,
  FileText,
  ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContactSubmission, Prospect, Interaction } from "@shared/schema";

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

type ProspectFormData = z.infer<typeof prospectSchema>;
type InteractionFormData = z.infer<typeof interactionSchema>;

export default function CRMDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isProspectDialogOpen, setIsProspectDialogOpen] = useState(false);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");

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

  // Fetch data
  const { data: submissions = [] } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact-submissions"],
  });

  const { data: prospects = [] } = useQuery<Prospect[]>({
    queryKey: ["/api/prospects"],
  });

  const { data: interactions = [] } = useQuery<Interaction[]>({
    queryKey: ["/api/interactions"],
  });

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

  // Check if submission is already a prospect
  const isAlreadyProspect = (email: string) => {
    return prospects.some(prospect => prospect.email === email);
  };

  // Get interactions for a specific prospect
  const getProspectInteractions = (prospectId: string) => {
    return interactions.filter(interaction => interaction.prospectId === prospectId);
  };

  const handleEditProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    prospectForm.reset({
      ...prospect,
      nextFollowUpDate: prospect.nextFollowUpDate ? 
        new Date(prospect.nextFollowUpDate).toISOString().split('T')[0] : ""
    });
    setIsProspectDialogOpen(true);
  };

  const openNewProspectDialog = () => {
    setSelectedProspect(null);
    prospectForm.reset();
    setIsProspectDialogOpen(true);
  };

  const openInteractionDialog = (prospectId?: string) => {
    interactionForm.reset({ 
      prospectId: prospectId || "",
      type: "call",
      content: ""
    });
    setIsInteractionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage consultation submissions, prospects, and client interactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.filter(s => !isAlreadyProspect(s.email)).length}</div>
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
              <CardTitle className="text-sm font-medium">Qualified Prospects</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {prospects.filter(p => p.status === "qualified").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">New Submissions</TabsTrigger>
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Package Interest</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
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
                        <TableCell>
                          {isAlreadyProspect(submission.email) ? (
                            <Badge variant="outline">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              In Pipeline
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => convertToProspectMutation.mutate(submission)}
                              disabled={convertToProspectMutation.isPending}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Add to Pipeline
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prospects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Prospect Pipeline</CardTitle>
                <Button onClick={openNewProspectDialog}>
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
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {prospectInteractions.length} interactions
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditProspect(prospect)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => openInteractionDialog(prospect.id)}
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


        </Tabs>

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
                                {prospect.name} ({prospect.company})
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief subject or title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={interactionForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} placeholder="Describe the interaction, discussion points, decisions made..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={interactionForm.control}
                    name="outcome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outcome</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="positive">Positive</SelectItem>
                            <SelectItem value="negative">Negative</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="follow_up_needed">Follow-up Needed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={interactionForm.control}
                    name="nextActionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Action Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={interactionForm.control}
                  name="nextAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Action</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} placeholder="What needs to be done next?" />
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
      </div>
    </div>
  );
}