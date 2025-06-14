"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface GradeChartProps {
  data: {
    name: string;
    grade: number;
    average: number;
  }[];
}

export default function GradeChart({ data }: GradeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="grade"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              name="Your Grade"
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
              name="Class Average"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}