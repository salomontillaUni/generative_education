import { Sidebar } from "../components/global/Sidebar";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";

export default async function ViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Sidebar user={user}>
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col h-full">
        {children}
      </div>
    </Sidebar>
  );
}
