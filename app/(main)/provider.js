import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./_components/AppSidebar";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Wrapper to keep trigger above welcome container */}
      <div className="w-full px-10 pb-10 pt-4">
        <div className="mb-2">
          {" "}
          {/* Add spacing between icon and WelcomeContainer */}
          <SidebarTrigger className="p-1" />
        </div>

        <WelcomeContainer />
        {children}
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;
