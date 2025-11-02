"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"

type ProfileShape = {
  Profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    bio?: string;
    imagePath?: string;
  };
  username?: string;
} | null | undefined;

type CardProps = {
  profile: ProfileShape;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const Profile = ({ profile }: CardProps) => {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [username, setUsername] = useState("")
  const [imagePath, setImagePath] = useState("")      // สำหรับแสดงผล (URL แบบเต็ม)
  const [file, setFile] = useState<File | null>(null) // ไฟล์ที่จะอัปโหลด
  const [previewUrl, setPreviewUrl] = useState<string>("") // พรีวิวทันที
  const [loading, setLoading] = useState(false)

  const getProfile = async () => {
    if (!profile) return;
    const p = profile as ProfileShape;
    setFirstname(p?.Profile?.first_name ?? "");
    setLastname(p?.Profile?.last_name ?? "");
    setEmail(p?.Profile?.email ?? "");
    setBio(p?.Profile?.bio ?? "");
    setUsername(p?.username ?? "");
    if (p?.Profile?.imagePath) {
      setImagePath(`${API_BASE}/${p.Profile.imagePath}`);
    } else {
      setImagePath("");
    }
  };

  useEffect(() => {
    getProfile()
    // cleanup objectURL ตอน unmount
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    // ตรวจ type เบื้องต้นฝั่ง client ให้ตรงกับ server filter
    if (!/^image\/(jpeg|png|webp|gif|avif|heic|heif)$/.test(f.type)) {
      toast.error("รองรับเฉพาะไฟล์รูปเท่านั้น")
      return
    }
    // จำกัดขนาดเบื้องต้นให้สอดคล้องกับ server (5MB)
    if (f.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ใหญ่เกิน 5MB")
      return
    }
    setFile(f)
    // พรีวิวทันที
    const url = URL.createObjectURL(f)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }

  const saveForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      setLoading(true)

      const token = localStorage.getItem("accessToken")
      if (!token) {
        toast.error("ไม่พบสิทธิ์การใช้งาน (token)")
        setLoading(false)
        return
      }

      const form = new FormData()
      // แนบไฟล์ถ้ามี
      if (file) form.append("file", file)
      // แนบฟิลด์ที่แก้ไข
      if (bio !== undefined) form.append("bio", bio)
      if (firstname !== undefined) form.append("first_name", firstname)
      if (lastname !== undefined) form.append("last_name", lastname)
      if (email !== undefined) form.append("email", email)

      const headers: HeadersInit = {
        // อย่าตั้ง Content-Type เอง ให้ browser ใส่ boundary ให้อัตโนมัติ
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_BASE}/profile`, {
        method: "PATCH",
        headers,
        body: form,
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.message || "อัปเดตโปรไฟล์ไม่สำเร็จ")
      }

      // อัปเดตรูป (server แปลงเป็น webp แล้วคืน path มาใน profile.imagePath)
      const newPath = json?.profile?.imagePath
      if (newPath) {
        setImagePath(`${API_BASE}/${newPath}`)
        // ล้างพรีวิวเพื่อใช้ไฟล์จาก server แทน
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl("")
        }
      }

      toast.success("บันทึกโปรไฟล์เรียบร้อย")
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err ?? "เกิดข้อผิดพลาด");
      toast.error(message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center gap-16">
      <Toaster position="top-right" />
      <div>
        <Image
          unoptimized
          src={previewUrl || imagePath || "/Images/circle-user.png"}
          alt="Profile"
          width={200}
          height={200}
          className="mx-auto mb-4 rounded-full aspect-square object-cover"
        />
        <div className="text-center">
          <label htmlFor="file" className="block font-medium mb-2">
            Upload File
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />
        </div>
      </div>

      <form className="w-full lg:w-[689px] lg:h-[367px]">
        <div className="grid grid-cols-2 gap-6 mb-3">
          <div className="space-y-2">
            <label htmlFor="firstname" className="font-medium block mb-2">
              Firstname
            </label>
            <Input
              id="firstname"
              placeholder="Firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastname" className="font-medium block mb-">
              Lastname
            </label>
            <Input
              id="lastname"
              placeholder="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="bg-white border-[#e4e4e7] placeholder:text-[#b1b1b1]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-3">
          <div className="space-y-2">
            <label htmlFor="username" className="font-medium block mb-">
              Username
            </label>
            <Input
              id="username"
              placeholder="Username"
              value={username}
              className="bg-white border-[#e4e4e7] text-[#1a1a1a]"
              disabled
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="font-medium block mb-">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              className="bg-white border-[#e4e4e7] text-[#1a1a1a]"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* ยังไม่ส่ง password ไป backend ใน endpoint นี้ */}
        <div className="space-y-2 mb-3">
          <label htmlFor="new-password" className="font-medium block mb-">
            New Password
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="Password"
            onChange={() => { /* เก็บไว้ใช้กับ endpoint เปลี่ยนรหัสผ่าน */ }}
            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="font-medium block mb-">
            Confirm Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            onChange={() => { /* เก็บไว้ใช้กับ endpoint เปลี่ยนรหัสผ่าน */ }}
            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
          />
        </div>

        <div className="space-y-2 mt-3">
          <label htmlFor="bio" className="font-medium block mb-">
            Bio
          </label>
          <Input
            id="bio"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-white border-[#e4e4e7] text-[#1a1a1a] placeholder:text-[#b1b1b1]"
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={saveForm}
            disabled={loading}
            className="bg-[#0059ff] hover:bg-[#0059ff]/90 text-white px-16 py-3 rounded-md font-medium text-base disabled:opacity-60"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default Profile
