import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3, Calendar } from "lucide-react";

type TimePeriod = "week" | "month" | "year";

export function StatisticsView() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week");

  // Sample data for different time periods
  const weekData = [
    { name: "Mon", bales: 412, weight: 160 },
    { name: "Tue", bales: 438, weight: 172 },
    { name: "Wed", bales: 425, weight: 168 },
    { name: "Thu", bales: 401, weight: 158 },
    { name: "Fri", bales: 445, weight: 175 },
    { name: "Sat", bales: 390, weight: 154 },
    { name: "Sun", bales: 368, weight: 145 },
  ];

  const monthData = [
    { name: "Week 1", bales: 2850, weight: 1125 },
    { name: "Week 2", bales: 2920, weight: 1155 },
    { name: "Week 3", bales: 2780, weight: 1098 },
    { name: "Week 4", bales: 3010, weight: 1188 },
  ];

  const yearData = [
    { name: "Jan", bales: 11500, weight: 4550 },
    { name: "Feb", bales: 10800, weight: 4280 },
    { name: "Mar", bales: 12200, weight: 4820 },
    { name: "Apr", bales: 11900, weight: 4710 },
    { name: "May", bales: 12500, weight: 4950 },
    { name: "Jun", bales: 11800, weight: 4670 },
    { name: "Jul", bales: 12100, weight: 4790 },
    { name: "Aug", bales: 11600, weight: 4590 },
    { name: "Sep", bales: 12300, weight: 4865 },
    { name: "Oct", bales: 12700, weight: 5025 },
    { name: "Nov", bales: 12000, weight: 4750 },
    { name: "Dec", bales: 11400, weight: 4510 },
  ];

  const data = timePeriod === "week" ? weekData : timePeriod === "month" ? monthData : yearData;

  const totalBales = data.reduce((sum, item) => sum + item.bales, 0);
  const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
  const avgBalesPerPeriod = Math.round(totalBales / data.length);

  return (
    <div className="space-y-6">
      {/* Time Period Selector */}
      <Card className="p-6 border-2 border-card-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Statistics Overview
          </h3>
          <Select value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Total Bales</div>
            <div className="text-2xl font-bold text-foreground">{totalBales.toLocaleString()}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Total Weight (tons)</div>
            <div className="text-2xl font-bold text-foreground">{totalWeight.toLocaleString()}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Average per Period</div>
            <div className="text-2xl font-bold text-foreground">{avgBalesPerPeriod.toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* Production Chart */}
      <Card className="p-6 border-2 border-card-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Production Analysis - {timePeriod === "week" ? "Last Week" : timePeriod === "month" ? "Last Month" : "Last Year"}
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
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
            <Bar
              dataKey="bales"
              fill="hsl(var(--primary))"
              name="Bales"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="weight"
              fill="hsl(var(--chart-2))"
              name="Weight (tons)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
