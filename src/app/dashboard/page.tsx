"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DashboardData } from "@/types/dashboard";
import Sidebar from "@/components/dashboard/Sidebar";
import Chat from "@/components/dashboard/Chat";
import ApiKeys from "@/components/dashboard/ApiKeys";
import Billing from "@/components/dashboard/Billing";
import Overview from "@/components/dashboard/Overview";
import StatsGrid from "@/components/dashboard/StatsGrid";
import Usage from "@/components/dashboard/Usage";
import Header from "@/components/dashboard/Header";
import Settings from "@/components/dashboard/Settings";

type ActiveSection =
  | "chat"
  | "overview"
  | "api-keys"
  | "usage"
  | "billing"
  | "settings";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>("chat");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch("/api/dashboard/stats", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "chat":
        return <Chat onDataUpdate={loadDashboardData} />;
      case "overview":
        return (
          <Overview
            dashboardData={dashboardData}
            onDataUpdate={loadDashboardData}
          />
        );
      case "api-keys":
        return <ApiKeys onDataUpdate={loadDashboardData} />;
      case "usage":
        return <Usage />;
      case "billing":
        return (
          <Billing
            balance={dashboardData?.overview?.balance || 0}
            onDataUpdate={loadDashboardData}
          />
        );
      case "settings":
        return <Settings user={user} />;
      default:
        return <Chat onDataUpdate={loadDashboardData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 h-full">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="flex-1">
        <Header user={user} balance={dashboardData?.overview?.balance || 0} />

        <div className="p-8">
          <StatsGrid stats={dashboardData?.overview} loading={dataLoading} />

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {renderActiveSection()}
          </div>
        </div>
      </main>
    </div>
  );
}
