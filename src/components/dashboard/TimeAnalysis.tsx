import { Card } from "@/components/ui/card";
import { Bale } from "@/types/bale";
import { Clock, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TimeAnalysisProps {
  bales: Bale[];
}

export function TimeAnalysis({ bales }: TimeAnalysisProps) {
  const totalBalingTime = bales.reduce((sum, b) => sum + b.balingTime, 0);
  const totalIdleTime = bales.reduce((sum, b) => sum + b.idleTime, 0);
  const total = totalBalingTime + totalIdleTime;

  const data = [
    { name: "Baling Time", value: totalBalingTime, percentage: ((totalBalingTime / total) * 100).toFixed(1) },
    { name: "Idle Time", value: totalIdleTime, percentage: ((totalIdleTime / total) * 100).toFixed(1) },
  ];

  const COLORS = ["hsl(var(--status-success))", "hsl(var(--status-idle))"];

  // Calculate average strokes per recipe
  const recipeStrokes = bales.reduce((acc, bale) => {
    if (!acc[bale.recipeName]) {
      acc[bale.recipeName] = { total: 0, count: 0 };
    }
    acc[bale.recipeName].total += bale.numberOfStrokes;
    acc[bale.recipeName].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Distribution */}
      <Card className="p-6 border-2 border-card-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Time Distribution
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-status-success/10 rounded-lg p-4 border border-status-success/20">
            <div className="text-sm text-muted-foreground mb-1">Baling Time</div>
            <div className="text-2xl font-bold text-foreground">{(totalBalingTime / 60).toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">{data[0].percentage}%</div>
          </div>
          <div className="bg-status-idle/10 rounded-lg p-4 border border-status-idle/20">
            <div className="text-sm text-muted-foreground mb-1">Idle Time</div>
            <div className="text-2xl font-bold text-foreground">{(totalIdleTime / 60).toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">{data[1].percentage}%</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ percentage }) => `${percentage}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${(value / 60).toFixed(1)} hours`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Average Strokes */}
      <Card className="p-6 border-2 border-card-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Average Strokes per Category
        </h3>

        <div className="space-y-4">
          {Object.entries(recipeStrokes).map(([recipe, data]) => {
            const avg = data.total / data.count;
            return (
              <div key={recipe} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{recipe}</span>
                  <span className="text-muted-foreground">{avg.toFixed(1)} strokes</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(avg / 60) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-muted/30 rounded-lg p-4 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Overall Average</div>
          <div className="text-2xl font-bold text-foreground">
            {(bales.reduce((sum, b) => sum + b.numberOfStrokes, 0) / bales.length).toFixed(1)} strokes/bale
          </div>
        </div>
      </Card>
    </div>
  );
}
