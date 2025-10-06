import { Card } from "@/components/ui/card";
import { Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Bale {
  id: string;
  timestamp: Date;
  length: number;
  width: number;
  height: number;
  weight: number;
  density: number;
  quality: "excellent" | "good" | "acceptable";
}

interface BaleHistoryListProps {
  bales: Bale[];
  onBaleClick: (bale: Bale) => void;
}

const qualityConfig = {
  excellent: { label: "Excellent", className: "bg-status-success text-white" },
  good: { label: "Good", className: "bg-chart-2 text-white" },
  acceptable: { label: "Acceptable", className: "bg-status-idle text-white" },
};

export function BaleHistoryList({ bales, onBaleClick }: BaleHistoryListProps) {
  return (
    <Card className="p-6 border-2 border-card-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Recent Bales
      </h3>

      <div className="space-y-2">
        {bales.map((bale) => {
          const quality = qualityConfig[bale.quality];
          
          return (
            <button
              key={bale.id}
              onClick={() => onBaleClick(bale)}
              className="w-full p-4 bg-muted/30 hover:bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      Bale #{bale.id}
                    </span>
                    <Badge className={`${quality.className} text-xs px-2 py-0.5`}>
                      {quality.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bale.timestamp.toLocaleTimeString()} - {bale.weight}kg, {bale.density}kg/m³
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
