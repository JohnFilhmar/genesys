"use client";

import { withAuth } from "@/middleware";
import Dashboard from "./dashboard";

function DashboardPage() {
  return (
    <Dashboard />
  );
}

export default withAuth(DashboardPage);