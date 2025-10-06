import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import { Bale } from "./BaleHistoryList";

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
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        All Bales Pressed
      </h3>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bale ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Length (cm)</TableHead>
              <TableHead className="text-right">Width (cm)</TableHead>
              <TableHead className="text-right">Height (cm)</TableHead>
              <TableHead className="text-right">Weight (kg)</TableHead>
              <TableHead className="text-right">Density (kg/m³)</TableHead>
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
                  <TableCell className="text-right">{bale.length}</TableCell>
                  <TableCell className="text-right">{bale.width}</TableCell>
                  <TableCell className="text-right">{bale.height}</TableCell>
                  <TableCell className="text-right">{bale.weight}</TableCell>
                  <TableCell className="text-right">{bale.density}</TableCell>
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
