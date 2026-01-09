
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUp,
  Bus,
  ChevronDown,
  Filter,
  GraduationCap,
  Home,
  MapPin,
  RefreshCw,
  Route,
  Search,
  Settings,
  Siren,
  TrendingUp,
  User,
  Users,
  FileText,
  Loader2,
  PlusCircle,
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
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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


type KpiCardProps = {
  title: string;
  value: string;
  secondaryValue: string;
  icon: React.ElementType;
  trend?: string;
  trendDirection?: "up" | "down";
  iconBgColor: string;
  href?: string;
  onClick?: () => void;
};

function KpiCard({
  title,
  value,
  secondaryValue,
  icon: Icon,
  trend,
  trendDirection,
  iconBgColor,
  href,
  onClick,
}: KpiCardProps) {
  const CardContentComponent = () => (
    <Card className="transition-all hover:scale-[1.02] hover:shadow-md h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            iconBgColor
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{secondaryValue}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center gap-1",
                trendDirection === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              <ArrowUp
                className={cn(
                  "h-4 w-4",
                  trendDirection === "down" && "rotate-180"
                )}
              />
              {trend}
            </span>
            <span className="text-muted-foreground">this week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <CardContentComponent />
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="cursor-pointer">
      <CardContentComponent />
    </div>
  );
}

const alerts = [
  { id: 1, time: "16:23", busNo: "AP01AB123", type: "Late", duration: "12min", status: "warning" },
  { id: 2, time: "16:15", busNo: "AP01AB456", type: "Breakdown", duration: "25min", status: "critical" },
  { id: 3, time: "16:10", busNo: "AP01AB789", type: "Low Fuel", duration: "5min", status: "warning" },
  { id: 4, time: "16:05", busNo: "AP01AB321", type: "Off-Route", duration: "8min", status: "warning" },
];

export default function DashboardPage() {
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const pathname = usePathname();
  const alertsRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

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
        title: "Updating Buses...",
        description: "Requesting fresh GPS data from all drivers.",
    });
    setTimeout(() => {
        setIsRefreshing(false);
        toast({
            title: "Refresh Complete",
            description: `Bus data updated at ${new Date().toLocaleTimeString()}`,
        })
    }, 1500);
  }

  const handleAlertsClick = () => {
    alertsRef.current?.scrollIntoView({ behavior: "smooth" });
    toast({
      title: "Showing 2 Critical Alerts",
      description: "The most urgent issues are highlighted below.",
    });
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
            <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search buses, drivers..."
                className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Active Trips"
              value="5/12"
              secondaryValue="42% of total buses"
              icon={Bus}
              iconBgColor="bg-blue-500"
              trend="+3"
              trendDirection="up"
              href="/trips"
            />
            <KpiCard
              title="Live Alerts"
              value="2"
              secondaryValue="1 critical, 1 warning"
              icon={Siren}
              iconBgColor="bg-yellow-500"
              onClick={handleAlertsClick}
            />
            <KpiCard
              title="Avg Occupancy"
              value="78%"
              secondaryValue="Fleet average"
              icon={Users}
              iconBgColor="bg-green-500"
              trend="+5%"
              trendDirection="up"
              href="/students"
            />
            <KpiCard
              title="Total Students"
              value="450"
              secondaryValue="+12 new registrations"
              icon={GraduationCap}
              iconBgColor="bg-purple-500"
              href="/students"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle>Live Bus Tracking</CardTitle>
                  <CardDescription>
                    Real-time location of all active buses.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Show Buses</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>All Buses (12)</DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>Active/Running (5)</DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>Maintenance (3)</DropdownMenuCheckboxItem>
                           <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked>On-Time (3)</DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>Late (2)</DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>Stopped (0)</DropdownMenuCheckboxItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Reset Filters</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRefresh} disabled={isRefreshing}>
                    {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full rounded-md bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Live map would be here</p>
                </div>
                 <div className="mt-2 flex items-center justify-end gap-4 text-xs">
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#10b981]"></div>Ontime</div>
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#f59e0b]"></div>Late</div>
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>Stopped</div>
                </div>
              </CardContent>
            </Card>

            <Card ref={alertsRef}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>
                    Critical and warning alerts from the fleet.
                  </CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                  <Button variant="destructive" size="sm">
                    Clear All
                  </Button>
                   <Button variant="secondary" size="sm">
                    SMS All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Bus No.</TableHead>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id} className={cn(alert.status === 'critical' && 'bg-red-500/10')}>
                        <TableCell>{alert.time}</TableCell>
                        <TableCell>{alert.busNo}</TableCell>
                        <TableCell>
                          <Badge variant={alert.status === 'critical' ? 'destructive' : 'default'} className={cn(alert.status === 'warning' && "bg-yellow-500 text-white")}>
                            {alert.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.duration}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Resolve</Button>
                          <Button variant="ghost" size="sm">Notify</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <footer className="sticky bottom-0 border-t bg-background px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>v1.0.0</span>
            <span>Last sync: Just now</span>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
