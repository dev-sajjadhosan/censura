"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserInfoCellProps {
  name?: string;
  email?: string;
  profilePhoto?: string;
}

const UserInfoCell = ({ name, email, profilePhoto }: UserInfoCellProps) => {
  const fallback = name ? name[0].toUpperCase() : "U";

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border">
        <AvatarImage src={profilePhoto} alt={name || "User"} />
        <AvatarFallback className="text-xs bg-muted">{fallback}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate leading-none">
          {name || "Anonymous"}
        </span>
        {email && (
          <span className="text-xs text-muted-foreground truncate mt-1">
            {email}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserInfoCell;
