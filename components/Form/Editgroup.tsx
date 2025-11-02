import React from 'react'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
const Editgroup = () => {
    return (
        <div>
            <form className='flex gap-2 justify-center'>
                <div className="mb-6">
                    <label htmlFor="groupname" className="font-medium block mb-2">
                        Group Name
                    </label>
                    <div className="w-full lg:w-[220px]">
                        <Input
                            type='text'
                            id="groupname"
                            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="groupdetail" className="font-medium block mb-2">
                        Group Detail
                    </label>
                    <div className="w-full lg:w-[320px]">
                        <Input
                            type='text'
                            id="groupdetail"
                            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="groupmember" className="font-medium block mb-2">
                        Group Member
                    </label>
                    <div className="w-full lg:w-[127px]">
                        <Input
                            type='number'
                            id="groupmemnber"
                            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="subject" className="font-medium block mb-2">
                        Subject
                    </label>
                    <div className="w-full lg:w-[205px] ">

                        {/* ดึงจาก DB */}
                        <Select defaultValue="Choose subject">
                            <SelectTrigger className="border-[#e4e4e7]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side='bottom'>
                                <SelectItem value="cloud">Cloud Computing</SelectItem>
                                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                                <SelectItem value="web">Web Development</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="groupname" className="font-medium block mb-2">
                        Group Name
                    </label>
                    <div className="w-full lg:w-[144px]">

                        {/* ดึงจาก DB  */}
                        <Select defaultValue="Choose tag">
                            <SelectTrigger className="border-[#e4e4e7]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="bottom">
                                <SelectItem value="cloud">Miniproject</SelectItem>
                                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                                <SelectItem value="web">Web Development</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Button className="bg-blue-600 text-white px-6">บันทึก</Button>
                    <Button className="bg-red-600  text-white px-6">ลบ</Button>
                </div>

            </form>
        </div>
    )
}
export default Editgroup