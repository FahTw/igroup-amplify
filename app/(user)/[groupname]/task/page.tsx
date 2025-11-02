"use client";
import TaskStat from "@/components/Card/TaskStat";
import TaskList, { type Task } from "@/components/Card/TaskList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { useParams } from 'next/navigation';

const Page = () => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. ดึง groupId จาก URL
  const params = useParams();
  const groupId = params.groupname as string; // (ถ้า path คือ /group/[id]/...)
  console.log(groupId);
  console.log(params);

  // 5. สร้างฟังก์ชันสำหรับดึง Task จาก DB
  const fetchTasks = useCallback(async () => {
    if (!groupId) return; // ถ้ายังไม่มี groupId ก็ไม่ต้องทำอะไร

    setIsLoading(true);
    try {
      // 6. เปลี่ยน URL ให้เรียก API ใหม่ (GET)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${groupId}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถดึงข้อมูล Task ได้");
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  // 7. สั่งให้ดึง Task ทันทีที่หน้าโหลด
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

const handleCreateTask = async () => {
    if (!taskName) {
      alert("กรุณาใส่ชื่องาน");
      return;
    }

    try {
      // 9. เปลี่ยน URL ให้เรียก API ใหม่ (POST)
      console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupId}/tasks`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/group/${groupId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          name: taskName,
          description: taskDescription,
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const data = await res.json();
      const savedTask = data.task; // รับ Task ใหม่ (ที่มี id) กลับมา

      // อัปเดต State โดยเอา Task ใหม่ไว้บนสุด
      setTasks((prevTasks) => [savedTask, ...prevTasks]);
      
      setTaskName("");
      setTaskDescription("");
      setOpen(false);

    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสร้าง Task");
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Task</h1>
          <button 
            onClick={() => setOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm">สร้างงาน</button>
        </div>

        {/* Stats row */}
        <TaskStat />

        {/* Task cards/list */}
        {isLoading ? (
          <p className="text-center mt-6">กำลังโหลด Task...</p>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างงานใหม่</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">ชื่องาน</label>
              <Input type="text" placeholder="ป้อนชื่องาน" className="w-full" value={taskName}
      onChange={(e) => setTaskName(e.target.value)} />
            </div>
            <div>
              <label className="block mb-1 font-medium">คำอธิบาย</label>
              <Textarea placeholder="ป้อนคำอธิบายงาน" className="w-full" value={taskDescription}
      onChange={(e) => setTaskDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTask}>สร้างงาน</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;