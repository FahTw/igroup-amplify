"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection/HeroSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Toaster, toast } from "sonner";

type Subject = { id: string; name: string };
type Tag = { id: string; name: string };

export default function Page() {
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [maxMember, setMaxMember] = useState<number>(5);
    const [submitting, setSubmitting] = useState(false);

    const [subjectList, setSubjectList] = useState<Subject[]>([]);
    const [tagList, setTagList] = useState<Tag[]>([]);
    const [subject, setSubject] = useState<Subject | null>(null);
    const [tag, setTag] = useState<Tag | null>(null);

    const handleCreate = async () => {
        if (!name.trim()) return toast.error("กรุณากรอกชื่อกลุ่ม");
        if (!subject) return toast.error("กรุณาเลือกวิชา");
        if (!tag) return toast.error("กรุณาเลือกแท็ก");

        setSubmitting(true);

        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    desc: detail,
                    quantity: Number(maxMember),
                    subjectId: subject.id,
                    tagId: tag.id,
                }),
            });

            const data = await res.json().catch(() => ({ success: false, message: "Invalid response" }));
            if (!res.ok || !data.success) {
                toast.error(data.message || "สร้างกลุ่มไม่สำเร็จ");
            } else {
                toast.success("สร้างกลุ่มสำเร็จ");
                // reset form
                setName("");
                setDetail("");
                setMaxMember(5);
                if (subjectList.length) setSubject(subjectList[0]);
                if (tagList.length) setTag(tagList[0]);
            }
        } catch (err: unknown) {
            console.error("handleCreate error:", err);
            const message = err instanceof Error ? err.message : String(err ?? "เกิดข้อผิดพลาด");
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subject`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.subjects)) {
                setSubjectList(data.subjects);
                if (data.subjects.length) setSubject(data.subjects[0]);
            }
        } catch (err) {
            console.error("fetchSubjects error:", err);
        }
    };

    const fetchTags = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tag`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.tags)) {
                setTagList(data.tags);
                if (data.tags.length) setTag(data.tags[0]);
            }
        } catch (err) {
            console.error("fetchTags error:", err);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchTags();
    }, []);

    return (
        <div>
            <Toaster position="top-right" />
            <HeroSection title="CREATE GROUP" subtitle="ระบบสร้างกลุ่มงาน" />

            <div className="max-w-6xl mx-auto px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-10">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div className="md:col-span-1">
                                <label className="block text-sm mb-1">Group Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    placeholder="กรอกชื่อกลุ่ม"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm mb-1">Group Detail</label>
                                <input
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                    placeholder="คำอธิบายกลุ่มสั้นๆ"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm mb-1">Max Member</label>
                                <input
                                    type="number"
                                    value={maxMember}
                                    onChange={(e) => setMaxMember(Number(e.target.value) || 0)}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-sm mb-1">Subject</label>
                                <Select onValueChange={(id) => setSubject(subjectList.find((s) => s.id === id) || null)}>
                                    <SelectTrigger>
                                        <SelectValue>{subject?.name ?? "เลือกวิชา"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjectList.map((s) => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="w-40">
                                <label className="block text-sm mb-1">Tag</label>
                                <Select onValueChange={(id) => setTag(tagList.find((t) => t.id === id) || null)}>
                                    <SelectTrigger>
                                        <SelectValue>{tag?.name ?? "เลือกแท็ก"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tagList.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="ml-auto">
                                <Button onClick={handleCreate} disabled={submitting || !name.trim()}>
                                    {submitting ? "กำลังสร้าง..." : "สร้างกลุ่ม"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 py-50">
                    <h3 className="text-sm text-muted-foreground mb-2">ตัวอย่างแสดงกลุ่ม</h3>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-blue-600 font-semibold">{name || "ชื่อกลุ่มตัวอย่าง"}</div>
                                <div className="text-sm text-muted-foreground">{detail || "คำอธิบายกลุ่มตัวอย่าง"}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">{maxMember || 5} คน</div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">{tag?.name ?? "แท็ก"}</div>
                            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{subject?.name ?? "วิชา"}</div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
