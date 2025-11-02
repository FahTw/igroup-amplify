// TaskList.tsx
import { Card, CardContent, CardTitle, CardDescription, CardFooter } from "../ui/card";

// 1. สร้าง Interface สำหรับ Task
export interface Task {
  id?: number;
  name: string;
  description?: string;
}

// 2. Component รับ props tasks
const TaskList = ({ tasks = [] }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return (
      <div className="w-full mt-6 text-center text-gray-500">
        ยังไม่มีงาน... คลิก &apos;สร้างงาน&apos; เพื่อเริ่มต้น
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="mb-0 p-4 border w-full">
            <CardContent className="mb-2 p-0">
              <CardTitle className="py-2">{task.name}</CardTitle>
              <CardDescription>{task.description || "ไม่มีคำอธิบาย"}</CardDescription>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between gap-4 text-sm">
                <div className="bg-red-600 text-white p-2 rounded-sm">Due: 01/12/2025</div>
                <div className="bg-yellow-400 text-black p-2 rounded-sm">รอดำเนินการ</div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
