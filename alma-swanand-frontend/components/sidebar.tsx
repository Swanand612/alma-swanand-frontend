"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#F7F7DC] border-r">
      <div className="p-6">
        <Link href="/admin" className="text-2xl font-bold">
          almă
        </Link>
      </div>
      <nav className="space-y-1 px-3">
        <Link
          href="/admin/leads"
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            pathname === "/admin/leads"
              ? "bg-white text-gray-900"
              : "text-gray-600 hover:bg-white hover:text-gray-900"
          )}
        >
          Leads
        </Link>
        <Link
          href="/"
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            pathname === "/admin/settings"
              ? "bg-white text-gray-900"
              : "text-gray-600 hover:bg-white hover:text-gray-900"
          )}
        >
          Settings
        </Link>
      </nav>
      <div className="absolute bottom-0 w-64 p-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            A
          </div>
          <div className="text-sm font-medium">Admin</div>
        </div>
      </div>
    </div>
  );
}
