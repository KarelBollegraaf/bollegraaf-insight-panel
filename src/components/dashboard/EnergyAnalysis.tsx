import { Card } from "@/components/ui/card";
import { Bale } from "@/types/bale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EnergyAnalysisProps {
  bales: Bale[];
}

export function EnergyAnalysis({ bales }: EnergyAnalysisProps) {
  const [viewMode, setViewMode] = useState<"bale" | "tonne">("bale");

  // Group by recipe
  const recipeStats = bales.reduce((acc, bale) => {
    if (!acc[bale.recipeName]) {
      acc[bale.recipeName] = {
        totalKwhBaling: 0,
        totalKwhIdle: 0,
        totalBales: 0,
        totalWeight: 0,
      };
    }
    acc[bale.recipeName].totalKwhBaling += bale.kwhBaling;
    acc[bale.recipeName].totalKwhIdle += bale.kwhIdle;
    acc[bale.recipeName].totalBales += 1;
    acc[bale.recipeName].totalWeight += bale.weight;
    return acc;
  }, {} as Record<string, { totalKwhBaling: number; totalKwhIdle: number; totalBales: number; totalWeight: number }>);

  const chartData = Object.entries(recipeStats).map(([recipe, stats]) => {
    const divisor = viewMode === "bale" ? stats.totalBales : stats.totalWeight / 1000; // Convert kg to tonnes
    return {
      recipe: recipe.replace("Cardboard-", "CB-").replace("Paper-", "P-"),
      baling: Number((stats.totalKwhBaling / divisor).toFixed(2)),
      idle: Number((stats.totalKwhIdle / divisor).toFixed(2)),
    };
  });

  const totalKwhBaling = bales.reduce((sum, b) => sum + b.kwhBaling, 0);
  const totalKwhIdle = bales.reduce((sum, b) => sum + b.kwhIdle, 0);
  const total = totalKwhBaling + totalKwhIdle;

  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Energy Analysis
        </h3>
        <Select value={viewMode} onValueChange={(v) => setViewMode(v as "bale" | "tonne")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bale">kWh per Bale</SelectItem>
            <SelectItem value="tonne">kWh per Tonne</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Energy</div>
          <div className="text-2xl font-bold text-foreground">{total.toFixed(2)} kWh</div>
        </div>
        <div className="bg-status-success/10 rounded-lg p-4 border border-status-success/20">
          <div className="text-sm text-muted-foreground mb-1">Baling ({((totalKwhBaling/total)*100).toFixed(2)}%)</div>
          <div className="text-2xl font-bold text-foreground">{totalKwhBaling.toFixed(2)} kWh</div>
        </div>
        <div className="bg-status-idle/10 rounded-lg p-4 border border-status-idle/20">
          <div className="text-sm text-muted-foreground mb-1">Idle ({((totalKwhIdle/total)*100).toFixed(2)}%)</div>
          <div className="text-2xl font-bold text-foreground">{totalKwhIdle.toFixed(2)} kWh</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="recipe" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            style={{ fontSize: '12px' }}
            label={{ value: `kWh/${viewMode}`, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="baling" stackId="a" fill="hsl(var(--status-success))" name="Baling" />
          <Bar dataKey="idle" stackId="a" fill="hsl(var(--status-idle))" name="Idle" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
