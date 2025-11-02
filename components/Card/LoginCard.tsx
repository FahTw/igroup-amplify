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
import { User, Lock } from "lucide-react"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"

const LoginCard = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    
    const refreshCookie = response.headers.get('Set-Cookie')
    
    const data = await response.json()
    if (!data.success) return toast.error(data.message);

    const accessCookie = data.data.accessToken
    localStorage.setItem('accessToken', accessCookie)

    router.push('/subject')
  }

  return (
    <div className={inter.className}>
      <Toaster position="top-right" />
      <Card className="font-sans w-full shadow-xl px-10 py-5 min-w-[450px]">
        <div className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">
              <Logo />
            </CardTitle>
            <CardDescription className="text-[#B1B1B1]">Please Login in to your account</CardDescription>
        </CardHeader>
        </div>

        <form>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm text-[#71717A]" htmlFor="username">
                Username
              </label>
              <div className="flex items-center relative">
                < User className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoCapitalize="none"
                  placeholder="Enter your username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-10 max-w-350  border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

            </div>

            <div className="grid gap-2">
              <label className="text-sm  text-[#71717A]" htmlFor="password">
                Password
              </label>
              <div className="flex items-center relative">
                <Lock className="absolute left-3 text-[#B1B1B1] w-[16px]" />
                <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="px-10 max-w-350 border-[#E4E4E7] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center ">
            <button
              onClick={handleSubmit}
              className="w-[13rem] rounded-md bg-blue-700 p-2 text-white hover:bg-blue-800 transition-colors"
            >
               เข้าสู่ระบบ
            </button>
            <p className="text-gray-400 text-sm py-5">มีบัญชีแล้วหรือยัง</p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default LoginCard
