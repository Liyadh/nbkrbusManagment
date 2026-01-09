
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, Eye, Trash2 } from "lucide-react";

interface ManageDriverDocsDialogProps {
  open: boolean;
  onClose: () => void;
  driver: {
    id: number;
    name: string;
  } | null;
}

const documentTypes = [
    { id: "license", name: "Driving License", file: "driving_license.pdf" },
    { id: "aadhaar", name: "Aadhaar Card", file: "aadhaar_card.pdf" },
    { id: "pcc", name: "Police Clearance", file: null },
]

export function ManageDriverDocsDialog({ open, onClose, driver }: ManageDriverDocsDialogProps) {
  if (!driver) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Documents for {driver.name}</DialogTitle>
          <DialogDescription>
            Upload, view, or replace documents for this driver.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {documentTypes.map(doc => (
                <Card key={doc.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {doc.file ? (
                             <div className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                                <div className="flex items-center gap-3 font-medium">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <span>{doc.file}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4"/>Preview</Button>
                                    <Button variant="ghost" size="sm"><UploadCloud className="mr-2 h-4 w-4"/>Replace</Button>
                                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-center p-6 border-2 border-dashed rounded-lg">
                                <p className="text-sm text-muted-foreground">No file uploaded for {doc.name}.</p>
                                <Button asChild variant="outline">
                                    <Label className="cursor-pointer">
                                        <UploadCloud className="mr-2 h-4 w-4" /> Upload File
                                        <Input type="file" className="sr-only" />
                                    </Label>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    