"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r">
      <div className="px-6 pb-16 bg-[#d9dea5]">
        <Link href="/" className="text-2xl font-bold">
          <span className="ml-[30rem] mr-auto text-justify">
            <img
              src="https://cdn.prod.website-files.com/656ddb1f77f5af1d193d7150/656ddd16e17e0d8eed192bed_Group%2037.png"
              loading="lazy"
              width="124"
              alt=""
              class="f-logo"
            />
          </span>
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
