
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  ArrowUp,
  Bus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Circle,
  Eye,
  FilePen,
  FileText,
  Filter,
  GraduationCap,
  Home,
  Loader2,
  MapPin,
  MoreHorizontal,
  PlusCircle,
  RefreshCw,
  Route,
  Search,
  Settings,
  Siren,
  Trash,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const busSchema = z.object({
  busNo: z.string().regex(/^[0-9]+$/, "Bus number must be numeric.").min(1, "Bus number is required."),
  preferredNumber: z.string().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1."),
  regNo: z.string().min(1, "Registration number is required."),
  model: z.string().min(1, "Model/Year is required."),
  driver: z.string().optional(),
  helper: z.string().optional(),
});

const updateStatusSchema = z.object({
  busId: z.string().min(1, "Please select a bus."),
  newStatus: z.enum(["Active", "Maintenance", "Inactive"]),
  reason: z.string().min(10, "Reason must be at least 10 characters long."),
  effectiveFrom: z.date().optional(),
});


type Bus = z.infer<typeof busSchema> & { status: "Active" | "Maintenance" | "Inactive" };
type UpdateStatus = z.infer<typeof updateStatusSchema>;


const sampleBuses: (Bus & { id: number; lastTrip: string })[] = [
  { id: 1, busNo: "01", capacity: 50, driver: "Raj Kumar", status: "Active", regNo: "AP01AB1234", lastTrip: "Today 4:30PM", model: "2022 Ashok Leyland" },
  { id: 2, busNo: "02", capacity: 40, driver: "Suresh Kumar", status: "Maintenance", regNo: "AP01AB5678", lastTrip: "Yday 3:15PM", model: "2021 Tata Marcopolo" },
  { id: 3, busNo: "03", capacity: 55, driver: "Ramesh Patel", status: "Active", regNo: "AP01AC7890", lastTrip: "Today 5:00PM", model: "2023 Eicher Starline" },
  { id: 4, busNo: "04", capacity: 50, driver: "Anil Sharma", status: "Inactive", regNo: "AP01AD9876", lastTrip: "2 days ago", model: "2020 BharatBenz" },
  { id: 5, busNo: "05", capacity: 45, driver: "Vikram Singh", status: "Active", regNo: "AP01AE4321", lastTrip: "Today 4:45PM", model: "2022 Ashok Leyland" },
];

export default function BusesPage() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBus, setEditingBus] = React.useState<Bus & { id: number } | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [statusBus, setStatusBus] = React.useState<(Bus & { id: number }) | null>(null);


  const form = useForm<Bus>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      busNo: "",
      preferredNumber: "",
      capacity: 0,
      regNo: "",
      model: "",
      driver: "",
      helper: "",
      status: "Active",
    },
  });

  const statusForm = useForm<UpdateStatus>({
    resolver: zodResolver(updateStatusSchema),
  });

  React.useEffect(() => {
    if (isModalOpen && editingBus) {
      form.reset(editingBus);
    } else if (!isModalOpen) {
      form.reset({
        busNo: "",
        preferredNumber: "",
        capacity: 0,
        regNo: "",
        model: "",
        driver: "",
        helper: "",
        status: "Active",
      });
      setEditingBus(null);
    }
  }, [isModalOpen, editingBus, form]);

   React.useEffect(() => {
    if (isStatusModalOpen && statusBus) {
      statusForm.reset({
        busId: String(statusBus.id),
        newStatus: statusBus.status,
      });
    } else if (!isStatusModalOpen) {
      statusForm.reset({
        busId: "",
        reason: "",
      });
      setStatusBus(null);
    }
  }, [isStatusModalOpen, statusBus, statusForm]);

  const onSubmit = (values: Bus) => {
    console.log("Form submitted", values);
    // On create, status is always active
    const payload = editingBus ? values : { ...values, status: 'Active' };
    console.log("Payload sent to API:", payload);
    setIsModalOpen(false);
  };

  const onStatusSubmit = (values: UpdateStatus) => {
    console.log("Status form submitted", values);
    // TODO: API call to update bus status
    setIsStatusModalOpen(false);
  };
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const navItems = [
    { name: "Home", icon: Home, href: "/dashboard" },
    { name: "Buses", icon: Bus, href: "/buses" },
    { name: "Drivers", icon: User, href: "/drivers" },
    { name: "Routes", icon: Route, href: "/routes" },
    { name: "Students", icon: Users, href: "/students" },
    { name: "Trips", icon: MapPin, href: "/trips" },
    { name: "Bus Details", icon: FileText, href: "/bus-details" },
    { name: "Reports", icon: TrendingUp, href: "/reports" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditClick = (bus: Bus & { id: number }) => {
    setEditingBus(bus);
    setIsModalOpen(true);
  };

  const handleStatusClick = (bus: (Bus & { id: number }) | null) => {
    setStatusBus(bus);
    setIsStatusModalOpen(true);
  };
  
  const selectedBusForStatus = sampleBuses.find(b => String(b.id) === statusForm.watch('busId'));
  
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r bg-primary text-primary-foreground">
        <SidebarHeader>
          <div className="flex h-10 items-center justify-center gap-2">
            <Bus className="h-6 w-6 text-primary-foreground" />
            <span className="text-lg font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
              NBKR
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={pathname.startsWith(item.href)}
                      asChild
                    >
                      <div>
                        <item.icon />
                        <span>{item.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold md:text-xl">Buses</h1>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search buses..."
                className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-full"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                    <AvatarFallback>{user ? getInitials(user.name) : 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{user?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Bus Fleet Management</h1>
              <p className="text-muted-foreground">Manage all college buses and assignments</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleStatusClick(null)}>
                Update Bus Status
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" onClick={() => { setEditingBus(null); setIsModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Bus
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>{editingBus ? "Edit Bus" : "Add New Bus"}</DialogTitle>
                    <DialogDescription>
                      {editingBus
                        ? `Update details for bus ${editingBus.busNo}`
                        : "Fill in the details to add a new bus. New buses are active by default."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="busNo" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bus No.</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                           <FormField control={form.control} name="preferredNumber" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 9999" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacity</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="50" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="regNo" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration No.</FormLabel>
                              <FormControl>
                                <Input placeholder="AP01AB1234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="model" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Model/Year</FormLabel>
                              <FormControl>
                                <Input placeholder="2022 Ashok Leyland" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-lg font-medium">Driver Assignment</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <FormField control={form.control} name="driver" render={({ field }) => (
                             <FormItem>
                              <FormLabel>Primary Driver</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                 <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a driver" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Raj Kumar">Raj Kumar</SelectItem>
                                  <SelectItem value="Suresh Kumar">Suresh Kumar</SelectItem>
                                  <SelectItem value="Unassigned">Unassigned</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                             </FormItem>
                           )} />
                           <FormField control={form.control} name="helper" render={({ field }) => (
                             <FormItem>
                               <FormLabel>Helper (Optional)</FormLabel>
                               <FormControl>
                                 <Input placeholder="Helper name" {...field} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )} />
                         </div>
                      </div>
                      <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                          <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingBus ? "Save Changes" : "Add Bus"}
                          </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Update Bus Status</DialogTitle>
                    <DialogDescription>
                      Select a bus and update its current status with a reason.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...statusForm}>
                    <form onSubmit={statusForm.handleSubmit(onStatusSubmit)} className="space-y-6">
                      <FormField
                        control={statusForm.control}
                        name="busId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bus</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!statusBus}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a bus" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sampleBuses.map(bus => (
                                  <SelectItem key={bus.id} value={String(bus.id)}>{bus.busNo} - {bus.regNo}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {selectedBusForStatus && (
                         <FormItem>
                          <FormLabel>Current Status</FormLabel>
                           <Badge variant={selectedBusForStatus.status === 'Maintenance' ? 'default' : selectedBusForStatus.status === 'Inactive' ? 'secondary' : 'default'}
                            className={cn(
                                {'bg-green-500 text-white hover:bg-green-600': selectedBusForStatus.status === 'Active'},
                                {'bg-yellow-500 text-white hover:bg-yellow-600': selectedBusForStatus.status === 'Maintenance'},
                                {'bg-gray-500 text-white hover:bg-gray-600': selectedBusForStatus.status === 'Inactive'}
                            )}>
                              {selectedBusForStatus.status}
                           </Badge>
                         </FormItem>
                      )}
                      <FormField
                        control={statusForm.control}
                        name="newStatus"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>New Status</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                {(["Active", "Maintenance", "Inactive"] as const).map((status) => (
                                  <Button
                                    key={status}
                                    type="button"
                                    variant={field.value === status ? "default" : "outline"}
                                    onClick={() => statusForm.setValue("newStatus", status)}
                                    className={cn("flex-1 justify-start", {
                                      "bg-green-100 border-green-300 text-green-800 hover:bg-green-200": field.value === status && status === "Active",
                                      "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200": field.value === status && status === "Maintenance",
                                      "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200": field.value === status && status === "Inactive",
                                    })}
                                  >
                                    <span className={cn("w-2 h-2 rounded-full mr-2", {
                                      "bg-green-500": status === "Active",
                                      "bg-yellow-500": status === "Maintenance",
                                      "bg-gray-500": status === "Inactive",
                                    })}></span>
                                    {status}
                                  </Button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={statusForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Status Change</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Example: Scheduled service, accident repair, bus retired, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={statusForm.formState.isSubmitting}>
                          {statusForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Update Status
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
                    <Bus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">24</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <Circle className="h-4 w-4 text-green-500 fill-current" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">20</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
                    <Circle className="h-4 w-4 text-yellow-500 fill-current" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Docs Overdue</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2</div>
                </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Bus List</CardTitle>
                     <div className="flex items-center gap-2">
                        <Input placeholder="Search by Bus No., Driver..." className="w-[250px]"/>
                         <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><Checkbox /></TableHead>
                    <TableHead>Bus No.</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reg No.</TableHead>
                    <TableHead>Last Trip</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBuses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell className="font-medium">{bus.busNo}</TableCell>
                      <TableCell>{bus.capacity}</TableCell>
                      <TableCell>{bus.driver || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Badge variant={bus.status === 'Maintenance' ? 'default' : bus.status === 'Inactive' ? 'secondary' : 'default'}
                            className={cn(
                                {'bg-green-500 text-white hover:bg-green-600': bus.status === 'Active'},
                                {'bg-yellow-500 text-white hover:bg-yellow-600': bus.status === 'Maintenance'},
                                {'bg-gray-500 text-white hover:bg-gray-600': bus.status === 'Inactive'}
                            )}>
                          {bus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{bus.regNo}</TableCell>
                      <TableCell>{bus.lastTrip}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(bus)}>
                                <FilePen className="mr-2 h-4 w-4" />
                                Edit Bus
                              </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleStatusClick(bus)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
             <div className="flex items-center justify-between p-4 border-t">
                 <div className="text-sm text-muted-foreground">
                    Showing <strong>1-5</strong> of <strong>{sampleBuses.length}</strong> buses.
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">Page 1 of 1</span>
                     <Button variant="outline" size="sm">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    