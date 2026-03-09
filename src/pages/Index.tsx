import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Package, Activity, Gauge, Zap, Thermometer, Droplets, Clock, Weight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function MetricCard({ title, value, unit, icon: Icon, variant = "default" }: {
  title: string;
  value: string | number;
  unit?: string;
  icon: any;
  variant?: "default" | "primary" | "success";
}) {
  const variantStyles = {
    default: "border-card-border",
    primary: "border-primary/30 bg-primary/5",
    success: "border-status-success/30 bg-status-success/5",
  };

  return (
    <Card className={`p-4 border-2 ${variantStyles[variant]}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">
            {value} {unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
          </p>
        </div>
      </div>
    </Card>
  );
}

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    refetchInterval: 10000,
  });

  if (error) {
    return (
      <Card className="p-8 text-center border-2 border-status-error/30">
        <p className="text-status-error font-semibold mb-2">Failed to connect to API</p>
        <p className="text-sm text-muted-foreground">
          Ensure the backend server is running at{" "}
          <code className="bg-muted px-2 py-1 rounded text-xs">{import.meta.env.VITE_API_URL || "http://localhost:3001/api"}</code>
        </p>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const { latest, stats, materials, recent24h } = data;

  return (
    <div className="space-y-6">
      {/* Machine badge */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {latest?.customer_number || "Baler"} — {latest?.material_name || "No data"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Latest bale #{latest?.bale_number} · {latest ? new Date(latest.ts).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Bales" value={stats?.total_bales ?? 0} icon={Package} variant="primary" />
        <MetricCard title="Last 24h" value={recent24h} icon={Activity} />
        <MetricCard title="Total Energy" value={(stats?.total_kwh ?? 0).toFixed(2)} unit="kWh" icon={Zap} variant="success" />
        <MetricCard title="Avg Weight" value={(stats?.avg_weight ?? 0).toFixed(2)} unit="kg" icon={Weight} />
        <MetricCard title="Avg Bale Length" value={(stats?.avg_bale_length ?? 0).toFixed(2)} unit="cm" icon={Gauge} />
        <MetricCard title="Avg Volume" value={(stats?.avg_volume ?? 0).toFixed(2)} unit="m³" icon={Package} />
        <MetricCard title="Oil Temperature" value={(latest?.oil_temperature ?? 0).toFixed(2)} unit="°C" icon={Thermometer} />
        <MetricCard title="Oil Level" value={(latest?.oil_level ?? 0).toFixed(2)} icon={Droplets} />
      </div>

      {/* Latest bale detail + materials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest bale */}
        {latest && (
          <Card className="p-6 border-2 border-card-border">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Latest Bale Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Bale Number", latest.bale_number],
                ["Material", latest.material_name],
                ["Recipe", latest.recipe_number],
                ["Shift", latest.shift_number],
                ["Weight", `${latest.weight?.toFixed(2)} kg`],
                ["Volume", `${latest.volume?.toFixed(2)} m³`],
                ["Length", `${latest.bale_length?.toFixed(2)} cm`],
                ["kWh", latest.kwh_used?.toFixed(2)],
                ["Total Time", `${latest.total_time?.toFixed(2)} s`],
                ["Auto Time", `${latest.auto_time?.toFixed(2)} s`],
                ["Standby Time", `${latest.standby_time?.toFixed(2)} s`],
                ["Operator", latest.username || "—"],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <p className="text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground">{val}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Materials */}
        <Card className="p-6 border-2 border-card-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Material Breakdown</h3>
          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.material_name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{m.material_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg weight: {m.avg_weight?.toFixed(2)} kg · Avg length: {m.avg_length?.toFixed(2)} cm
                  </p>
                </div>
                <span className="text-lg font-bold text-primary">{m.count}</span>
              </div>
            ))}
            {materials.length === 0 && (
              <p className="text-muted-foreground text-sm">No materials found</p>
            )}
          </div>
        </Card>
      </div>

      {/* Time summary */}
      {stats && (
        <Card className="p-6 border-2 border-card-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Time Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Total Time", (stats.sum_total_time / 3600).toFixed(2), "hrs"],
              ["Auto Time", (stats.sum_auto_time / 3600).toFixed(2), "hrs"],
              ["Standby Time", (stats.sum_standby_time / 3600).toFixed(2), "hrs"],
              ["Empty Time", (stats.sum_empty_time / 3600).toFixed(2), "hrs"],
            ].map(([label, val, unit]) => (
              <div key={label} className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-foreground">{val} <span className="text-sm font-normal">{unit}</span></p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Index;
