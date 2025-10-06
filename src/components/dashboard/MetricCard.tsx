import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "border-card-border",
  primary: "border-primary/20 bg-accent/30",
  success: "border-status-success/20 bg-status-success/5",
  warning: "border-status-idle/20 bg-status-idle/5",
};

const iconVariantStyles = {
  default: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  success: "bg-status-success text-white",
  warning: "bg-status-idle text-white",
};

export function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  variant = "default" 
}: MetricCardProps) {
  return (
    <Card className={`p-6 border-2 ${variantStyles[variant]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {trend && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className={trend.value >= 0 ? "text-status-success" : "text-status-error"}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>{" "}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconVariantStyles[variant]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
