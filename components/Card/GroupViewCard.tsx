"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

interface Group {
  id: string;
  name: string;
  desc: string;
  owner: string;
  tag?: string;
  isOwner?: boolean;
  isPending?: boolean;
  isMember?: boolean;
}
// Raw shapes coming from the API
type RawGroup = {
  id?: string;
  name?: string;
  desc?: string;
  owner?: string;
  subjectName?: string;
  tag?: string;
  tags?: Array<{ name?: string }>;
  isOwner?: boolean;
};
type RawUserGroup = { groupId?: string; state?: string; isOwner?: boolean };
interface GroupViewCardProps {
  subjectName: string;
}
const GroupViewCard = ({ subjectName }: GroupViewCardProps) => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchGroups = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });


      const data = await res.json();
      if (data.success && Array.isArray(data.groups)) {
        const rawGroups = data.groups as RawGroup[];
        const filtered = rawGroups.filter((g) => (g.subjectName ?? "").toLowerCase() === subjectName.toLowerCase());

        const list: Group[] = filtered.map((g) => ({
          id: g.id ?? "",
          name: g.name ?? "",
          desc: g.desc ?? "",
          owner: g.owner ?? "",
          tag: g.tag || g.tags?.[0]?.name || undefined,
          isOwner: !!g.isOwner,
          isPending: false,
          isMember: false,
        }));
        setGroups(list);
        return list;
      } else {
        toast.error("โหลดข้อมูลกลุ่มไม่สำเร็จ");
        return [];
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      return [];
    }
  };
  const fetchTags = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        return data.tags;
      } else {
        toast.error("โหลดแท็กไม่สำเร็จ");
        return [];
      }
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการโหลดแท็ก");
      return [];
    }
  };


  const getStatus = async (groupList: Group[]) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/mygroup`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!data.success) return;

      const userGroups = (data.groups ?? []) as RawUserGroup[];
      const merged = groupList.map((g) => {
        const found = userGroups.find((ug) => ug.groupId === g.id);
        const state = found?.state as string | undefined;
        return {
          ...g,
          isOwner: g.isOwner || !!found?.isOwner,
          isPending: state === "PENDING",
          isMember: !!state && ["APPROVED", "JOINED", "ACCEPTED"].includes(state),
        };
      });
      setGroups(merged);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  const joinGroup = async (groupId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/join/${groupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      credentials: "include",
    });
    const data = await res.json();
    if (!data.success) return toast.error(data.message);
    toast.success(data.message);

    const newGroups = await fetchGroups();
    await getStatus(newGroups);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return router.push("/auth/login");

    const load = async () => {
      setLoading(true);
      const list = await fetchGroups();
      await getStatus(list);
      setLoading(false);
    };
    load();
  }, [subjectName]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto text-center text-gray-500 py-10">
        กำลังโหลดข้อมูล...
      </div>
    );

  if (!groups.length)
    return (
      <div className="max-w-4xl mx-auto text-center text-gray-500 py-10">
        ยังไม่มีกลุ่มให้แสดงผล
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Toaster position="top-right" />
      {groups.map((group) => {
        // ✅ สีของ Badge สถานะ

        // ✅ สีของปุ่มตามสถานะ
        let buttonColor = "bg-blue-600 hover:bg-blue-700 text-white";

        if (group.isOwner) {

          buttonColor = "bg-green-700 hover:bg-green-800 text-white";
        } else if (group.isMember) {

          buttonColor = "bg-blue-600 hover:bg-blue-700 text-white";
        } else if (group.isPending) {
          buttonColor = "bg-yellow-500 hover:bg-yellow-600 text-black";
        }

        return (
          <Card
            key={group.id}
            className="p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-[#0059ff] font-medium text-lg mb-1">
                  {group.name}
                </h3>
                <p className="text-[#b1b1b1] text-sm">{group.desc}</p>
              </div>

              <div className="flex items-center gap-4">
                {group.tag && (
                  <Badge className="bg-[#0059ff] text-white hover:bg-[#0059ff]/90">
                    {group.tag}
                  </Badge>
                )}

                <div className="flex items-center gap-1 text-[#b1b1b1] text-sm">
                  <Users className="w-4 h-4" />
                  <span>เจ้าของ {group.owner}</span>
                </div>


                {/* ปุ่มที่เปลี่ยนสีตามสถานะ */}
                <Button
                  className={`${buttonColor} px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => joinGroup(group.id)}
                  disabled={group.isOwner || group.isPending || group.isMember}
                >
                  {group.isOwner
                    ? "Owner"
                    : group.isPending
                      ? "Pending..."
                      : group.isMember
                        ? "Joined"
                        : "Join"}
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default GroupViewCard;
