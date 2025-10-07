import { useState, useEffect, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BaleMetrics } from "@/components/dashboard/BaleMetrics";
import { ProductionChart } from "@/components/dashboard/ProductionChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { BaleHistoryList } from "@/components/dashboard/BaleHistoryList";
import { BaleDetailModal } from "@/components/dashboard/BaleDetailModal";
import { CardboardStats } from "@/components/dashboard/CardboardStats";
import { AllBalesView } from "@/components/dashboard/AllBalesView";
import { StatisticsView } from "@/components/dashboard/StatisticsView";
import { MaterialBreakdown } from "@/components/dashboard/MaterialBreakdown";
import { EnergyAnalysis } from "@/components/dashboard/EnergyAnalysis";
import { WireConsumption } from "@/components/dashboard/WireConsumption";
import { TimeAnalysis } from "@/components/dashboard/TimeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Activity, Gauge } from "lucide-react";
import { Bale, GeneralStats } from "@/types/bale";
import { generateBaleData, calculateGeneralStats } from "@/utils/generateBaleData";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBale, setSelectedBale] = useState<Bale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate 1000 bales once
  const allBales = useMemo(() => generateBaleData(1000), []);
  const generalStats = useMemo(() => calculateGeneralStats(allBales), [allBales]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBaleClick = (bale: Bale) => {
    setSelectedBale(bale);
    setIsModalOpen(true);
  };

  // Recent bales (last 5)
  const recentBales = allBales.slice(0, 5);

  // Simulated real-time data - Cardboard baler
  const productionData = [
    { time: "08:00", balesPerHour: 38, tonsPerHour: 15 },
    { time: "09:00", balesPerHour: 42, tonsPerHour: 17 },
    { time: "10:00", balesPerHour: 45, tonsPerHour: 18 },
    { time: "11:00", balesPerHour: 41, tonsPerHour: 16 },
    { time: "12:00", balesPerHour: 35, tonsPerHour: 14 },
    { time: "13:00", balesPerHour: 48, tonsPerHour: 19 },
    { time: "14:00", balesPerHour: 44, tonsPerHour: 18 },
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

  const currentBale = recentBales[0];

  // This baler's averages
  const balerAverages = {
    length: allBales.reduce((sum, b) => sum + b.length, 0) / allBales.length,
    width: allBales.reduce((sum, b) => sum + b.width, 0) / allBales.length,
    height: allBales.reduce((sum, b) => sum + b.height, 0) / allBales.length,
    weight: allBales.reduce((sum, b) => sum + b.weight, 0) / allBales.length,
    density: allBales.reduce((sum, b) => sum + b.density, 0) / allBales.length,
  };

  // Fleet-wide averages (simulated slightly different)
  const fleetAverages = {
    length: balerAverages.length * 0.98,
    width: balerAverages.width * 1.01,
    height: balerAverages.height * 0.99,
    weight: balerAverages.weight * 0.97,
    density: balerAverages.density * 0.96,
  };

  const cardboardStats = {
    thisBalerAverage: {
      density: balerAverages.density,
      weight: balerAverages.weight,
      dailyOutput: allBales.length,
    },
    fleetAverage: {
      density: fleetAverages.density,
      weight: fleetAverages.weight,
      dailyOutput: Math.floor(allBales.length * 0.96),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader systemStatus="running" lastUpdate={currentTime} />

      <main className="p-6 space-y-6 max-w-[1800px] mx-auto">
        {/* Header Badge */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">006988-Papierhandel Janssen-NL</h2>
              <p className="text-sm text-muted-foreground">Specialized cardboard compression system</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Bales"
            value={allBales.length}
            icon={Package}
            variant="primary"
            trend={{ value: 8, label: "vs yesterday" }}
          />
          <MetricCard
            title="Operating Hours"
            value={generalStats.operatingHours.toFixed(2)}
            unit="hrs"
            icon={Activity}
            variant="default"
          />
          <MetricCard
            title="Total Energy"
            value={generalStats.totalKwh.toFixed(2)}
            unit="kWh"
            icon={Gauge}
            variant="success"
          />
          <MetricCard
            title="Avg Density"
            value={balerAverages.density.toFixed(2)}
            unit="kg/m³"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 4, label: "vs fleet avg" }}
          />
        </div>

        {/* Performance Comparison */}
        <CardboardStats
          thisBalerAverage={cardboardStats.thisBalerAverage}
          fleetAverage={cardboardStats.fleetAverage}
        />

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="all-bales">All Bales</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="energy">Energy & Time</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                <BaleMetrics currentBale={currentBale} averages={balerAverages} />
                <ProductionChart data={productionData} />
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                <BaleHistoryList bales={recentBales} onBaleClick={handleBaleClick} />
                <AlertsPanel alerts={alerts} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <MaterialBreakdown bales={allBales} />
            <WireConsumption bales={allBales} />
          </TabsContent>

          <TabsContent value="all-bales" className="mt-6">
            <AllBalesView bales={allBales} onBaleClick={handleBaleClick} />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <StatisticsView />
          </TabsContent>

          <TabsContent value="energy" className="mt-6 space-y-6">
            <EnergyAnalysis bales={allBales} />
            <TimeAnalysis bales={allBales} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bale Detail Modal */}
      <BaleDetailModal
        bale={selectedBale}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balerAverages={balerAverages}
        allBalersAverages={fleetAverages}
      />
    </div>
  );
};

export default Index;
