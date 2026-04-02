import PaymentClient from "@/components/Modules/Admin/Payment/PaymentClient";

export const metadata = {
  title: "Payments History | Censura Admin",
  description: "Manage all payment-related activities.",
};

export default function AdminPaymentsPage() {
  return (
    <PaymentClient/>
  );
}