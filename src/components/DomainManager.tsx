import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Plus, 
  Settings, 
  Shield, 
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired' | 'error';
  provider: string;
  expiryDate: string;
  sslStatus: 'valid' | 'expiring' | 'invalid';
  autoRenew: boolean;
}

const DomainManager = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'myapp.com',
      status: 'active',
      provider: 'Namecheap',
      expiryDate: '2025-03-15',
      sslStatus: 'valid',
      autoRenew: true
    },
    {
      id: '2',
      name: 'api.myapp.com',
      status: 'active',
      provider: 'Cloudflare',
      expiryDate: '2025-03-15',
      sslStatus: 'valid',
      autoRenew: true
    },
    {
      id: '3',
      name: 'staging.myapp.com',
      status: 'pending',
      provider: 'Route53',
      expiryDate: '2025-03-15',
      sslStatus: 'expiring',
      autoRenew: false
    }
  ]);

  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const domain: Domain = {
      id: Date.now().toString(),
      name: newDomain,
      status: 'pending',
      provider: 'Namecheap',
      expiryDate: '2026-03-15',
      sslStatus: 'invalid',
      autoRenew: true
    };
    
    setDomains(prev => [...prev, domain]);
    setNewDomain('');
    setIsAdding(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-red-500 text-white">Expired</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  const getSSLBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500 text-white">Valid SSL</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-500 text-white">Expiring Soon</Badge>;
      case 'invalid':
        return <Badge className="bg-red-500 text-white">Invalid SSL</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Domain Manager</h2>
          <p className="text-gray-400">Manage your domains and SSL certificates</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add New Domain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="new-domain" className="text-gray-300">Domain Name</Label>
              <Input
                id="new-domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddDomain}
                disabled={isAdding || !newDomain.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isAdding ? 'Adding...' : 'Add Domain'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="domains" className="data-[state=active]:bg-gray-700">Domains</TabsTrigger>
          <TabsTrigger value="ssl" className="data-[state=active]:bg-gray-700">SSL Certificates</TabsTrigger>
          <TabsTrigger value="dns" className="data-[state=active]:bg-gray-700">DNS Records</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <Card key={domain.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      {domain.name}
                    </CardTitle>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {getStatusBadge(domain.status)}
                    {getSSLBadge(domain.sslStatus)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Provider:</span>
                    <span className="text-white">{domain.provider}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-white">{domain.expiryDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Auto Renew:</span>
                    <span className={domain.autoRenew ? 'text-green-400' : 'text-red-400'}>
                      {domain.autoRenew ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {domains.map((domain) => (
              <Card key={domain.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    {domain.name}
                  </CardTitle>
                  {getSSLBadge(domain.sslStatus)}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Certificate Type:</span>
                    <span className="text-white">Let's Encrypt</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Issued:</span>
                    <span className="text-white">2024-12-15</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-white">2025-03-15</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Renew
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">DNS Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-400 border-b border-gray-600 pb-2">
                  <span>Type</span>
                  <span>Name</span>
                  <span>Value</span>
                  <span>TTL</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-white">
                  <span>A</span>
                  <span>@</span>
                  <span>192.168.1.1</span>
                  <span>3600</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-white">
                  <span>CNAME</span>
                  <span>www</span>
                  <span>myapp.com</span>
                  <span>3600</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm text-white">
                  <span>MX</span>
                  <span>@</span>
                  <span>mail.myapp.com</span>
                  <span>3600</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainManager;
