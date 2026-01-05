'use client';

import { removeToken, removeTokenCookie } from "@/utils";
import { BarChart3, Dna, FileText, LayoutDashboard, LogOut, Play, Settings, Users } from "lucide-react";
import Link from "next/link";

// Shared Sidebar Content (to avoid duplication)
export default function SidebarContent() {

  async function handleSignOut(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    removeToken();
    removeTokenCookie();
    window.location.href = '/login';
  };
  
  return (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="bg-linear-to-br from-bio-400 to-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
            <Dna className="text-white w-5 h-5" />
          </div>
          Gene<span className="text-bio-400">Sys</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <NavItem href="/dashboard" icon={LayoutDashboard} active>Dashboard</NavItem>
        <NavItem href="/questions" icon={FileText}>Question Bank</NavItem>
        <NavItem href="/rooms" icon={Play}>My Rooms</NavItem>
        <NavItem href="/analytics" icon={BarChart3}>Analytics & Reports</NavItem>
        <NavItem href="/students" icon={Users}>Students</NavItem>
      </nav>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <NavItem href="/settings" icon={Settings}>Settings</NavItem>
        <button onClick={(e) => handleSignOut(e)} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-dna-400 hover:text-dna-300 hover:bg-slate-800 rounded-lg transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </>
  );
}

// Nav Link Component
function NavItem({ href, icon: Icon, children, active = false }: { href: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
      {children}
    </Link>
  );
}