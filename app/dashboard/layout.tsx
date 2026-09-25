import { redirect } from "next/navigation";

import Sidebar from "../../components/dashboard/Sidebar";
import { getCurrentUser } from "../../lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#070b1a] text-white lg:flex">
      <div className="hidden h-screen w-72 shrink-0 lg:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}