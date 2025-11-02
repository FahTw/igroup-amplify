"use client"
import HeroSection from "@/components/HeroSection/HeroSection"

import { useState } from "react"
import { Toaster, toast } from "sonner"

// app/create-tag/page.tsx
const Page = () =>{

    const [tagName, setTagName] = useState("Mini Project");

    const createTag = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            credentials: 'include',
            body: JSON.stringify({ name: tagName }),
        });
        const data = await res.json();
        if (data.success) {
            toast.success('Tag created successfully!');
        } else {
            toast.error('Failed to create tag.');
        }
        return data;
    }

  return (
    <div>
        <Toaster position="top-right" />
        <HeroSection 
            title="Create Tags"
            subtitle="สร้างแท็กเพื่อจัดหมวดหมู่กลุ่มของคุณ"
        />
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <main className="flex-1">
            <section className="max-w-5xl mx-auto px-6 pt-20">
            {/* Form */}
            <div className="mt-16 flex flex-col items-center">
                <div className="w-full max-w-xl">
                <label className="block text-sm font-semibold mb-2">Tag Name</label>
                <div className="flex gap-3">
                    <input
                    type="text"
                    defaultValue="Mini Project"
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ตั้งชื่อแท็กของคุณ"
                    onChange={(e) => setTagName(e.target.value)}
                    />
                    <button
                        type="button"
                        className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 active:translate-y-px transition"
                        onClick={createTag}
                        >
                        สร้างแท็ก
                    </button>
                </div>
                </div>
            </div>

            {/* Example */}
            <div className="max-w-5xl mx-auto mt-16">
                <p className="text-sm text-gray-500 mb-3">ตัวอย่าง</p>

                <div className="rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                    {/* Left */}
                    <div>
                    <a
                        href="#"
                        className="text-blue-600 font-bold text-lg hover:underline"
                    >
                        กลุ่มคนไอ้ต้นขยัน
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                        กลุ่มนี้รับสมัครคนมากมายหลายท่านที่…
                    </p>
                    </div>

                    {/* Right badges/action */}
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                    {/* Tag badge */}
                    <span className="inline-flex items-center rounded-full border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-600">
                        {tagName || "Mini Project"}
                    </span>

                    {/* Crown + text */}
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path d="M3 7l4.5 4 4.5-6 4.5 6L21 7v10H3V7zm2 8h14v2H5v-2z" />
                        </svg>
                        โฮสต์
                    </span>

                    {/* Members */}
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                        <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                        2/5
                    </span>

                    {/* Join button */}
                    <button className="ml-auto md:ml-0 rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700">
                        เข้าร่วม
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-500 flex items-center justify-between">
            <p>
                Copyright <span className="align-middle text-base">©</span> 2025 by &lt;i&gt;Group
            </p>
            <p>Made by Arm, Chogun, Fah</p>
            </div>
        </footer>
        </div>
    </div>
  );
}


export default Page