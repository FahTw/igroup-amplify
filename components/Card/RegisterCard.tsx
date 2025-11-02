"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Logo from "../Navbar/Logo"
import { inter } from '@/lib/fonts'
import { User, Phone, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"

const RegisterCard = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [password, setPassword] = useState('')
  const [confitmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (confitmPassword !== password) {
      return toast.error('Password does not match')
    }
    // TODO: handle Register logic here
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password, email, first_name: firstname, last_name: lastname }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    
    const data = await response.json()
    if (!data.success) return toast.error(data.message);

    router.push('/auth/login')
  }

  return (
    <div className={inter.className}>
      <Toaster position="top-right" />
      <Card className="font-sans w-full max-w-sm h-auto lg:w-[450px] shadow-xl">
        <div className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">
              <Logo />
            </CardTitle>
            <CardDescription>Please Register in to your account</CardDescription>
        </CardHeader>
        </div>

        <form>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <div className="flex items-center relative">
                < User className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoCapitalize="none"
                  placeholder="Username"
                  required
                  className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <div className="flex items-center relative">
                <Mail className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="email"
                name="email"
                type="text"
                placeholder="Email"
                required
                className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="firstname">
                Firstname
              </label>
              <div className="flex items-center relative">
                <User className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Firstname"
                required
                className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="lastname">
                Lastname
              </label>
              <div className="flex items-center relative">
                <User className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Lastname"
                required
                className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setLastname(e.target.value)}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <div className="flex items-center relative">
                <Lock className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setPassword(e.target.value)}
                />
              </div>

            </div>
            <div className="grid gap-2">
              <label className="text-sm" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="flex items-center relative">
                <Phone className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center ">
            <button
              onClick={handleSubmit}
              className="w-[13rem] rounded-md bg-blue-700 p-2 text-white hover:bg-blue-800 transition-colors"
            >
               สมัครสมาชิก
            </button>
            <div className="flex gap-2 items-center">
                <p className="text-gray-400 text-sm py-5">มีบัญชีแล้วหรือยัง?</p>
                <Link className="text-blue-600" href="/login">เข้าสู่ระบบ</Link>
            </div>

          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default RegisterCard
