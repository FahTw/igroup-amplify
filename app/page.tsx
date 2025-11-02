import Navbar from "@/components/Navbar/Navbar";
import HomeCard from "@/components/Card/HomeCard";
import Logo from "@/components/Navbar/Logo";
import { Prompt } from "next/font/google";

import { Users, UserPlus, FolderPen } from "lucide-react"

const prompt = Prompt({ subsets: ["latin"], weight: "300" });

export default function Home() {
  return (
    <div className="font-sans min-h-full flex flex-col">

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center gap-10 p-8 md:p-28">
        {/* Hero section */}
        <div className="w-full h-full flex flex-col items-center gap-4 text-center my-[100px]">
          <h1 className="text-5xl">
            <Logo />
          </h1>
          <h2 className={`${prompt.className}`}>แพลตฟอร์มการจัดการงานกลุ่มภายในคณะ IT</h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <HomeCard title="Group Creation" description="&emsp;<i>Group ช่วยให้ทุกคนสามารถสร้างกลุ่มโปรเจกต์ได้เองผ่านฟอร์มที่ใช้ง่าย รองรับการระบุชื่อกลุ่ม รายละเอียดกลุ่ม จำนวนสมาชิกสูงสุดและแท็กวิชาที่เกี่ยวข้องเพื่อให้เพื่อนในคณะสามารถค้นหาและเข้าร่วมได้สะดวก" icon={Users} />
          <HomeCard title="Join & Manage members" description="&emsp;ผู้ใช้สามารถค้นหากลุ่มที่เปิดรับและส่งคำขอเข้าร่วม (Join Request) ได้ทันที ระบบมีสถานะ Join / Leave / Cancel ที่ชัดเจน และผู้สร้างกลุ่มสามารถอนุมัติหรือปฏิเสธคำขอได้ง่าย" icon={UserPlus}/>
          <HomeCard title="Project Management" description="&emsp;แต่ละกลุ่มมีเครื่องมือจัดการโปรเจกต์ครบชุด ทั้งตารางงาน (Timeline) ที่เชื่อมกับ Todo-List รายงานสถานะงาน ผู้รับผิดชอบ กำหนด Due Date และระบบ Note/Link สำหรับแนบเอกสารต่าง ๆ" icon={FolderPen} />
        </div>
      </main>
    </div>
  );
}
