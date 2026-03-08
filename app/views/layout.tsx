import { Sidebar } from "../components/global/Sidebar";

export default function ViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col h-full">
        {children}
      </div>
    </Sidebar>
  );
}
