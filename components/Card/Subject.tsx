"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";

const Subject = () => {
  interface SubjectType {
    id?: string;
    name: string;
    code?: string;
    desc?: string;
    owner?: string | null;
  }

  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subject`, {
          method: "GET",
          headers,
          credentials: "include",
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`Failed to fetch subjects: ${response.status} ${text}`);
        }

        const result = await response.json();
        // eslint-disable-next-line no-console
        console.debug("/subject response:", result);

        let list: SubjectType[] = [];
        if (result && Array.isArray(result.subjects)) {
          list = result.subjects.map((s: unknown) => {
            const obj = s as { id?: string; name?: string; code?: string; desc?: string; user?: { username?: string }; owner?: string };
            return { id: obj.id, name: obj.name ?? "", code: obj.code, desc: obj.desc, owner: obj.user?.username ?? obj.owner ?? null };
          });
        } else if (result && typeof (result as Record<string, unknown>).name === "string") {
          const r = result as Record<string, unknown>;
          const idVal = r["id"];
          const nameVal = r["name"] as unknown;
          const codeVal = r["code"];
          const descVal = r["desc"];
          const ownerVal = r["owner"];
          list = [
            {
              id: idVal ? String(idVal) : undefined,
              name: typeof nameVal === "string" ? nameVal : String(nameVal ?? ""),
              code: typeof codeVal === "string" ? codeVal : undefined,
              desc: typeof descVal === "string" ? descVal : undefined,
              owner: typeof ownerVal === "string" ? ownerVal : null,
            },
          ];
        }

        if (mounted) {
          setSubjects(list);
          setLoading(false);
          console.log(list)
        }
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error("Error fetching subjects:", err);
        if (mounted) {
          const message = err instanceof Error ? err.message : String(err ?? "Error fetching subjects");
          setError(message);
          setLoading(false);
        }
      }
    };

    fetchSubjects();
    return () => { mounted = false };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!subjects || subjects.length === 0) return <p className="text-gray-500">ยังไม่พบหัวข้อ</p>;

  return (
    <div className="space-y-4 grid p-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((s) => (
        <Card key={s.id ?? s.name} className="border p-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>{s.name}</CardTitle>
                {s.code && <div className="text-sm text-muted-foreground">{s.code}</div>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{s.desc}</CardDescription>
          </CardContent>
          <Link href={`/subject/${s.name}`} className="block text-center text-blue-500 border">
            กลุ่ม
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Subject;
