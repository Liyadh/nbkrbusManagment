
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlarmClock,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bus,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Dot,
  FileText,
  Home,
  Map,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Plus,
  RefreshCw,
  Route,
  Search,
  Settings,
  Siren,
  TrendingUp,
  User,
  Users,
  X,
  Loader2,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ScheduleTripDialog } from "@/components/feature/ScheduleTripDialog";

const liveTrips = [
    { id: 1, busNo: "AP01AB1234", route: "Gudur -> College", progress: 67, stop: "8/12", eta: "07:23 AM", students: "42/50", issues: [], status: "ontime" },
    { id: 2, busNo: "AP01AB5678", route: "Rural -> College", progress: 45, stop: "5/11", eta: "07:41 AM", students: "38/45", issues: ["Late 12min"], status: "delayed" },
    { id: 3, busNo: "AP01AC7890", route: "City -> College", progress: 95, stop: "11/12", eta: "07:15 AM", students: "50/55", issues: [], status: "ontime" },
    { id: 4, busNo: "AP01AD9876", route: "Gudur -> College", progress: 20, stop: "2/12", eta: "08:05 AM", students: "15/50", issues: ["Traffic Jam"], status: "delayed" },
    { id: 5, busNo: "AP01AE4321", route: "Hostels -> College", progress: 100, stop: "Done", eta: "07:05 AM", students: "45/45", issues: [], status: "completed" },
    { id: 6, busNo: "AP01AF1111", route: "Industrial -> College", progress: 0, stop: "Not Started", eta: "08:30 AM", students: "0/50", issues: [], status: "planned" },
    { id: 7, busNo: "AP01AG2222", route: "Rural -> College", progress: 55, stop: "6/11", eta: "07:55 AM", students: "22/45", issues: ["Breakdown"], status: "stopped" },
];

const schedule = [
    { id: 1, time: "06:30 AM", bus: "AP01AB1234", route: "Gudur -> College", driver: "Raj Kumar", status: "Scheduled" },
    { id: 2, time: "06:45 AM", bus: "AP01AB5678", route: "Rural -> College", driver: "Anil Singh", status: "Scheduled" },
    { id: 3, time: "07:00 AM", bus: "AP01AC7890", route: "City -> College", driver: "Suresh Patel", status: "Scheduled" },
    { id: 4, time: "16:00 PM", bus: "AP01AB1234", route: "College -> Gudur", driver: "Raj Kumar", status: "Scheduled" },
    { id: 5, time: "16:15 PM", bus: "AP01AB5678", route: "College -> Rural", driver: "Anil Singh", status: "Scheduled" },
];


export default function TripsPage() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
        title: "Updating Trips...",
        description: "Requesting latest data for all trips.",
    });
    setTimeout(() => {
        setIsRefreshing(false);
        toast({
            title: "Refresh Complete",
            description: `Trip data updated at ${new Date().toLocaleTimeString()}`,
        })
    }, 1500);
  }

  const handleTripCreated = (newTrip: any) => {
    // In a real app, you'd likely invalidate a query cache (e.g., React Query)
    // and let it refetch the data from the server.
    // For this simulation, we'll just show a toast.
    toast({
      title: "Trip Scheduled",
      description: `New trip for bus ${newTrip.bus} on route ${newTrip.route} has been scheduled.`,
    });
    setIsScheduleOpen(false);
  };

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
  
  const getStatusInfo = (status: string) => {
    switch (status) {
        case "ontime": return { color: "bg-green-500", text: "Running" };
        case "delayed": return { color: "bg-yellow-500", text: "Delayed" };
        case "stopped": return { color: "bg-red-500", text: "Stopped" };
        case "boarding": return { color: "bg-orange-500", text: "Boarding" };
        case "completed": return { color: "bg-blue-500", text: "Completed" };
        case "planned":
        default: return { color: "bg-gray-400", text: "Planned" };
    }
  };


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
            <h1 className="text-lg font-semibold md:text-xl">Trips</h1>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search today's trips..."
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

        <main className="flex-1 overflow-auto p-4 md:p-6 flex flex-col">
          <Tabs defaultValue="today" className="flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Trip Operations</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4"/> Yesterday</Button>
                        <Button variant="outline" size="sm"><CalendarIcon className="mr-2 h-4 w-4"/> Today</Button>
                        <Button variant="ghost" size="sm">Tomorrow <ChevronRight className="h-4 w-4"/></Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
                        {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4"/>}
                        Force Refresh
                     </Button>
                     <Button onClick={() => setIsScheduleOpen(true)}><Plus className="mr-2 h-4 w-4"/>Schedule New Trip</Button>
                </div>
            </div>

            <div className="border-b">
                 <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="today">Today's Live Trips</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="today" className="flex-1 flex flex-col gap-6 pt-6">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Running</CardTitle><CircleDot className="h-4 w-4 text-green-500"/></CardHeader><CardContent><div className="text-2xl font-bold">8</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Delayed</CardTitle><Clock className="h-4 w-4 text-yellow-500"/></CardHeader><CardContent><div className="text-2xl font-bold">2</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><BadgeCheck className="h-4 w-4 text-blue-500"/></CardHeader><CardContent><div className="text-2xl font-bold">12</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Issues</CardTitle><AlertTriangle className="h-4 w-4 text-red-500"/></CardHeader><CardContent><div className="text-2xl font-bold">1</div></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Attendance</CardTitle><Users className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">92%</div></CardContent></Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    <Card className="lg:col-span-1">
                         <CardHeader><CardTitle>Live Map</CardTitle></CardHeader>
                         <CardContent className="h-[400px] bg-muted flex items-center justify-center">
                            <Map className="w-16 h-16 text-muted-foreground" />
                         </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Running Trips</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bus</TableHead>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>ETA</TableHead>
                                        <TableHead>Students</TableHead>
                                        <TableHead>Issues</TableHead>
                                        <TableHead className="text-right">Controls</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {liveTrips.map(trip => {
                                        const status = getStatusInfo(trip.status);
                                        return(
                                        <TableRow key={trip.id} className={cn({'bg-red-500/10': trip.status === 'stopped'})}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full animate-pulse", status.color)}></div>
                                                    {trip.busNo}
                                                </div>
                                            </TableCell>
                                            <TableCell>{trip.route}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Progress value={trip.progress} className="h-2" />
                                                    <span className="text-xs text-muted-foreground">{trip.progress}% ({trip.stop})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={cn({'text-yellow-600 font-bold': trip.status === 'delayed'})}>{trip.eta}</TableCell>
                                            <TableCell>{trip.students}</TableCell>
                                            <TableCell>
                                                {trip.issues.length > 0 ? (
                                                    <Badge variant="destructive">{trip.issues.join(', ')}</Badge>
                                                ) : <span className="text-muted-foreground text-xs">None</span>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MapPin className="h-4 w-4"/></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-4 w-4"/></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><X className="h-4 w-4"/></Button>
                                            </TableCell>
                                        </TableRow>
                                    )})}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="schedule" className="flex-1 flex flex-col gap-6 pt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Trip Schedule</CardTitle>
                        <CardDescription>Plan and manage upcoming trips.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Bus</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.map(trip => (
                                    <TableRow key={trip.id}>
                                        <TableCell className="font-medium">{trip.time}</TableCell>
                                        <TableCell>{trip.bus}</TableCell>
                                        <TableCell>{trip.route}</TableCell>
                                        <TableCell>{trip.driver}</TableCell>
                                        <TableCell><Badge variant="secondary">{trip.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="ghost" size="sm" className="text-red-500">Cancel</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="history" className="flex-1 flex items-center justify-center">
                 <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">History Under Construction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">The 'History' tab is currently being built. Please check back later.</p>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </main>
         <ScheduleTripDialog
            open={isScheduleOpen}
            onClose={() => setIsScheduleOpen(false)}
            onCreated={handleTripCreated}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
