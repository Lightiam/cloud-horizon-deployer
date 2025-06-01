
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

interface HealthData {
  time: string;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  errorRate: number;
}

const HealthMonitorChart = () => {
  const [healthData, setHealthData] = useState<HealthData[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateData = () => {
      const now = new Date();
      const data: HealthData[] = [];
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          responseTime: Math.floor(Math.random() * 100) + 150,
          cpuUsage: Math.floor(Math.random() * 30) + 40,
          memoryUsage: Math.floor(Math.random() * 20) + 60,
          errorRate: Math.random() * 2,
        });
      }
      
      return data;
    };

    setHealthData(generateData());

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setHealthData(prev => {
        const newData = [...prev.slice(1)];
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          responseTime: Math.floor(Math.random() * 100) + 150,
          cpuUsage: Math.floor(Math.random() * 30) + 40,
          memoryUsage: Math.floor(Math.random() * 20) + 60,
          errorRate: Math.random() * 2,
        });
        return newData;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    responseTime: {
      label: "Response Time (ms)",
      color: "#10b981",
    },
    cpuUsage: {
      label: "CPU Usage (%)",
      color: "#3b82f6",
    },
    memoryUsage: {
      label: "Memory Usage (%)",
      color: "#f59e0b",
    },
    errorRate: {
      label: "Error Rate (%)",
      color: "#ef4444",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Response Time & Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke={chartConfig.responseTime.color}
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="errorRate" 
                  stroke={chartConfig.errorRate.color}
                  strokeWidth={2}
                  dot={false}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="cpuUsage"
                  stackId="1"
                  stroke={chartConfig.cpuUsage.color}
                  fill={chartConfig.cpuUsage.color}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="memoryUsage"
                  stackId="2"
                  stroke={chartConfig.memoryUsage.color}
                  fill={chartConfig.memoryUsage.color}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMonitorChart;
