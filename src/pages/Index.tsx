import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BaleMetrics } from "@/components/dashboard/BaleMetrics";
import { MaterialBreakdown } from "@/components/dashboard/MaterialBreakdown";
import { ProductionChart } from "@/components/dashboard/ProductionChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { Package, TrendingUp, Activity, Gauge } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated real-time data
  const productionData = [
    { time: "08:00", balesPerHour: 45, tonsPerHour: 18 },
    { time: "09:00", balesPerHour: 52, tonsPerHour: 21 },
    { time: "10:00", balesPerHour: 48, tonsPerHour: 19 },
    { time: "11:00", balesPerHour: 55, tonsPerHour: 22 },
    { time: "12:00", balesPerHour: 42, tonsPerHour: 17 },
    { time: "13:00", balesPerHour: 58, tonsPerHour: 23 },
    { time: "14:00", balesPerHour: 51, tonsPerHour: 20 },
  ];

  const materials = [
    { name: "Aluminum", count: 342, percentage: 35, color: "hsl(var(--chart-2))" },
    { name: "Hard Plastics", count: 278, percentage: 28, color: "hsl(var(--primary))" },
    { name: "Lightweight Plastics", count: 215, percentage: 22, color: "hsl(var(--chart-3))" },
    { name: "Cardboard", count: 145, percentage: 15, color: "hsl(var(--chart-5))" },
  ];

  const alerts = [
    {
      id: "1",
      type: "warning" as const,
      message: "Hydraulic pressure slightly below optimal range",
      timestamp: new Date(Date.now() - 1200000),
    },
    {
      id: "2",
      type: "info" as const,
      message: "Scheduled maintenance due in 48 hours",
      timestamp: new Date(Date.now() - 3600000),
    },
  ];

  const currentBale = {
    length: 120,
    width: 80,
    height: 75,
    weight: 485,
    density: 405,
  };

  const averages = {
    length: 118,
    weight: 478,
    density: 398,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader systemStatus="running" lastUpdate={currentTime} />

      <main className="p-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Bales Today"
            value={980}
            icon={Package}
            variant="primary"
            trend={{ value: 12, label: "vs yesterday" }}
          />
          <MetricCard
            title="Production Rate"
            value={51}
            unit="bales/hr"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8, label: "vs avg" }}
          />
          <MetricCard
            title="Throughput"
            value={20.4}
            unit="tons/hr"
            icon={Activity}
            variant="default"
          />
          <MetricCard
            title="System Efficiency"
            value={94}
            unit="%"
            icon={Gauge}
            variant="success"
            trend={{ value: 3, label: "vs last shift" }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <BaleMetrics currentBale={currentBale} averages={averages} />
            <ProductionChart data={productionData} />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <MaterialBreakdown materials={materials} />
            <AlertsPanel alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
