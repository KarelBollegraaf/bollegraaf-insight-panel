import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  systemStatus: "running" | "idle" | "maintenance" | "error";
  lastUpdate: Date;
}

const statusConfig = {
  running: {
    label: "Running",
    className: "bg-status-running text-white",
  },
  idle: {
    label: "Idle",
    className: "bg-status-idle text-white",
  },
  maintenance: {
    label: "Maintenance",
    className: "bg-status-maintenance text-white",
  },
  error: {
    label: "Error",
    className: "bg-status-error text-white",
  },
};

export function DashboardHeader({ systemStatus, lastUpdate }: DashboardHeaderProps) {
  const status = statusConfig[systemStatus];

  return (
    <header className="bg-card border-b border-card-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <div className="w-3 h-3 rounded-full bg-primary opacity-70"></div>
              <div className="w-3 h-3 rounded-full bg-primary opacity-40"></div>
            </div>
            <h1 className="text-2xl font-bold text-secondary">Bollegraaf</h1>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <h2 className="text-lg font-semibold text-foreground">Baler Statistics</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <Badge className={`${status.className} px-3 py-1 font-semibold`}>
              {status.label}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
}
