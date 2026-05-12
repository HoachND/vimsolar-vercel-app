import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | VimSolar",
  robots: "noindex, nofollow", // Admin page should not be indexed
};

export default function AdminPage() {
  return <AdminDashboard />;
}
