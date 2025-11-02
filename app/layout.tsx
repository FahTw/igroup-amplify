import { Inter, Jua } from "next/font/google"
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Prompt } from 'next/font/google';

const prompt = Prompt({ subsets: ['latin'], weight: '400' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${prompt.className}`}>

        {/* Navbar ใช้ Jua แค่ Logo */}
        <header>
          <Navbar />
        </header>
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
