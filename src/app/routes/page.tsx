
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bus,
  ChevronDown,
  Clock,
  Edit,
  Globe,
  Home,
  Map,
  MapPin,
  MoreVertical,
  PlusCircle,
  Route as RouteIcon,
  Search,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Users,
  FileText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { NewRouteDialog } from "@/components/feature/NewRouteDialog";

type Stop = {
    id: number;
    name: string;
    distance: string;
    cumulative: string;
    time: string;
    wait: string;
};

type Route = {
    id: number;
    name: string;
    status: "Active" | "Scheduled" | "Inactive";
    stops: number;
    distance: string;
    duration: string;
    stopDetails?: Stop[];
};


const sampleRoutes: Route[] = [
    { id: 1, name: "Gudur Main → College", status: "Active", stops: 12, distance: "28.5 km", duration: "75 min", stopDetails: [
        { id: 1, name: "Gudur Bus Stand", distance: "0 km", cumulative: "0 km", time: "06:30 AM", wait: "2 min" },
        { id: 2, name: "Gandhi Circle", distance: "2.3 km", cumulative: "2.3 km", time: "06:35 AM", wait: "3 min" },
        { id: 3, name: "Rural Village", distance: "8.1 km", cumulative: "10.4 km", time: "06:48 AM", wait: "2 min" },
        { id: 12, name: "College Gate", distance: "3.2 km", cumulative: "28.5 km", time: "07:45 AM", wait: "-" },
    ]},
];

export default function RoutesPage() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();
  
  const [routes, setRoutes] = React.useState<Route[]>(sampleRoutes);
  const [selectedRouteId, setSelectedRouteId] = React.useState<number | null>(1);
  const [isEditingRoute, setIsEditingRoute] = React.useState(false);
  const [editableRouteData, setEditableRouteData] = React.useState<Route | null>(null);
  const [isNewRouteOpen, setIsNewRouteOpen] = React.useState(false);

  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);
  
  const handleEditRoute = (routeId: number) => {
    if (isEditingRoute && routeId !== selectedRouteId) {
      if (!confirm("You have unsaved changes. Are you sure you want to switch and discard them?")) {
        return;
      }
    }
    const routeToEdit = routes.find(r => r.id === routeId);
    setSelectedRouteId(routeId);
    setIsEditingRoute(true);
    setEditableRouteData(JSON.parse(JSON.stringify(routeToEdit))); // Deep copy
  };

  const handleCancelEdit = () => {
    setIsEditingRoute(false);
    setEditableRouteData(null);
  };
  
  const handleSaveChanges = () => {
    // API call would go here
    console.log("Saving changes for route:", editableRouteData);
    toast({
      title: "Route Updated",
      description: `Changes for route "${editableRouteData?.name}" have been saved.`,
    });
    
    if (editableRouteData) {
        setRoutes(prevRoutes => prevRoutes.map(r => r.id === editableRouteData.id ? editableRouteData : r));
    }

    setIsEditingRoute(false);
    setEditableRouteData(null);
  };
  
  const handleRouteCreated = (newRouteData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
        id: routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1,
        ...newRouteData,
        distance: newRouteData.distance || "N/A",
        duration: newRouteData.duration || "N/A",
        stopDetails: newRouteData.stopDetails?.map((s, i) => ({ ...s, id: i+1})) || [],
    };
    setRoutes(prev => [newRoute, ...prev]);
    setSelectedRouteId(newRoute.id);
    toast({
        title: "Route Created",
        description: `New route "${newRoute.name}" has been added.`
    });
    setIsNewRouteOpen(false);
  }

  const navItems = [
    { name: "Home", icon: Home, href: "/dashboard" },
    { name: "Buses", icon: Bus, href: "/buses" },
    { name: "Drivers", icon: User, href: "/drivers" },
    { name: "Routes", icon: RouteIcon, href: "/routes" },
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
            <h1 className="text-lg font-semibold md:text-xl">Routes</h1>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search routes or stops..."
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

        <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold">Route Management</h1>
                    <p className="text-sm text-muted-foreground">Manage all college bus routes and stops.</p>
                </div>
                <Button size="sm" onClick={() => setIsNewRouteOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Route
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="w-full md:w-2/5 lg:w-1/3 border-r overflow-y-auto">
                    <Card className="rounded-none border-0 border-b">
                        <CardHeader>
                            <CardTitle>Routes List</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Accordion type="single" collapsible defaultValue="item-1" value={`item-${selectedRouteId}`} onValueChange={(value) => setSelectedRouteId(Number(value.replace('item-', '')))}>
                                {routes.map(route => (
                                    <AccordionItem value={`item-${route.id}`} key={route.id}>
                                        <AccordionTrigger className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Badge variant={route.status === 'Active' ? 'default' : 'secondary'} className={cn(
                                                    {'bg-green-500 hover:bg-green-600': route.status === 'Active'},
                                                    {'bg-yellow-500 hover:bg-yellow-600': route.status === 'Scheduled'},
                                                    {'bg-gray-500 hover:bg-gray-600': route.status === 'Inactive'}
                                                )}>
                                                    {route.status}
                                                </Badge>
                                                <span>{route.name}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-3">
                                             <div className="flex justify-between text-sm text-muted-foreground px-2">
                                                <span>{route.stops} stops</span>
                                                <span>{route.distance}</span>
                                                <span>{route.duration}</span>
                                            </div>
                                             <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditRoute(route.id)}>
                                                    <Edit className="h-3 w-3 mr-2" /> Edit
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                             </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel */}
                <div className="hidden md:flex flex-1 flex-col overflow-hidden">
                    <div className="flex-1 bg-muted flex items-center justify-center relative">
                        <Map className="w-32 h-32 text-muted-foreground" />
                         <p className="absolute bottom-4 text-muted-foreground text-sm">Interactive map will be displayed here</p>
                    </div>
                     <div className="border-t">
                        <CardHeader>
                             <div className="flex items-center justify-between">
                                {isEditingRoute ? (
                                    <>
                                        <div>
                                            <CardTitle>Editing Route: {editableRouteData?.name}</CardTitle>
                                            <CardDescription>Drag and drop stops or edit timings.</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <CardTitle>Route Details: {selectedRoute?.name}</CardTitle>
                                            <CardDescription>Drag and drop stops to reorder.</CardDescription>
                                        </div>
                                        <Select defaultValue="AP01AB1234">
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Assign Bus" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="AP01AB1234">Bus AP01AB1234</SelectItem>
                                            <SelectItem value="AP01AB5678">Bus AP01AB5678</SelectItem>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                          </SelectContent>
                                        </Select>
                                    </>
                                )}
                             </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Stop Name</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Cumulative</TableHead>
                                    <TableHead>Est. Time</TableHead>
                                    <TableHead>Avg Wait</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(isEditingRoute ? editableRouteData?.stopDetails : selectedRoute?.stopDetails)?.map((stop, index) => (
                                        <TableRow key={stop.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {isEditingRoute ? <Input defaultValue={stop.name} className="h-8"/> : stop.name}
                                            </TableCell>
                                            <TableCell>
                                                {isEditingRoute ? <Input defaultValue={stop.distance} className="h-8 w-24"/> : stop.distance}
                                            </TableCell>
                                            <TableCell>{stop.cumulative}</TableCell>
                                            <TableCell>
                                                {isEditingRoute ? <Input type="time" defaultValue={stop.time.includes('AM') ? '06:30' : '18:30'} className="h-8"/> : stop.time}
                                            </TableCell>
                                            <TableCell>
                                                {isEditingRoute ? <Input defaultValue={stop.wait} className="h-8 w-20"/> : stop.wait}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                     </div>
                </div>
            </div>
        </main>
      </SidebarInset>
       <NewRouteDialog
        open={isNewRouteOpen}
        onClose={() => setIsNewRouteOpen(false)}
        onCreated={handleRouteCreated}
      />
    </SidebarProvider>
  );
}
