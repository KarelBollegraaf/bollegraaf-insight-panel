import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, Wrench, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "error" | "warning" | "info" | "maintenance";
  message: string;
  timestamp: Date;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  error: {
    icon: AlertTriangle,
    className: "bg-status-error/10 border-status-error/20 text-status-error",
    iconClassName: "text-status-error",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-status-idle/10 border-status-idle/20 text-status-idle",
    iconClassName: "text-status-idle",
  },
  info: {
    icon: Info,
    className: "bg-chart-2/10 border-chart-2/20 text-chart-2",
    iconClassName: "text-chart-2",
  },
  maintenance: {
    icon: Wrench,
    className: "bg-status-maintenance/10 border-status-maintenance/20 text-status-maintenance",
    iconClassName: "text-status-maintenance",
  },
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="p-6 border-2 border-card-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Alerts & Notifications
        </h3>
        {alerts.length === 0 && (
          <CheckCircle className="h-5 w-5 text-status-success" />
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-status-success mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">All systems operating normally</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = alertConfig[alert.type];
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${config.className} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${config.iconClassName}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
