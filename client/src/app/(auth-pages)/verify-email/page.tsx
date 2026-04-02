export const dynamic = "force-dynamic";

import VerifyEmailContent from "@/components/Modules/Auth/verify-email-content";

export default async function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <VerifyEmailContent />
    </div>
  );
}