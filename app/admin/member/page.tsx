"use client"
import HeroSection from "@/components/HeroSection/HeroSection"
import MemberCard from "@/components/Card/MemberCard"

import { useEffect, useState, useCallback } from "react"
import { Toaster } from "sonner"
import { useRouter } from "next/navigation"

const Page = () => {

    const router = useRouter();
    type MemberType = {
        id: string;
        username: string;
        Profile?: { first_name?: string; last_name?: string; email?: string };
        role?: { code?: string };
    };
    const [members, setMembers] = useState<MemberType[]>([]);

    const getMembers = useCallback(async () => {
        // Simulate fetching data
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            credentials: 'include',
        });

        const data = await res.json();
        if (!data.success) {
            return router.push('/auth/login');
        }
        // cast to expected shape from API
        setMembers(data.users as MemberType[]);
    }, [router]);

    useEffect(() => {
        getMembers();
    }, [getMembers]);

    return (
        <div>
            <Toaster position="top-right" />
            <HeroSection 
            title="Members"
            subtitle="จัดการสมาชิกในระบบ"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mx-20 my-5">
                {members.map((member) => (
                    <MemberCard 
                        key={member.id}
                        username={member.username}
                        userDetail={member.Profile}
                        userRole={member.role}
                    />
                ))} 
            </div>
        </div>
    )
}

export default Page