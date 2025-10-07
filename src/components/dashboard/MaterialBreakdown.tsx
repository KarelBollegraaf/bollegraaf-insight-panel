import { Card } from "@/components/ui/card";
import { Bale } from "@/types/bale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package2 } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MaterialBreakdownProps {
  bales: Bale[];
}

type TimePeriod = "hourly" | "daily" | "monthly";

export function MaterialBreakdown({ bales }: MaterialBreakdownProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("daily");
  const [viewMode, setViewMode] = useState<"count" | "mass">("count");

  // Group by time period and recipe
  const groupedData = bales.reduce((acc, bale) => {
    let timeKey = "";
    const date = new Date(bale.timestamp);
    
    if (timePeriod === "hourly") {
      timeKey = `${date.toLocaleDateString()} ${date.getHours()}:00`;
    } else if (timePeriod === "daily") {
      timeKey = date.toLocaleDateString();
    } else {
      timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    if (!acc[timeKey]) {
      acc[timeKey] = {};
    }
    if (!acc[timeKey][bale.recipeName]) {
      acc[timeKey][bale.recipeName] = { count: 0, mass: 0 };
    }
    acc[timeKey][bale.recipeName].count += 1;
    acc[timeKey][bale.recipeName].mass += bale.weight / 1000; // Convert to tonnes
    
    return acc;
  }, {} as Record<string, Record<string, { count: number; mass: number }>>);

  // Get unique recipes
  const recipes = Array.from(new Set(bales.map(b => b.recipeName)));
  
  // Convert to chart format
  const chartData = Object.entries(groupedData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-20) // Show last 20 periods
    .map(([time, recipes]) => {
      const dataPoint: any = { time };
      Object.entries(recipes).forEach(([recipe, data]) => {
        dataPoint[recipe] = viewMode === "count" ? data.count : Number(data.mass.toFixed(2));
      });
      return dataPoint;
    });

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package2 className="h-5 w-5 text-primary" />
          Material Breakdown
        </h3>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as "count" | "mass")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="mass">Mass (tonnes)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '10px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            label={{ value: viewMode === "count" ? "Bales" : "Tonnes", angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {recipes.map((recipe, index) => (
            <Bar
              key={recipe}
              dataKey={recipe}
              stackId="a"
              fill={colors[index % colors.length]}
              name={recipe}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
