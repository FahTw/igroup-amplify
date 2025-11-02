import { Jua } from "next/font/google";

const jua = Jua({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return (
    <span className={`${jua.className} text-blue-700`}>&lt;i&gt;Group</span>
  );
};

export default Logo;
