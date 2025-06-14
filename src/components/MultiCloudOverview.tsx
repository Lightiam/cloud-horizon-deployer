import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Server, 
  Database, 
  Globe,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";

interface ProviderStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  resources: number;
  cost: string;
  lastSync: string;
  icon: string;
}

const MultiCloudOverview = () => {
  const [providers, setProviders] = useState<ProviderStatus[]>([
    { name: 'AWS', status: 'connected', resources: 12, cost: '$45.67', lastSync: '2 min ago', icon: '🟠' },
    { name: 'Azure', status: 'connected', resources: 8, cost: '$32.14', lastSync: '5 min ago', icon: '🔵' },
    { name: 'GCP', status: 'disconnected', resources: 0, cost: '$0.00', lastSync: 'Never', icon: '🔴' },
    { name: 'Netlify', status: 'connected', resources: 3, cost: '$12.00', lastSync: '1 min ago', icon: '🟢' },
    { name: 'Replit', status: 'error', resources: 2, cost: '$8.50', lastSync: '10 min ago', icon: '🟣' },
    { name: 'Vercel', status: 'connected', resources: 5, cost: '$15.30', lastSync: '3 min ago', icon: '⚫' },
    { name: 'DigitalOcean', status: 'connected', resources: 4, cost: '$22.80', lastSync: '7 min ago', icon: '🔵' },
    { name: 'Heroku', status: 'disconnected', resources: 0, cost: '$0.00', lastSync: 'Never', icon: '🟣' }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500 text-white">Connected</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-500 text-white">Disconnected</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  const totalResources = providers.reduce((sum, provider) => sum + provider.resources, 0);
  const totalCost = providers.reduce((sum, provider) => {
    const cost = parseFloat(provider.cost.replace('$', ''));
    return sum + cost;
  }, 0);
  const connectedProviders = providers.filter(p => p.status === 'connected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Multi-Cloud Overview</h2>
          <p className="text-gray-400">Monitor all your cloud providers in one place</p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Connected Providers</CardTitle>
            <Cloud className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{connectedProviders}/{providers.length}</div>
            <p className="text-xs text-gray-400">Active connections</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Resources</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalResources}</div>
            <p className="text-xs text-gray-400">Across all providers</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-gray-400">Estimated monthly</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <Card key={provider.name} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <span className="mr-2 text-lg">{provider.icon}</span>
                {provider.name}
              </CardTitle>
              {getStatusBadge(provider.status)}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Resources:</span>
                <span className="text-white">{provider.resources}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cost:</span>
                <span className="text-white">{provider.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Sync:</span>
                <span className="text-white">{provider.lastSync}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MultiCloudOverview;
