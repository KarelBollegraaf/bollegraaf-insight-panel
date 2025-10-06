import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

interface ProductionChartProps {
  data: Array<{
    time: string;
    balesPerHour: number;
    tonsPerHour: number;
  }>;
}

export function ProductionChart({ data }: ProductionChartProps) {
  return (
    <Card className="p-6 border-2 border-card-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Production Trends
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
