import Navbar from "@/components/Modules/Home/navbar";

export default function CommonPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
