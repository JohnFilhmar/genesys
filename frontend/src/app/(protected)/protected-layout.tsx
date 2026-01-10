'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarContent from "@/components/layouts/sidebar";
import { Menu, Search, X } from "lucide-react";
import { useAuth } from "@/hooks";
import { getToken } from "@/utils";

export default function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading, isError } = useAuth();

  useEffect(() => {
    const token = getToken();
    
    // If no token, redirect to login
    if (!token) {
      router.push('/login');
      return;
    }

    // If user fetch failed (invalid token, etc.), redirect to login
    if (!isLoading && isError) {
      router.push('/login');
    }
  }, [isLoading, isError, router]);

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-bio-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 flex font-sans min-h-screen">
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 fixed h-full flex-col border-r border-slate-800 z-30">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop (Click to close) */}
          <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar Panel */}
          <aside className="relative bg-slate-900 w-64 h-full shadow-2xl flex flex-col border-r border-slate-800 animate-in slide-in-from-left duration-200">
            {/* Close Button Row */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Reused Content */}
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-64 min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger Button (Visible only on Mobile) */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none text-sm w-32 lg:w-48" />
            </div>
            
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0" title={user?.teacher?.email || 'User'}>
              {user?.teacher?.firstName?.[0]?.toUpperCase() || 'T'}{user?.teacher?.lastName?.[0]?.toUpperCase() || 'C'}
            </div>
          </div>
        </header>
        {children}          
      </main>
    </div>
  );
}