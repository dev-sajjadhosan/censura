export const dynamic = "force-dynamic";

import Footer from "@/components/Modules/Home/Footer";
import Navbar from "@/components/Modules/Home/navbar";
import NavbarSkeleton from "@/components/Modules/Home/NavSkeleton";
import VisibilityWrapper from "@/components/Providers/VisibilityWrapper";
import { Suspense } from "react";

export default function CommonPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      {children}
      <VisibilityWrapper>
        <Footer />
      </VisibilityWrapper>
    </>
  );
}
