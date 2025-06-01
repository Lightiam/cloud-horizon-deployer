import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Server, 
  Database, 
  Cloud, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import MetricsCard from "@/components/MetricsCard";
import DeploymentCard from "@/components/DeploymentCard";
import HealthMonitorChart from "@/components/HealthMonitorChart";
import DeploymentHistory from "@/components/DeploymentHistory";

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Infrastructure Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor your deployments and infrastructure health
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Active Deployments"
            value="3"
            change={12}
            changeType="increase"
            icon={<Cloud className="h-4 w-4" />}
          />
          <MetricsCard
            title="Success Rate"
            value="98.5%"
            change={2.1}
            changeType="increase"
            icon={<CheckCircle className="h-4 w-4" />}
          />
          <MetricsCard
            title="Avg Response Time"
            value="240ms"
            change={-8.2}
            changeType="decrease"
            icon={<Activity className="h-4 w-4" />}
          />
          <MetricsCard
            title="Resources"
            value="24"
            change={15}
            changeType="increase"
            icon={<Server className="h-4 w-4" />}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="deployments" className="data-[state=active]:bg-emerald-600">
              Deployments
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-emerald-600">
              Health Monitoring
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HealthMonitorChart />
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Azure Services</span>
                    <Badge className="bg-green-500 text-white">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <Badge className="bg-green-500 text-white">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Load Balancer</span>
                    <Badge className="bg-yellow-500 text-white">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">CDN</span>
                    <Badge className="bg-green-500 text-white">Operational</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DeploymentCard
                projectName="Web App Frontend"
                environment="Production"
                provider="Azure"
                status="deployed"
                url="https://myapp.azurewebsites.net"
                lastDeployed="2 hours ago"
                buildTime="3m 24s"
              />
              <DeploymentCard
                projectName="API Gateway"
                environment="Production"
                provider="Azure"
                status="deployed"
                lastDeployed="1 day ago"
                buildTime="2m 18s"
              />
              <DeploymentCard
                projectName="Database Migration"
                environment="Staging"
                provider="Azure"
                status="deploying"
                lastDeployed="5 minutes ago"
                buildTime="1m 45s"
              />
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthMonitorChart />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <DeploymentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
