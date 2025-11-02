import Link from 'next/link';
import React from 'react';


interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ href, children}) => {
  return (
    <Link href={href}>
      <button
        className="px-6 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold shadow-md hover:bg-blue-600 transition-all duration-200"
      >
        {children}
      </button>
    </Link>
  );
};

export default Button