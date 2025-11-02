"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useParams } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export default function Sidebar({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  const pathname = usePathname();

  const { groupname } = useParams() as { groupname?: string };
  const groupSafeName =
    groupname && typeof groupname === "string" ? decodeURIComponent(groupname) : "default-group";


  const nav: NavItem[] = [
    { label: "Dashboard", href: `/${encodeURIComponent(groupSafeName)}` },
    { label: "Task", href: `/${encodeURIComponent(groupSafeName)}/task` },
    { label: "Archived", href: `/${encodeURIComponent(groupSafeName)}/archived` },
    { label: "Users", href: `/${encodeURIComponent(groupSafeName)}/member` },
  ];

  return (
    <aside
      className={`bg-white border-r h-screen ${open ? "w-56" : "w-16"} transition-width duration-200 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0059ff] rounded-sm" />
          {open && <span className="font-semibold">iGroup</span>}
        </div>
        <button
          aria-label="Toggle sidebar"
          onClick={() => setOpen((s) => !s)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-2 rounded ${open ? "justify-start" : "justify-center"
                    } ${isActive ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
                >
                  <span className="w-5 h-5 bg-gray-300 rounded" />
                  {open && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 text-xs text-center text-gray-500">
        {open ? "Logged in as IT66070032" : <span title="Logged in as IT66070032">IT6607</span>}
      </div>
    </aside>
  );
}
