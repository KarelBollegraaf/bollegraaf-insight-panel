import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bale } from "@/types/bale";
import { Ruler, Weight, Box, TrendingUp, TrendingDown, Minus, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BaleDetailModalProps {
  bale: Bale | null;
  isOpen: boolean;
  onClose: () => void;
  balerAverages: {
    length: number;
    width: number;
    height: number;
    weight: number;
    density: number;
  };
  allBalersAverages: {
    length: number;
    width: number;
    height: number;
    weight: number;
    density: number;
  };
}

const qualityConfig = {
  excellent: { label: "Excellent", className: "bg-status-success text-white" },
  good: { label: "Good", className: "bg-chart-2 text-white" },
  acceptable: { label: "Acceptable", className: "bg-status-idle text-white" },
};

function ComparisonIndicator({ value, average }: { value: number; average: number }) {
  const diff = value - average;
  const percentDiff = ((diff / average) * 100).toFixed(2);
  
  if (Math.abs(diff) < 1) {
    return (
      <span className="flex items-center gap-1 text-muted-foreground text-xs">
        <Minus className="h-3 w-3" /> On target
      </span>
    );
  }
  
  if (diff > 0) {
    return (
      <span className="flex items-center gap-1 text-status-success text-xs">
        <TrendingUp className="h-3 w-3" /> +{percentDiff}%
      </span>
    );
  }
  
  return (
    <span className="flex items-center gap-1 text-status-error text-xs">
      <TrendingDown className="h-3 w-3" /> {percentDiff}%
    </span>
  );
}

export function BaleDetailModal({
  bale,
  isOpen,
  onClose,
  balerAverages,
  allBalersAverages,
}: BaleDetailModalProps) {
  if (!bale) return null;

  const quality = qualityConfig[bale.quality];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <span>Bale #{bale.id} - Cardboard</span>
            <Badge className={quality.className}>{quality.label}</Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Pressed at {bale.timestamp.toLocaleString()}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Bale Metrics */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Box className="h-4 w-4 text-primary" />
              Bale Specifications
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Ruler className="h-4 w-4" />
                  <span>Dimensions</span>
                </div>
                <div className="space-y-2 pl-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Length:</span>
                    <span className="text-base font-semibold text-foreground">{bale.length.toFixed(2)} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Width:</span>
                    <span className="text-base font-semibold text-foreground">{bale.width.toFixed(2)} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Height:</span>
                    <span className="text-base font-semibold text-foreground">{bale.height.toFixed(2)} cm</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Weight className="h-4 w-4" />
                  <span>Weight & Density</span>
                </div>
                <div className="space-y-2 pl-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <span className="text-base font-semibold text-foreground">{bale.weight.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Density:</span>
                    <span className="text-base font-semibold text-foreground">{bale.density.toFixed(2)} kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Volume:</span>
                    <span className="text-base font-semibold text-foreground">
                      {((bale.length * bale.width * bale.height) / 1000000).toFixed(2)} m³
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison with This Baler Average */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4 text-sm">
              Comparison vs This Baler's Average
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Length</p>
                <p className="text-sm font-semibold text-foreground">{balerAverages.length.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.length} average={balerAverages.length} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Width</p>
                <p className="text-sm font-semibold text-foreground">{balerAverages.width.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.width} average={balerAverages.width} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-sm font-semibold text-foreground">{balerAverages.height.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.height} average={balerAverages.height} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-semibold text-foreground">{balerAverages.weight.toFixed(2)} kg</p>
                <ComparisonIndicator value={bale.weight} average={balerAverages.weight} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Density</p>
                <p className="text-sm font-semibold text-foreground">{balerAverages.density.toFixed(2)} kg/m³</p>
                <ComparisonIndicator value={bale.density} average={balerAverages.density} />
              </div>
            </div>
          </div>

          {/* Comparison with All Cardboard Balers Average */}
          <div className="border border-primary/20 bg-accent/20 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-4 text-sm flex items-center gap-2">
              <span>Comparison vs All Cardboard Balers Average</span>
              <Badge variant="outline" className="text-xs">Fleet-wide</Badge>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Length</p>
                <p className="text-sm font-semibold text-foreground">{allBalersAverages.length.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.length} average={allBalersAverages.length} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Width</p>
                <p className="text-sm font-semibold text-foreground">{allBalersAverages.width.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.width} average={allBalersAverages.width} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="text-sm font-semibold text-foreground">{allBalersAverages.height.toFixed(2)} cm</p>
                <ComparisonIndicator value={bale.height} average={allBalersAverages.height} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-sm font-semibold text-foreground">{allBalersAverages.weight.toFixed(2)} kg</p>
                <ComparisonIndicator value={bale.weight} average={allBalersAverages.weight} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Density</p>
                <p className="text-sm font-semibold text-foreground">{allBalersAverages.density.toFixed(2)} kg/m³</p>
                <ComparisonIndicator value={bale.density} average={allBalersAverages.density} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
