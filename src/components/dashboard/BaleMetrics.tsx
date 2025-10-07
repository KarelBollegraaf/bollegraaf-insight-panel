import { Card } from "@/components/ui/card";
import { Ruler, Weight, Box } from "lucide-react";

interface BaleMetricsProps {
  currentBale: {
    length: number;
    width: number;
    height: number;
    weight: number;
    density: number;
  };
  averages: {
    length: number;
    weight: number;
    density: number;
  };
}

export function BaleMetrics({ currentBale, averages }: BaleMetricsProps) {
  return (
    <Card className="p-6 border-2 border-card-border">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Box className="h-5 w-5 text-primary" />
        Current Bale Metrics
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Dimensions</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Length:</span>
                <span className="text-lg font-semibold text-foreground">
                  {currentBale.length.toFixed(2)} cm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Width:</span>
                <span className="text-lg font-semibold text-foreground">
                  {currentBale.width.toFixed(2)} cm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Height:</span>
                <span className="text-lg font-semibold text-foreground">
                  {currentBale.height.toFixed(2)} cm
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Weight & Density</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Weight:</span>
                <span className="text-lg font-semibold text-foreground">
                  {currentBale.weight.toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Density:</span>
                <span className="text-lg font-semibold text-foreground">
                  {currentBale.density.toFixed(2)} kg/m³
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 bg-muted/30 rounded-lg p-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Session Averages</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Avg. Length</span>
                  <span className="text-base font-semibold text-foreground">
                    {averages.length.toFixed(2)} cm
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentBale.length / 150) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Avg. Weight</span>
                  <span className="text-base font-semibold text-foreground">
                    {averages.weight.toFixed(2)} kg
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-chart-2 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentBale.weight / 800) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Avg. Density</span>
                  <span className="text-base font-semibold text-foreground">
                    {averages.density.toFixed(2)} kg/m³
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-chart-3 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentBale.density / 600) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
