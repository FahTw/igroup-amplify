"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");

    if (accessToken) {
      setIsLoggedIn(true);
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setRole(parsed?.role?.code ?? null);
        } catch {
          setRole(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    if (!accessToken || userData) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (!res.ok) return;
        const body = await res.json();
        const role = body.user?.role?.code ?? body.data?.user?.role?.code ?? null;
        setIsLoggedIn(true);
        setRole(role);
        const userObj = body.user ?? body.data?.user ?? (body.success && body.user) ?? null;
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
          setRole(userObj?.role?.code ?? null);
        }
      } catch (err) {}
    };

    loadProfile();
  }, []);

  

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    window.location.href = "/auth/login";
  };

  // กำหนดเมนูตาม role
  const menuLinks: MenuItem[] = isLoggedIn
    ? role === "ADMIN"
      ? [
          { label: "Subject", href: "/admin/subject" },
          { label: "Tag", href: "/admin/tag" },
          { label: "User", href: "/admin/user" },
        ]
      : [
          { label: "Profile", href: "/profile" },
          { label: "Subject", href: "/subject" },
          { label: "Manage Group", href: "/managegroup" },
        ]
    : [
        { label: "Login", href: "/auth/login" },
        { label: "Register", href: "/auth/register" },
      ];

  return (
    <nav>
      <div className="flex items-center justify-between px-8 py-4 shadow-lg">
        <h1 className="text-xl">
          <Logo />
        </h1>

        {!isLoggedIn ? (
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {menuLinks.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
