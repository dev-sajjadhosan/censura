import { GenresClient } from "@/components/Modules/Admin/Genres/GenresClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Censura | Admin Genres",
  description: "Manage media genres for discovery and filtering.",
};

export default function GenresPage() {
  return <GenresClient />;
}
