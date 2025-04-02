import { redirect } from "next/navigation";

export default function DashboardPage() {
    redirect("/admin/superAdminDashboard/addOperator");
}