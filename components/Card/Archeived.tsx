"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

type LinkItem = {
  id: string;
  title: string;
  url: string;
  owner: string;
  createdAt: string;
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`rounded-lg p-6 ${color} text-white min-w-[140px]`}>
    <div className="text-sm opacity-90">{label}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

const ItemCard = ({ title, href }: { title: string;  href: string }) => (
  <Card className="shadow-sm">
    <CardHeader className="flex items-start justify-between p-4">
      <div>
        <div className="font-medium">
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {title}
          </a>
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="text-xs text-gray-500 break-all">{href}</div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button size="sm" variant="destructive">ลบ</Button>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Button size="sm" variant="default">ไปยังลิ้งค์</Button>
        </a>
      </div>
    </CardHeader>
  </Card>
);

const Archived = () => {
  const { groupname } = useParams(); // ต้องอยู่ใน path เช่น /group/[groupId]/archived
  const groupId = groupname;
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  // GET: ดึงลิงก์ทั้งหมด
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupId}/links`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error("❌ Fetch links error:", err);
    } finally {
      setLoading(false);
    }
  };

  // POST: เพิ่มลิงก์ใหม่
  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return alert("กรอกข้อมูลให้ครบก่อนเพิ่ม");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupId}/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify({
          title: newLink.title,
          url: newLink.url,
        }),
      });
      if (!res.ok) throw new Error("Failed to add link");
      const added = await res.json();
      setLinks((prev) => [...prev, added.link]);
      setNewLink({ title: "", url: "" });
    } catch (err) {
      console.error("❌ Add link error:", err);
    }
  };

  const addDemoLinks = () => {
    const demo: LinkItem[] = [
      {
        id: 'demo-1',
        title: 'ตัวอย่างเอกสารการบ้าน',
        url: 'https://example.com/homework.pdf',
        owner: 'ระบบ',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'demo-2',
        title: 'คู่มือการใช้งาน',
        url: 'https://example.com/manual',
        owner: 'Admin',
        createdAt: new Date().toISOString(),
      },
    ];
    setLinks(demo);
  };

  useEffect(() => {
    if (groupId) fetchLinks();
  }, [groupId]);

  if (loading) return <p className="p-8 text-center">กำลังโหลด...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Archived 📦</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Links" value={links.length} color="bg-blue-600" />
        <StatCard label="Files" value={0} color="bg-red-500" />
        <StatCard label="All" value={links.length} color="bg-gray-400" />
      </div>

      {/* Add New Link */}
      <div className="mb-6 flex gap-3 items-center">
        <Input
          placeholder="ชื่อเรื่อง"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="flex-1"
        />
        <Button onClick={handleAddLink}>เพิ่มลิงก์</Button>
      </div>

      {/* List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Links</h2>
        <div className="flex flex-col gap-4">
          {links && links.length > 0 ? (
            links
              .filter(l => l && l.title && l.url)
              .map((l) => (
                <ItemCard
                  key={l.id}
                  title={l.title}
                  href={l.url}
                />
              ))
          ) : (
            <div className="p-6 border border-dashed rounded-lg text-center text-gray-600">
              <p className="mb-3">ยังไม่มีลิงก์ที่เก็บไว้สำหรับกลุ่มนี้</p>
              <p className="text-sm mb-4">คลิกเพื่อแสดงตัวอย่าง UI</p>
              <div className="flex justify-center">
                <Button onClick={addDemoLinks}>แสดงตัวอย่างลิงก์</Button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Archived;
