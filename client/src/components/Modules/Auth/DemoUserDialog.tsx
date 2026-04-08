import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users2 } from "lucide-react";
import { toast } from "sonner";

interface IDemoUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

const demoUsers: IDemoUser[] = [
  {
    id: 1,
    name: "Admin 1",
    email: "defaultadmin@gmail.com",
    password: "password12345",
    // avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "User 1",
    email: "wiviyo7838@lealking.com",
    password: "123456789",
    // avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "User 2",
    email: "yo8nrwc1iv@bltiwd.com",
    password: "123456789",
    // avatar: "https://i.pravatar.cc/150?u=3",
  },
];

export default function DemoUserDialog({ form }: { form: any }) {
  const handleDemoUser = (user: IDemoUser) => {
    form.setFieldValue("email", user.email);
    form.setFieldValue("password", user.password);
    setTimeout(() => form.handleSubmit(), 100);
    toast.info(`Demo ${user.name} credentials applied!`);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant={"outline"} size={"lg"}>
            <Users2 />
            Try Demo Users
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-xl p-7">
          <DialogHeader>
            <DialogTitle>Pick Your User Profile</DialogTitle>
            <DialogDescription>
              Here are some demo users you can use to test the application.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-11">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {demoUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleDemoUser(user)}
                  className="flex flex-col items-center gap-3 border border-secondary px-3 py-3 rounded-xl hover:bg-secondary cursor-pointer"
                >
                  <Avatar className="size-17">
                    <AvatarImage src={""} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <h3 className="text-sm font-medium">{user.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
