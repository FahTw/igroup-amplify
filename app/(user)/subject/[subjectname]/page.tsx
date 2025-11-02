"use client";

import GroupViewCard from "@/components/Card/GroupViewCard";
import HeroSection from "@/components/HeroSection/HeroSection";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


const Page = () => {
  const { subjectname } = useParams() as { subjectname: string };
  // groups state was unused; remove to avoid unused-vars warning
  type SubjectType = { name: string };
  const [subject, setSubject] = useState<SubjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/${subjectname}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        const data = await res.json();
        if (data.success) {
          setSubject(data.subject);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error(error);
        setError("เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectname]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!subject) return <p className="text-center mt-10 text-gray-500">ไม่พบรายวิชา</p>;

  return (
    <div>
      <HeroSection
        title={subject.name}
        subtitle="เลือกกลุ่มที่ต้องการเข้าร่วมหรือสร้างกลุ่ม"
      />
      <GroupViewCard subjectName={subject.name} />
    </div>
  );
};

export default Page;
