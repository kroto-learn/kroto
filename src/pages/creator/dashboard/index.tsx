import { redirect } from "next/navigation";
import DashboardLayout from "./layout";

export default function Dashboard() {
  redirect("/creator/dashboard/events");
}

Dashboard.getLayout = DashboardLayout;
