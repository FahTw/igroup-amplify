"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "@/components/ui/badge";

const my_task = {
  overdue: 1,
  queue: 2,
  process: 1,
  finish: 1
}

const TaskStat = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">

      <Card className="bg-red-600 text-white w-full">
        <CardHeader className="pb-2 text-center">
          <CardTitle>Overdue</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-2xl font-bold text-center">
          {my_task.overdue}
        </CardContent>
      </Card>
      <Card className="bg-yellow-500 text-white w-full">
        <CardHeader className="pb-2 text-center">
          <CardTitle>In Queue</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-2xl font-bold text-center">
          {my_task.queue}
        </CardContent>
      </Card>
      <Card className="bg-blue-600 text-white w-full">
        <CardHeader className="pb-2 text-center">
          <CardTitle>Process</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-2xl font-bold text-center">
          {my_task.process}
        </CardContent>
      </Card>
      <Card className="bg-gray-400 text-white w-full">
        <CardHeader className="pb-2 text-center">
          <CardTitle>Finished</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-2xl font-bold text-center">
          {my_task.finish}
        </CardContent>
      </Card>
      <Card className="bg-gray-500 text-white w-full">
        <CardHeader className="pb-2 text-center">
          <CardTitle>All</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-2xl font-bold text-center">
          {my_task.overdue + my_task.queue + my_task.process + my_task.finish}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default TaskStat;
