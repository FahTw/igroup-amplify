"use client"
import Subject from "@/components/Card/Subject"
import HeroSection from "@/components/HeroSection/HeroSection"

const Page = () => {
    return (
        <div>
            <HeroSection
                title="Subjects"
                subtitle="เลือกรายวิชาที่ต้องการสร้างหรือเข้าร่วมกลุ่ม"
            />
            <Subject />
        </div>
    )
}
export default Page