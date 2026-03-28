"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Mail,
  Calendar,
  UserX,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  adminGetAllUsers,
  adminUpdateUserStatus,
} from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";

export default function UsersClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => adminGetAllUsers(),
  });
  const users = data?.data.data as any;
  const pagination = data?.data.meta;

  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  console.log("data from admin-users client: ", users);

  const handleToggleBlock = async (
    userId: string,
    currentStatus: string,
    name: string,
  ) => {
    const newStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const action = newStatus === "BLOCKED" ? "block" : "unblock";

    if (!confirm(`Are you sure you want to ${action} "${name}"?`)) return;

    try {
      setActionLoading(userId);
      await adminUpdateUserStatus(userId, newStatus);

      toast.success(`User ${action}ed successfully`);
    } catch (e: any) {
      toast.error(e?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "BLOCKED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "UNVERIFIED":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage registered users.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9 text-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border rounded-xl text-center">
          <Users className="size-10 text-muted-foreground" />
          <p className="font-medium">No users found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span className="col-span-4">User</span>
            <span className="col-span-2">Email</span>
            <span className="col-span-1">Role</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-2">Joined</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {users.map((user: any) => (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors text-sm"
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <Avatar className="size-9 shrink-0">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="text-xs">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    {user.profile?.bio && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.profile.bio}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-muted-foreground text-xs truncate flex items-center gap-1">
                  <Mail className="size-3 shrink-0" />
                  {user.email}
                </div>
                <div className="col-span-1">
                  <Badge
                    className={
                      user.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-500 border-purple-500/20 text-xs"
                        : "text-xs"
                    }
                    variant="secondary"
                  >
                    {user.role === "ADMIN" ? (
                      <ShieldCheck className="size-2.5 mr-1" />
                    ) : null}
                    {user.role}
                  </Badge>
                </div>
                <div className="col-span-1">
                  <Badge className={`text-xs ${statusColor(user.status)}`}>
                    {user.status}
                  </Badge>
                </div>
                <div className="col-span-2 text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </div>
                <div className="col-span-2 flex justify-end">
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant={
                        user.status === "BLOCKED" ? "default" : "outline"
                      }
                      className={`text-xs ${
                        user.status === "BLOCKED"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-red-500 border-red-500/30 hover:bg-red-500/10"
                      }`}
                      disabled={actionLoading === user.id}
                      onClick={() =>
                        handleToggleBlock(user.id, user.status, user.name)
                      }
                    >
                      {user.status === "BLOCKED" ? (
                        <>
                          <UserCheck className="size-3 mr-1" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <UserX className="size-3 mr-1" />
                          Block
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
