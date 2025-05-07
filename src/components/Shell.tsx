
import React from "react";
import { Outlet } from "react-router-dom";
import GlobalNav from "./GlobalNav";
import { Toaster } from "./ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./ui/sidebar";

export function Shell() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalNav />
      
      <div className="flex flex-1 pt-16">
        {!isMobile && <Sidebar />}
        
        <main className="flex-1 w-full">
          <div className="container max-w-[1400px] px-4 py-6 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
