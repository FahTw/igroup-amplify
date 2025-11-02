"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Group {
  userId?: string;
  groupId: string;
  state?: string;
  group: {
    name: string;
    description?: string;
  };
  owner?: string;
  name?: string;
  isOwner?: boolean;
  description?: string;
  users?: number;
}

const ManageGroupCard = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  const getGroups = async () => {
    try {
      const myGroupRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/group/mygroup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );

      const data = await myGroupRes.json();
      if (!data.success) return;

      setGroups(data.groups || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {groups.map((group) => (
        <Card
          key={group.groupId}
          className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link href={`/${encodeURIComponent(group.group.name)}`}>
                <h3 className="text-blue-600 font-medium text-lg mb-1 hover:underline">
                  {group.group.name}
                </h3>
              </Link>
              <p className="text-gray-600">
                {group.group.description || "ไม่มีคำอธิบาย"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                Mini group
              </Badge>

              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>เจ้าของ {group.owner || "-"}</span>
              </div>

              {group.isOwner ? (
                <Link
                  href={`/editgroup/${encodeURIComponent(group.group.name)}`}
                >
                  <Button className="bg-yellow-500 text-white hover:bg-yellow-600">
                    แก้ไข
                  </Button>
                </Link>
              ) : (
                <Button className="bg-red-500 text-white hover:bg-red-600">
                  ออกจากกลุ่ม
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ManageGroupCard;
