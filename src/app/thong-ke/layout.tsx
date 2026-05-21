import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { I18nProvider } from "@/context/I18nContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-[#0070f3] selection:text-white transition-colors duration-300">
        <AdminHeader />
        <div className="flex pt-16 h-screen">
          <AdminSidebar />
          <main className="flex-1 md:ml-64 bg-gray-50/50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full transition-colors duration-300">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </I18nProvider>
  );
}
