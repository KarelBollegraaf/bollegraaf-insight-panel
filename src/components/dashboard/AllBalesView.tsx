import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import { Bale } from "@/types/bale";
import { ExportButton } from "./ExportButton";

interface AllBalesViewProps {
  bales: Bale[];
  onBaleClick: (bale: Bale) => void;
}

const qualityConfig = {
  excellent: { label: "Excellent", className: "bg-status-success text-white" },
  good: { label: "Good", className: "bg-chart-2 text-white" },
  acceptable: { label: "Acceptable", className: "bg-status-idle text-white" },
};

export function AllBalesView({ bales, onBaleClick }: AllBalesViewProps) {
  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          All Bales Pressed ({bales.length} total)
        </h3>
        <ExportButton bales={bales} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bale ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Recipe</TableHead>
              <TableHead className="text-right">Length (cm)</TableHead>
              <TableHead className="text-right">Weight (kg)</TableHead>
              <TableHead className="text-right">Density (kg/m³)</TableHead>
              <TableHead className="text-right">kWh</TableHead>
              <TableHead className="text-right">Strokes</TableHead>
              <TableHead>Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bales.map((bale) => {
              const quality = qualityConfig[bale.quality];
              return (
                <TableRow
                  key={bale.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onBaleClick(bale)}
                >
                  <TableCell className="font-medium">{bale.id}</TableCell>
                  <TableCell>
                    {bale.timestamp.toLocaleDateString()} {bale.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>{bale.recipeName}</TableCell>
                  <TableCell className="text-right">{bale.measuredBaleLength.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{bale.weight.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{bale.density.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{(bale.kwhBaling + bale.kwhIdle).toFixed(2)}</TableCell>
                  <TableCell className="text-right">{bale.numberOfStrokes}</TableCell>
                  <TableCell>
                    <Badge className={`${quality.className} text-xs`}>
                      {quality.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
