
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {isMobile ? (
        <>
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 bg-primary text-white p-2 rounded-md"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
          )}
          
          <div className={`fixed top-0 left-0 h-full z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="relative">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 bg-primary text-white p-2 rounded-md"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <Sidebar />
            </div>
          </div>
        </>
      ) : (
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>
      )}
      
      <div className="flex-1 flex flex-col pl-64">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
