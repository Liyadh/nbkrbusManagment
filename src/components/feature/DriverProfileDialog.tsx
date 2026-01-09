
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DriverProfileDialogProps {
  open: boolean;
  onClose: () => void;
  driver: {
    id: number;
    name: string;
    phone: string;
    dob: Date | string;
    licenseNo: string;
    licenseExpiry: Date | string;
    assignedBus?: string;
    status: "Active" | "On Leave" | "Inactive";
    avatar: string;
  } | null;
}

const getInitials = (name: string) => {
    if (!name) return "";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
};

export function DriverProfileDialog({ open, onClose, driver }: DriverProfileDialogProps) {
  if (!driver) return null;

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
          return "Invalid Date";
      }
      return format(dateObj, "PPP");
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Driver Profile</DialogTitle>
          <DialogDescription>
            Detailed information for {driver.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-1 flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 text-4xl">
                    <AvatarImage src={driver.avatar} alt={driver.name} />
                    <AvatarFallback>{getInitials(driver.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{driver.name}</h2>
                    <p className="text-muted-foreground">{driver.phone}</p>
                </div>
                <Badge variant={driver.status === 'Active' ? 'default' : 'secondary'} className={driver.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}>{driver.status}</Badge>
            </div>
            <div className="md:col-span-2 space-y-4">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Personal Information</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between"><span>Date of Birth:</span> <span className="font-medium">{formatDate(driver.dob)}</span></div>
                        <div className="flex justify-between"><span>Contact:</span> <span className="font-medium">{driver.phone}</span></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-lg">License & Assignment</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="flex justify-between"><span>License No:</span> <span className="font-medium">{driver.licenseNo}</span></div>
                        <div className="flex justify-between"><span>License Expiry:</span> <span className="font-medium">{formatDate(driver.licenseExpiry)}</span></div>
                        <Separator className="my-2" />
                        <div className="flex justify-between"><span>Assigned Bus:</span> <span className="font-medium">{driver.assignedBus || "Unassigned"}</span></div>
                    </CardContent>
                </Card>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
