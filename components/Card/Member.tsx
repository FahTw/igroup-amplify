"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Toaster, toast } from "sonner";

import { usePathname } from "next/navigation";

const initmembers = [
    { id: 1, name: "ประชาชน" },
    { id: 2, name: "ประชาชน" },
    { id: 3, name: "ประชาชน" },
];

const Member = () => {
    interface Member {
        userId: string;
        username: string;
    }
    
    const [members, setMembers] = useState<Member[]>([]);

    const pathname = usePathname();
    const groupName = pathname.split("/")[1];

    const getMembers = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/group/members/${groupName}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                }
            );

            const data = await res.json();
            if (data.success) {
                // สมมติว่า data.members มีโครงสร้าง [{ id: 1, name: "..." }, ...]
                setMembers(data.groupMembers);
                console.log(data.groupMembers);
            } else {
                console.error("Failed to fetch members:", data.message);
            }
        } catch (err) {
            console.error("Error fetching members:", err);
        }
    }

    useEffect(() => {
        getMembers();
    }, []);

    const handleDelete = async (userId: string, username: string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupName}/${userId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );
        const data = await res.json();
        if (data.success) {
            // ลบสมาชิกออกจากสถานะ
            setMembers((prevMembers) =>
                prevMembers.filter((member) => member.userId !== userId)
            );
            toast.success(`ลบสมาชิก ${username} สำเร็จ`);
        } else {
            console.error("Failed to delete member:", data.message);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Toaster position="top-right" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">สมาชิกในกลุ่ม</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m) => (
                    <Card
                        key={m.userId}
                        className="p-6 rounded-lg border border-gray-200 shadow-sm bg-white hover:shadow-md "
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <h3 className="text-xl font-medium text-gray-800">#</h3>
                                <p className="text-base font-semibold text-gray-700">{m.username}</p>
                            </div>
                            <div className="flex gap-2">
                                <h3 className="text-xl font-medium text-gray-800">ID:</h3>
                                <p className="text-base font-semibold text-gray-700">{m.userId}</p>
                            </div>


                            <Button
                                onClick={() => handleDelete(m.userId, m.username)}
                                className="mt-4 w-full bg-red-600 text-white"
                            >
                                ลบสมาชิก
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {members.length === 0 && (
                <div className="text-center mt-10 text-gray-500 text-sm">
                    ไม่มีสมาชิกในกลุ่มแล้ว
                </div>
            )}
        </div>
    );
};

export default Member;
