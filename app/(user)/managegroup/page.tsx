import ManageGroupCard from "@/components/Card/ManageGroupCard"
import HeroSection from "@/components/HeroSection/HeroSection"
import Button from "@/components/Button/Button"
const Page = () => {
    return (
        <div>
            <HeroSection
                title="MANAGE GROUPS"
                subtitle="ระบบจัดการกลุ่ม"
            />
            <div className="flex justify-end max-w-4xl mx-auto mb-4 px-4">
                <Button href="/create">Create Group</Button>
            </div>

            <ManageGroupCard />
        </div>
    )
}
export default Page