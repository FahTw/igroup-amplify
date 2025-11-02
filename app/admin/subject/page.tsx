"use client"

import HeroSection from "@/components/HeroSection/HeroSection"
import { useState } from "react"
import { Toaster, toast } from "sonner"

const Page = () => {
    const [name, setName] = useState("")
    const [code, setCode] = useState("")
    const [detail, setDetail] = useState("")

    const createSubject = async () => {
            // client-side validation
            if (!name || !name.trim() || !code || !code.trim()) {
                toast.error('กรุณากรอกชื่อวิชาและรหัสวิชา')
                return
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subject`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ name: name.trim(), code: code.trim(), desc: detail.trim() }),
                })
                const data = await res.json().catch(() => null)
                if (res.ok && (data?.success ?? true)) {
                    toast.success('สร้างวิชาเรียบร้อยแล้ว')
                    setName("")
                    setCode("")
                    setDetail("")
                } else {
                    toast.error(data?.message ?? 'เกิดข้อผิดพลาดในการสร้างวิชา')
                }
            } catch (error) {
                console.error(error);
                toast.error('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')
            }
    }

    return (
        <div>
            <Toaster position="top-right" />
            <HeroSection title="Create Subject" subtitle="สร้างวิชา" />

            <div className="min-h-screen bg-white text-gray-900 flex flex-col">
                <main className="flex-1">
                    <section className="max-w-5xl mx-auto px-6 pt-20">
                        {/* Form */}
                        <div className="mt-16 flex flex-col items-center">
                            <div className="w-full max-w-xl">
                                <label className="block text-sm font-semibold mb-2">ชื่อวิชา</label>
                                <input
                                    type="text"
                                    value={name}
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    placeholder="ชื่อวิชา"
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <label className="block text-sm font-semibold mb-2">รหัสวิชา</label>
                                <input
                                    type="text"
                                    value={code}
                                    className="w-40 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    placeholder="06016487"
                                    onChange={(e) => setCode(e.target.value)}
                                />

                                <label className="block text-sm font-semibold mb-2">รายละเอียดวิชา</label>
                                <textarea
                                    value={detail}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    placeholder="รายละเอียดวิชา"
                                    onChange={(e) => setDetail(e.target.value)}
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 active:translate-y-px transition"
                                        onClick={createSubject}
                                    >
                                        สร้างวิชา
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
                                        <a href="#" className="text-blue-600 font-bold text-lg hover:underline">
                                            {name || 'Cloud Computing'}
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">{detail || 'หลักการพื้นฐานของระบบคลาวด์ รูปแบบการให้บริการ...'}</p>
                                    </div>

                                    {/* Right badges/action */}
                                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                                        {/* Subject code badge */}
                                        <span className="inline-flex items-center rounded-full border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-600">
                                            {code || '06016487'}
                                        </span>

                                        {/* Host label (placeholder) */}
                                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                                                <path d="M3 7l4.5 4 4.5-6 4.5 6L21 7v10H3V7zm2 8h14v2H5v-2z" />
                                            </svg>
                                            วิชา
                                        </span>

                                        <button className="ml-auto md:ml-0 rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700">
                                            เพิ่มเนื้อหา
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
    )
}

export default Page