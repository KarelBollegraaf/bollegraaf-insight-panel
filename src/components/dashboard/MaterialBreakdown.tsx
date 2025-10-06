import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";

interface MaterialBreakdownProps {
  materials: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export function MaterialBreakdown({ materials }: MaterialBreakdownProps) {
  const total = materials.reduce((sum, m) => sum + m.count, 0);

  return (
    <Card className="p-6 border-2 border-card-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Material Breakdown
      </h3>

      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: material.color }}
                ></div>
                <span className="text-sm font-medium text-foreground">{material.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{material.count} bales</span>
                <span className="text-sm font-semibold text-foreground min-w-[3rem] text-right">
                  {material.percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${material.percentage}%`,
                  backgroundColor: material.color,
                }}
              ></div>
            </div>
          </div>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Total Bales</span>
            <span className="text-2xl font-bold text-primary">{total}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
