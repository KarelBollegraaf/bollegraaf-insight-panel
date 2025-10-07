import { Card } from "@/components/ui/card";
import { Bale } from "@/types/bale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cable } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WireConsumptionProps {
  bales: Bale[];
}

const WIRE_LENGTH_PER_BALE = 8.5; // meters average
const WIRE_WEIGHT_PER_METER = 0.25; // kg

export function WireConsumption({ bales }: WireConsumptionProps) {
  const [viewMode, setViewMode] = useState<"length-bale" | "length-tonne" | "mass-bale" | "mass-tonne">("length-bale");

  const recipeStats = bales.reduce((acc, bale) => {
    if (!acc[bale.recipeName]) {
      acc[bale.recipeName] = {
        totalWires: 0,
        totalBales: 0,
        totalWeight: 0,
      };
    }
    acc[bale.recipeName].totalWires += bale.numberOfWires;
    acc[bale.recipeName].totalBales += 1;
    acc[bale.recipeName].totalWeight += bale.weight;
    return acc;
  }, {} as Record<string, { totalWires: number; totalBales: number; totalWeight: number }>);

  const chartData = Object.entries(recipeStats).map(([recipe, stats]) => {
    const totalLength = stats.totalWires * WIRE_LENGTH_PER_BALE;
    const totalMass = totalLength * WIRE_WEIGHT_PER_METER;
    
    let value = 0;
    if (viewMode === "length-bale") {
      value = totalLength / stats.totalBales;
    } else if (viewMode === "length-tonne") {
      value = totalLength / (stats.totalWeight / 1000);
    } else if (viewMode === "mass-bale") {
      value = totalMass / stats.totalBales;
    } else {
      value = totalMass / (stats.totalWeight / 1000);
    }

    return {
      recipe: recipe.replace("Cardboard-", "CB-").replace("Paper-", "P-"),
      value: Number(value.toFixed(2)),
    };
  });

  const unit = viewMode.startsWith("length") ? "m" : "kg";
  const perUnit = viewMode.endsWith("bale") ? "bale" : "tonne";

  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Cable className="h-5 w-5 text-primary" />
          Wire Consumption
        </h3>
        <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="length-bale">Length per Bale (m)</SelectItem>
            <SelectItem value="length-tonne">Length per Tonne (m)</SelectItem>
            <SelectItem value="mass-bale">Mass per Bale (kg)</SelectItem>
            <SelectItem value="mass-tonne">Mass per Tonne (kg)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="recipe" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            style={{ fontSize: '12px' }}
            label={{ value: `${unit}/${perUnit}`, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value} ${unit}`, `Per ${perUnit}`]}
          />
          <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
