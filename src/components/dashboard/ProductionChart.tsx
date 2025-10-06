import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProductionChartProps {
  data: Array<{
    time: string;
    balesPerHour: number;
    tonsPerHour: number;
  }>;
}

type TimePeriod = "day" | "week" | "month";

export function ProductionChart({ data }: ProductionChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");

  // Sample data for different time periods
  const dayData = data;
  
  const weekData = [
    { time: "Mon", balesPerHour: 42, tonsPerHour: 16.5 },
    { time: "Tue", balesPerHour: 45, tonsPerHour: 17.8 },
    { time: "Wed", balesPerHour: 41, tonsPerHour: 16.2 },
    { time: "Thu", balesPerHour: 44, tonsPerHour: 17.4 },
    { time: "Fri", balesPerHour: 46, tonsPerHour: 18.2 },
    { time: "Sat", balesPerHour: 38, tonsPerHour: 15.0 },
    { time: "Sun", balesPerHour: 35, tonsPerHour: 13.8 },
  ];

  const monthData = [
    { time: "Week 1", balesPerHour: 43, tonsPerHour: 17.0 },
    { time: "Week 2", balesPerHour: 44, tonsPerHour: 17.4 },
    { time: "Week 3", balesPerHour: 42, tonsPerHour: 16.6 },
    { time: "Week 4", balesPerHour: 45, tonsPerHour: 17.8 },
  ];

  const chartData = timePeriod === "day" ? dayData : timePeriod === "week" ? weekData : monthData;

  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Production Trends
        </h3>
        <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="balesPerHour"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            name="Bales/Hour"
          />
          <Line
            type="monotone"
            dataKey="tonsPerHour"
            stroke="hsl(var(--chart-2))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
            name="Tons/Hour"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
