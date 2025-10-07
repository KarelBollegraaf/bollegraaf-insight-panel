import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Bale } from "@/types/bale";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  bales: Bale[];
}

export function ExportButton({ bales }: ExportButtonProps) {
  const exportToCSV = () => {
    // CSV headers
    const headers = [
      "Bale ID",
      "DateTime",
      "Recipe Name",
      "kWh Baling",
      "kWh Idle",
      "Baling Time (min)",
      "Idle Time (min)",
      "Number of Strokes",
      "Channel Pressure Setting (%)",
      "Set Photocell Height (cm)",
      "Set Bale Length (cm)",
      "Measured Bale Length (cm)",
      "Number of Wires",
      "Density (kg/m³)",
      "Length (cm)",
      "Width (cm)",
      "Height (cm)",
      "Weight (kg)",
      "Quality",
    ];

    // CSV rows
    const rows = bales.map((bale) => [
      bale.id,
      bale.timestamp.toISOString(),
      bale.recipeName,
      bale.kwhBaling.toFixed(2),
      bale.kwhIdle.toFixed(2),
      bale.balingTime.toFixed(2),
      bale.idleTime.toFixed(2),
      bale.numberOfStrokes,
      bale.channelPressureSetting.toFixed(1),
      bale.setPhotocellHeight.toFixed(1),
      bale.setBaleLength.toFixed(1),
      bale.measuredBaleLength.toFixed(1),
      bale.numberOfWires,
      bale.density.toFixed(1),
      bale.length.toFixed(1),
      bale.width.toFixed(1),
      bale.height.toFixed(1),
      bale.weight.toFixed(1),
      bale.quality,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bale-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${bales.length} bales to CSV`,
    });
  };

  return (
    <Button onClick={exportToCSV} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Export to CSV
    </Button>
  );
}
