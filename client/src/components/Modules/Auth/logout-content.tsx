"use client";

import ItemLists from "@/components/Shared/item-list";
import logout from "../../../../public/logout.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import AppField from "@/components/Shared/Form/AppField";
import { Textarea } from "@/components/ui/textarea";
import LogoutDialog from "@/components/Modules/Auth/logout-dialog";

const reasons = [
  {
    id: "reason1",
    label: "I found a better platform",
  },
  {
    id: "reason2",
    label: "I don't use this platform anymore",
  },
  {
    id: "reason3",
    label: "I have another account",
  },
  {
    id: "reason4",
    label: "Other",
  },
];

export default function LogoutContent() {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex w-11/12 mx-auto h-screen">
        {/* <h3 className="text-lg">Logout</h3> */}
        <div className="flex flex-col items-start justify-center w-full h-full">
          <div className="flex flex-col items-start gap-3">
            <h1 className="text-8xl font-bold">Bye, User!</h1>
            <p className="text-md text-muted-foreground">
              We are sad to see you go. Please let us know why you are leaving
              us.
            </p>
          </div>
          <div className="flex flex-col items-start gap-5 mt-9">
            <h3 className="text-md text-muted-foreground">
              Would you like to tell us why you are leaving us?
            </h3>
            <div className="flex flex-col gap-2 w-full">
              <ItemLists
                data={reasons}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
            {selected === "Other" && (
              <div className="flex flex-col gap-2 w-full">
                <Textarea
                  placeholder="Enter your reason"
                  className="h-24 border-0 p-3 resize-none"
                />
              </div>
            )}
            <LogoutDialog open={open} setOpen={setOpen} />
            <Button
              disabled={!selected}
              className="ml-auto w-44"
              size={"xl"}
              onClick={() => setOpen(!open)}
            >
              Logout <LogOut />{" "}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center w-full h-full">
          <Image src={logout} alt="Logout" width={400} height={400} />
        </div>
      </div>
    </>
  );
}
