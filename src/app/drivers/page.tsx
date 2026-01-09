
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
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
  Home,
  Loader2,
  MapPin,
  MoreHorizontal,
  PlusCircle,
  Route,
  Search,
  Settings,
  Trash,
  TrendingUp,
  User,
  Users,
  UserCheck,
  UserX,
  Calendar as CalendarIcon
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const driverSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  phone: z.string().regex(/^\+91-\d{10}$/, "Enter a valid 10-digit phone number with country code."),
  dob: z.date({ required_error: "Date of birth is required." }),
  licenseNo: z.string().min(1, "License number is required."),
  licenseExpiry: z.date({ required_error: "License expiry date is required." }),
  assignedBus: z.string().optional(),
  status: z.enum(["Active", "On Leave", "Inactive"]),
});

type Driver = z.infer<typeof driverSchema>;

const sampleDrivers: (Driver & { id: number; docs: string; avatar: string })[] = [
  { id: 1, name: "Raj Kumar", phone: "+91-9876543210", licenseNo: "DL12345678", assignedBus: "AP01AB1234", status: "Active", docs: "Complete", licenseExpiry: new Date("2026-06-15"), avatar: "https://i.pravatar.cc/150?u=raj" },
  { id: 2, name: "Anil Singh", phone: "+91-9988776655", licenseNo: "DL87654321", assignedBus: "Unassigned", status: "Active", docs: "Expiring Soon", licenseExpiry: new Date("2024-08-01"), avatar: "https://i.pravatar.cc/150?u=anil" },
  { id: 3, name: "Suresh Patel", phone: "+91-9123456789", licenseNo: "DL56781234", assignedBus: "AP01AC7890", status: "On Leave", docs: "Complete", licenseExpiry: new Date("2025-11-20"), avatar: "https://i.pravatar.cc/150?u=suresh" },
  { id: 4, name: "Vikram Reddy", phone: "+91-9000011111", licenseNo: "DL34567812", assignedBus: "AP01AD9876", status: "Active", docs: "Pending", licenseExpiry: new Date("2027-02-10"), avatar: "https://i.pravatar.cc/150?u=vikram" },
  { id: 5, name: "Mahesh Babu", phone: "+91-9222233333", licenseNo: "DL98761234", assignedBus: "AP01AE4321", status: "Inactive", docs: "Complete", licenseExpiry: new Date("2028-01-01"), avatar: "https://i.pravatar.cc/150?u=mahesh" },
];

export default function DriversPage() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDriver, setEditingDriver] = React.useState<(Driver & { id: number }) | null>(null);

  const form = useForm<Driver>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      status: "Active",
    },
  });

  React.useEffect(() => {
    if (isModalOpen && editingDriver) {
      form.reset(editingDriver);
    } else if (!isModalOpen) {
      form.reset({
        name: "",
        phone: "+91-",
        licenseNo: "",
        assignedBus: "",
        status: "Active",
      });
      setEditingDriver(null);
    }
  }, [isModalOpen, editingDriver, form]);

  const onSubmit = (values: Driver) => {
    console.log("Form submitted", values);
    // TODO: API call to add/edit driver
    setIsModalOpen(false);
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
  
  const handleEditClick = (driver: Driver & { id: number }) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const getDocStatus = (date: Date) => {
      const today = new Date();
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) return { text: "Expired", color: "bg-red-500", pulse: true };
      if (diffDays <= 30) return { text: `${diffDays} days left`, color: "bg-red-500", pulse: true };
      if (diffDays <= 90) return { text: `${diffDays} days left`, color: "bg-yellow-500", pulse: false };
      return { text: `Exp in ${Math.floor(diffDays/30)} months`, color: "bg-green-500", pulse: false };
  }

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
            <h1 className="text-lg font-semibold md:text-xl">Drivers</h1>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search drivers..."
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
              <h1 className="text-3xl font-bold">Driver Management</h1>
              <p className="text-muted-foreground">Manage drivers, licenses, and bus assignments</p>
            </div>
             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" onClick={() => setIsModalOpen(true)}>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add New Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>{editingDriver ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                  <DialogDescription>
                    {editingDriver
                      ? `Update details for ${editingDriver.name}`
                      : "Fill in the details to add a new driver."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="Raj Kumar" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input placeholder="+91-9876543210" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                         <FormField control={form.control} name="dob" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of Birth</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1950-01-01")} initialFocus />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormItem>
                            <FormLabel>Photo</FormLabel>
                            <FormControl>
                                <Input type="file" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      </div>
                      <div className="space-y-4">
                        <FormField control={form.control} name="licenseNo" render={({ field }) => (
                            <FormItem><FormLabel>License No.</FormLabel><FormControl><Input placeholder="DLXXXXXXXX" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="licenseExpiry" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>License Expiry</FormLabel>
                                 <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormItem>
                            <FormLabel>Aadhaar No.</FormLabel>
                            <FormControl>
                                <Input placeholder="XXXX-XXXX-XXXX" />
                            </FormControl>
                        </FormItem>
                      </div>
                       <div className="space-y-4">
                         <FormField control={form.control} name="assignedBus" render={({ field }) => (
                           <FormItem>
                            <FormLabel>Assigned Bus</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a bus" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="AP01AB1234">AP01AB1234</SelectItem>
                                <SelectItem value="AP01AB5678">AP01AB5678</SelectItem>
                                <SelectItem value="Unassigned">Unassigned</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                           </FormItem>
                         )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                           <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">🟢 Active</SelectItem>
                                <SelectItem value="On Leave">🟡 On Leave</SelectItem>
                                <SelectItem value="Inactive">⚫ Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                           </FormItem>
                         )} />
                       </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Save Driver
                        </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">18</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">15</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                    <UserX className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">1</div></CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">License Expiring</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">2</div></CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Driver List</CardTitle>
                     <div className="flex items-center gap-2">
                        <Input placeholder="Search by Name, License..." className="w-[250px]"/>
                         <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="On Leave">On Leave</SelectItem>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>License No.</TableHead>
                    <TableHead>Assigned Bus</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Docs Expiry</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDrivers.map((driver) => {
                      const docStatus = getDocStatus(driver.licenseExpiry);
                      return (
                        <TableRow key={driver.id}>
                          <TableCell><Checkbox /></TableCell>
                          <TableCell className="font-medium flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                  <AvatarImage src={driver.avatar} alt={driver.name} />
                                  <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                              </Avatar>
                              {driver.name}
                          </TableCell>
                          <TableCell>{driver.phone}</TableCell>
                          <TableCell>{driver.licenseNo}</TableCell>
                          <TableCell>{driver.assignedBus || 'Unassigned'}</TableCell>
                          <TableCell>
                            <Badge variant={driver.status === 'On Leave' ? 'default' : driver.status === 'Inactive' ? 'secondary' : 'default'}
                                className={cn(
                                    {'bg-green-500 text-white hover:bg-green-600': driver.status === 'Active'},
                                    {'bg-yellow-500 text-white hover:bg-yellow-600': driver.status === 'On Leave'},
                                    {'bg-gray-500 text-white hover:bg-gray-600': driver.status === 'Inactive'}
                                )}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                           <TableCell>
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", docStatus.color, docStatus.pulse && "animate-pulse")}></div>
                                <span className={cn(docStatus.pulse && "text-red-600 font-medium")}>{docStatus.text}</span>
                            </div>
                           </TableCell>
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
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditClick(driver)}>
                                    <FilePen className="mr-2 h-4 w-4" />
                                    Edit Driver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Manage Documents
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
                      )
                  })}
                </TableBody>
              </Table>
            </CardContent>
             <div className="flex items-center justify-between p-4 border-t">
                 <div className="text-sm text-muted-foreground">
                    Showing <strong>1-5</strong> of <strong>{sampleDrivers.length}</strong> drivers.
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
