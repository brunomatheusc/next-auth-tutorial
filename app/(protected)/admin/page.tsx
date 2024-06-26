"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

export default function AdminPage() {
  const onApiRouteClick = async () => {
    fetch("/api/admin")
      .then((res) => {
        if (res.ok) {
          toast.success("Allowed API Route!");
          console.log("Okay");
          return;
        }
        
        toast.error("FORBIDDEN API Route!");
        console.error("FORBIDDEN");
      });
  };

  const onServerActionClick = async () => {
    admin()
      .then((data) => {
        if (data.success) {
          toast.success("Allowed Server Action!");
          return;
        }

        toast.error("FORBIDDEN Server Action!");
        console.error("FORBIDDEN");
      });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Admin
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <FormSuccess 
            message="You are allowed to view this content!" 
          />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API route
          </p>

          <Button onClick={onApiRouteClick}>
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only Server Action
          </p>

          <Button onClick={onServerActionClick}>
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}