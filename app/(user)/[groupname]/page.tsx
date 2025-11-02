"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import TaskList from "@/components/Card/TaskList";
import TaskStat from "@/components/Card/TaskStat";

export default function GroupPage() {
  const { groupname } = useParams();
  const [group, setGroup] = useState<{ name?: string }>({});
  const [profileName, setProfileName] = useState("");

  // ✅ ดึงข้อมูลกลุ่มตามชื่อใน URL
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupname}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setGroup(data.group);
        } else {
          console.error("Failed to fetch group:", data.message);
        }
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    if (groupname) fetchGroup();
  }, [groupname]);

  // ✅ ดึงชื่อผู้ใช้
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setProfileName(data.profile.name);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Hello, {profileName || "User"}
      </h1>
      <h2 className="text-xl text-gray-600 mb-8">
        กลุ่ม: {group?.name || decodeURIComponent(groupname as string)}
      </h2>

      {/* สรุปสถิติกลุ่ม */}
      <TaskStat />

      {/* รายการงาน */}
      <TaskList tasks={[]} />

      {/* โซนกิจกรรม */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Upcoming Deadline</h2>
          <p className="text-gray-500">ยังไม่มีงานใกล้ครบกำหนด</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Recent Group Activity</h2>
          <p className="text-gray-500">ยังไม่มีกิจกรรมล่าสุด</p>
        </div>
      </div>
    </div>
  );
}
