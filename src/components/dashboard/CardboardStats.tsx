import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { Bale } from "@/types/bale";

interface CardboardStatsProps {
  bales: Bale[];
}

export function CardboardStats({ bales }: CardboardStatsProps) {
  const recipeNames = useMemo(() => {
    const names = [...new Set(bales.map(b => b.recipeName))];
    return ["All", ...names.sort()];
  }, [bales]);

  const [selectedRecipe, setSelectedRecipe] = useState("All");

  const filteredBales = useMemo(() => {
    if (selectedRecipe === "All") return bales;
    return bales.filter(b => b.recipeName === selectedRecipe);
  }, [bales, selectedRecipe]);

  const stats = useMemo(() => {
    const count = filteredBales.length;
    if (count === 0) return { density: 0, weight: 0, dailyOutput: 0, totalKwh: 0, avgStrokes: 0 };
    return {
      density: filteredBales.reduce((s, b) => s + b.density, 0) / count,
      weight: filteredBales.reduce((s, b) => s + b.weight, 0) / count,
      dailyOutput: count,
      totalKwh: filteredBales.reduce((s, b) => s + b.kwhBaling + b.kwhIdle, 0),
      avgStrokes: filteredBales.reduce((s, b) => s + b.numberOfStrokes, 0) / count,
    };
  }, [filteredBales]);

  return (
    <Card className="p-6 border-2 border-primary/20 bg-accent/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Performance Overview
        </h3>
        <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {recipeNames.map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Total Bales</span>
          <p className="text-xl font-bold text-foreground">{stats.dailyOutput}</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Avg. Density</span>
          <p className="text-xl font-bold text-foreground">{stats.density.toFixed(2)} kg/m³</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Avg. Weight</span>
          <p className="text-xl font-bold text-foreground">{stats.weight.toFixed(2)} kg</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Total kWh</span>
          <p className="text-xl font-bold text-foreground">{stats.totalKwh.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">Avg. Strokes</span>
          <p className="text-xl font-bold text-foreground">{stats.avgStrokes.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
}
