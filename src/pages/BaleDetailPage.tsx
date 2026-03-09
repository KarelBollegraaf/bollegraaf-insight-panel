import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBaleDetail, fetchCycles, fetchPressure } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function BaleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baleId = Number(id);

  const { data: bale, isLoading, error } = useQuery({
    queryKey: ["bale", baleId],
    queryFn: () => fetchBaleDetail(baleId),
    enabled: !!baleId,
  });

  const { data: cyclesData } = useQuery({
    queryKey: ["cycles", bale?.raw_id],
    queryFn: () => fetchCycles(bale!.raw_id),
    enabled: !!bale?.raw_id,
  });

  const { data: pressureData } = useQuery({
    queryKey: ["pressure", bale?.raw_id],
    queryFn: () => fetchPressure(bale!.raw_id),
    enabled: !!bale?.raw_id,
  });

  if (error) return <Card className="p-8 text-center text-status-error">Failed to load bale</Card>;
  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>;
  if (!bale) return <Card className="p-8 text-center text-muted-foreground">Bale not found</Card>;

  const valveData = [
    { name: "LP", value: bale.valve_lp },
    { name: "HP", value: bale.valve_hp },
    { name: "KO1", value: bale.valve_ko1 },
    { name: "KO2", value: bale.valve_ko2 },
    { name: "KD1", value: bale.valve_kd1 },
    { name: "KD2", value: bale.valve_kd2 },
    { name: "RP1", value: bale.valve_rp1 },
    { name: "RP2", value: bale.valve_rp2 },
    { name: "RR1", value: bale.valve_rr1 },
    { name: "RR2", value: bale.valve_rr2 },
    { name: "CH", value: bale.valve_ch },
    { name: "MES", value: bale.valve_mes },
  ].filter(v => v.value != null);

  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={() => navigate("/bales")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bales
      </Button>

      <Card className="p-6 border-2 border-card-border">
        <h2 className="text-xl font-bold text-foreground mb-1">
          Bale #{bale.bale_number} — {bale.material_name}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{new Date(bale.ts).toLocaleString()}</p>

        <Tabs defaultValue="summary">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="valves">Valves</TabsTrigger>
            <TabsTrigger value="cycles">Cycles</TabsTrigger>
            <TabsTrigger value="pressure">Pressure</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              {[
                ["Recipe #", bale.recipe_number],
                ["Shift", bale.shift_number],
                ["Operator", bale.username || "—"],
                ["Customer", bale.customer_number || "—"],
                ["Weight", `${bale.weight?.toFixed(2)} kg`],
                ["Volume", `${bale.volume?.toFixed(2)} m³`],
                ["Bale Length", `${bale.bale_length?.toFixed(2)} cm`],
                ["kWh Used", bale.kwh_used?.toFixed(2)],
                ["Total Time", `${bale.total_time?.toFixed(2)} s`],
                ["Auto Time", `${bale.auto_time?.toFixed(2)} s`],
                ["Standby Time", `${bale.standby_time?.toFixed(2)} s`],
                ["Empty Time", `${bale.empty_time?.toFixed(2)} s`],
                ["Oil Temperature", `${bale.oil_temperature?.toFixed(2)} °C`],
                ["Oil Level", bale.oil_level?.toFixed(2)],
                ["Wires V", bale.wires_vertical],
                ["Wires H", bale.wires_horizontal],
                ["Knots V", bale.knots_vertical],
                ["Knots H", bale.knots_horizontal],
              ].map(([label, val]) => (
                <div key={label as string} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className="font-semibold text-foreground">{val ?? "—"}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="valves" className="mt-6">
            {valveData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={valveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-muted-foreground">No valve data</p>}
          </TabsContent>

          <TabsContent value="cycles" className="mt-6 space-y-6">
            {cyclesData?.cycles?.length ? cyclesData.cycles.map((c, i) => (
              <Card key={i} className="p-4 border border-card-border">
                <h4 className="font-semibold text-foreground mb-2">{c.label}</h4>
                <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                  <span>Min: {c.stats.min}</span>
                  <span>Max: {c.stats.max}</span>
                  <span>Avg: {c.stats.avg}</span>
                  <span>Count: {c.stats.count}</span>
                </div>
                {c.values.length > 0 && (
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={c.values.map((v, idx) => ({ index: idx + 1, value: v }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="index" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  Values: [{c.values.join(", ")}]
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No cycle data available for this bale</p>}
          </TabsContent>

          <TabsContent value="pressure" className="mt-6 space-y-6">
            {pressureData?.pressure?.length ? pressureData.pressure.map((p, i) => (
              <Card key={i} className="p-4 border border-card-border">
                <h4 className="font-semibold text-foreground mb-2">{p.label}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.highPressure.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        High Pressure — Min: {p.highPressureStats.min} / Max: {p.highPressureStats.max} / Avg: {p.highPressureStats.avg}
                      </p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={p.highPressure.map((v, idx) => ({ i: idx, v }))}>
                          <XAxis dataKey="i" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                          <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                          <Bar dataKey="v" fill="hsl(var(--status-error))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {p.channelPressure.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Channel Pressure — Min: {p.channelPressureStats.min} / Max: {p.channelPressureStats.max} / Avg: {p.channelPressureStats.avg}
                      </p>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={p.channelPressure.map((v, idx) => ({ i: idx, v }))}>
                          <XAxis dataKey="i" fontSize={9} stroke="hsl(var(--muted-foreground))" />
                          <YAxis fontSize={9} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                          <Bar dataKey="v" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </Card>
            )) : <p className="text-muted-foreground">No pressure data available for this bale</p>}
          </TabsContent>

          <TabsContent value="raw" className="mt-6">
            {bale.parsedPayload ? (
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs text-foreground">
                {JSON.stringify(bale.parsedPayload, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">No raw payload data linked to this bale</p>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
