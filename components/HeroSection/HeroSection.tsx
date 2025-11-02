import { Jua, Inter } from "next/font/google";

const jua = Jua({ subsets: ["latin"], weight: "400" });
const inter = Inter({ subsets: ["latin"] });

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  className?: string; // 👈 เพิ่มมา
}

const HeroSection = ({ title, subtitle, className }: HeroSectionProps) => {
  return (
    <div
      className={`lg:w-full lg:h-[427px] flex flex-col items-center justify-center text-center gap-4 mb-10 ${className || ""}`}
    >
      <h1 className={`${jua.className} text-4xl font-bold text-blue-600`}>
        {title}
      </h1>
      {subtitle && (
        <h2 className={`${inter.className} text-lg`}>
          {subtitle}
        </h2>
      )}
    </div>
  );
};

export default HeroSection;
