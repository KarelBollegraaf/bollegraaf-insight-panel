import { Card } from "@/components/ui/card";
import { TrendingUp, Building2 } from "lucide-react";

interface CardboardStatsProps {
  thisBalerAverage: {
    density: number;
    weight: number;
    dailyOutput: number;
  };
  fleetAverage: {
    density: number;
    weight: number;
    dailyOutput: number;
  };
}

export function CardboardStats({ thisBalerAverage, fleetAverage }: CardboardStatsProps) {
  const densityComparison = ((thisBalerAverage.density / fleetAverage.density - 1) * 100).toFixed(1);
  const weightComparison = ((thisBalerAverage.weight / fleetAverage.weight - 1) * 100).toFixed(1);
  const outputComparison = ((thisBalerAverage.dailyOutput / fleetAverage.dailyOutput - 1) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* This Baler Performance */}
      <Card className="p-6 border-2 border-primary/20 bg-accent/30">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          This Baler Performance
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Avg. Density</span>
            <span className="text-xl font-bold text-foreground">{thisBalerAverage.density} kg/m³</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Avg. Bale Weight</span>
            <span className="text-xl font-bold text-foreground">{thisBalerAverage.weight} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Daily Output</span>
            <span className="text-xl font-bold text-foreground">{thisBalerAverage.dailyOutput} bales</span>
          </div>
        </div>
      </Card>

      {/* Fleet Average Comparison */}
      <Card className="p-6 border-2 border-card-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-chart-2" />
          Fleet Average (Cardboard)
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div>
              <span className="text-sm text-muted-foreground">Avg. Density</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className={parseFloat(densityComparison) >= 0 ? "text-status-success" : "text-status-error"}>
                  {parseFloat(densityComparison) >= 0 ? "+" : ""}{densityComparison}%
                </span> vs fleet
              </p>
            </div>
            <span className="text-xl font-bold text-foreground">{fleetAverage.density} kg/m³</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div>
              <span className="text-sm text-muted-foreground">Avg. Bale Weight</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className={parseFloat(weightComparison) >= 0 ? "text-status-success" : "text-status-error"}>
                  {parseFloat(weightComparison) >= 0 ? "+" : ""}{weightComparison}%
                </span> vs fleet
              </p>
            </div>
            <span className="text-xl font-bold text-foreground">{fleetAverage.weight} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">Daily Output</span>
              <p className="text-xs text-muted-foreground mt-0.5">
                <span className={parseFloat(outputComparison) >= 0 ? "text-status-success" : "text-status-error"}>
                  {parseFloat(outputComparison) >= 0 ? "+" : ""}{outputComparison}%
                </span> vs fleet
              </p>
            </div>
            <span className="text-xl font-bold text-foreground">{fleetAverage.dailyOutput} bales</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
