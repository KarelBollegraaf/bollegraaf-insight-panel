import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BaleMetrics } from "@/components/dashboard/BaleMetrics";
import { ProductionChart } from "@/components/dashboard/ProductionChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { BaleHistoryList, Bale } from "@/components/dashboard/BaleHistoryList";
import { BaleDetailModal } from "@/components/dashboard/BaleDetailModal";
import { CardboardStats } from "@/components/dashboard/CardboardStats";
import { AllBalesView } from "@/components/dashboard/AllBalesView";
import { StatisticsView } from "@/components/dashboard/StatisticsView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Activity, Gauge } from "lucide-react";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBale, setSelectedBale] = useState<Bale | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Recent bales history
  const recentBales: Bale[] = [
    {
      id: "CB-1847",
      timestamp: new Date(Date.now() - 300000),
      length: 122,
      width: 78,
      height: 72,
      weight: 392,
      density: 445,
      quality: "excellent",
    },
    {
      id: "CB-1846",
      timestamp: new Date(Date.now() - 900000),
      length: 118,
      width: 80,
      height: 70,
      weight: 378,
      density: 428,
      quality: "good",
    },
    {
      id: "CB-1845",
      timestamp: new Date(Date.now() - 1500000),
      length: 115,
      width: 79,
      height: 73,
      weight: 385,
      density: 438,
      quality: "good",
    },
    {
      id: "CB-1844",
      timestamp: new Date(Date.now() - 2100000),
      length: 120,
      width: 77,
      height: 71,
      weight: 368,
      density: 415,
      quality: "acceptable",
    },
    {
      id: "CB-1843",
      timestamp: new Date(Date.now() - 2700000),
      length: 125,
      width: 81,
      height: 74,
      weight: 405,
      density: 455,
      quality: "excellent",
    },
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
    length: 122,
    width: 78,
    height: 72,
    weight: 392,
    density: 445,
  };

  // This baler's averages
  const balerAverages = {
    length: 120,
    width: 79,
    height: 72,
    weight: 386,
    density: 438,
  };

  // Fleet-wide averages for all cardboard balers
  const fleetAverages = {
    length: 118,
    width: 80,
    height: 71,
    weight: 382,
    density: 432,
  };

  const cardboardStats = {
    thisBalerAverage: {
      density: 438,
      weight: 386,
      dailyOutput: 425,
    },
    fleetAverage: {
      density: 432,
      weight: 382,
      dailyOutput: 410,
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
            title="Total Bales Today"
            value={425}
            icon={Package}
            variant="primary"
            trend={{ value: 8, label: "vs yesterday" }}
          />
          <MetricCard
            title="Production Rate"
            value={44}
            unit="bales/hr"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 5, label: "vs avg" }}
          />
          <MetricCard
            title="Throughput"
            value={17.6}
            unit="tons/hr"
            icon={Activity}
            variant="default"
          />
          <MetricCard
            title="System Efficiency"
            value={96}
            unit="%"
            icon={Gauge}
            variant="success"
            trend={{ value: 4, label: "vs last shift" }}
          />
        </div>

        {/* Performance Comparison */}
        <CardboardStats
          thisBalerAverage={cardboardStats.thisBalerAverage}
          fleetAverage={cardboardStats.fleetAverage}
        />

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all-bales">All Bales</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
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

          <TabsContent value="all-bales" className="mt-6">
            <AllBalesView bales={recentBales} onBaleClick={handleBaleClick} />
          </TabsContent>

          <TabsContent value="statistics" className="mt-6">
            <StatisticsView />
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
