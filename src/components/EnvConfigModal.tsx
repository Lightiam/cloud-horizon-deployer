
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Eye, EyeOff } from "lucide-react";

const EnvConfigModal = () => {
  const [open, setOpen] = useState(false);
  const [showValues, setShowValues] = useState({
    aws: false,
    azure: false,
    gcp: false
  });

  const [envVars, setEnvVars] = useState({
    aws: {
      accessKeyId: localStorage.getItem('AWS_ACCESS_KEY_ID') || '',
      secretAccessKey: localStorage.getItem('AWS_SECRET_ACCESS_KEY') || '',
      region: localStorage.getItem('AWS_DEFAULT_REGION') || 'us-west-2'
    },
    azure: {
      subscriptionId: localStorage.getItem('AZURE_SUBSCRIPTION_ID') || '',
      clientId: localStorage.getItem('AZURE_CLIENT_ID') || '',
      clientSecret: localStorage.getItem('AZURE_CLIENT_SECRET') || '',
      tenantId: localStorage.getItem('AZURE_TENANT_ID') || ''
    },
    gcp: {
      projectId: localStorage.getItem('GCP_PROJECT_ID') || '',
      clientEmail: localStorage.getItem('GCP_CLIENT_EMAIL') || '',
      privateKey: localStorage.getItem('GCP_PRIVATE_KEY') || ''
    }
  });

  const handleSave = () => {
    // Save AWS credentials
    localStorage.setItem('AWS_ACCESS_KEY_ID', envVars.aws.accessKeyId);
    localStorage.setItem('AWS_SECRET_ACCESS_KEY', envVars.aws.secretAccessKey);
    localStorage.setItem('AWS_DEFAULT_REGION', envVars.aws.region);

    // Save Azure credentials
    localStorage.setItem('AZURE_SUBSCRIPTION_ID', envVars.azure.subscriptionId);
    localStorage.setItem('AZURE_CLIENT_ID', envVars.azure.clientId);
    localStorage.setItem('AZURE_CLIENT_SECRET', envVars.azure.clientSecret);
    localStorage.setItem('AZURE_TENANT_ID', envVars.azure.tenantId);

    // Save GCP credentials
    localStorage.setItem('GCP_PROJECT_ID', envVars.gcp.projectId);
    localStorage.setItem('GCP_CLIENT_EMAIL', envVars.gcp.clientEmail);
    localStorage.setItem('GCP_PRIVATE_KEY', envVars.gcp.privateKey);

    setOpen(false);
  };

  const toggleShowValues = (provider: 'aws' | 'azure' | 'gcp') => {
    setShowValues(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Settings className="h-4 w-4 mr-2" />
          Configure Environment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Environment Variables</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="aws" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="aws" className="data-[state=active]:bg-gray-700">🟠 AWS</TabsTrigger>
            <TabsTrigger value="azure" className="data-[state=active]:bg-gray-700">🔵 Azure</TabsTrigger>
            <TabsTrigger value="gcp" className="data-[state=active]:bg-gray-700">🔴 GCP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="aws" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">AWS Credentials</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleShowValues('aws')}
                className="text-gray-400 hover:text-white"
              >
                {showValues.aws ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="aws-access-key">Access Key ID</Label>
                <Input
                  id="aws-access-key"
                  type={showValues.aws ? "text" : "password"}
                  value={envVars.aws.accessKeyId}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    aws: { ...prev.aws, accessKeyId: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="AKIA..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aws-secret-key">Secret Access Key</Label>
                <Input
                  id="aws-secret-key"
                  type={showValues.aws ? "text" : "password"}
                  value={envVars.aws.secretAccessKey}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    aws: { ...prev.aws, secretAccessKey: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Secret key..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aws-region">Default Region</Label>
                <Input
                  id="aws-region"
                  value={envVars.aws.region}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    aws: { ...prev.aws, region: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="us-west-2"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="azure" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Azure Credentials</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleShowValues('azure')}
                className="text-gray-400 hover:text-white"
              >
                {showValues.azure ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="azure-subscription">Subscription ID</Label>
                <Input
                  id="azure-subscription"
                  type={showValues.azure ? "text" : "password"}
                  value={envVars.azure.subscriptionId}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    azure: { ...prev.azure, subscriptionId: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Subscription ID..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="azure-client-id">Client ID</Label>
                <Input
                  id="azure-client-id"
                  type={showValues.azure ? "text" : "password"}
                  value={envVars.azure.clientId}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    azure: { ...prev.azure, clientId: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Client ID..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="azure-client-secret">Client Secret</Label>
                <Input
                  id="azure-client-secret"
                  type={showValues.azure ? "text" : "password"}
                  value={envVars.azure.clientSecret}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    azure: { ...prev.azure, clientSecret: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Client secret..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="azure-tenant">Tenant ID</Label>
                <Input
                  id="azure-tenant"
                  type={showValues.azure ? "text" : "password"}
                  value={envVars.azure.tenantId}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    azure: { ...prev.azure, tenantId: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Tenant ID..."
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gcp" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Google Cloud Credentials</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleShowValues('gcp')}
                className="text-gray-400 hover:text-white"
              >
                {showValues.gcp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gcp-project">Project ID</Label>
                <Input
                  id="gcp-project"
                  value={envVars.gcp.projectId}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    gcp: { ...prev.gcp, projectId: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="my-project-id"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gcp-client-email">Client Email</Label>
                <Input
                  id="gcp-client-email"
                  type={showValues.gcp ? "text" : "password"}
                  value={envVars.gcp.clientEmail}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    gcp: { ...prev.gcp, clientEmail: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="service-account@project.iam.gserviceaccount.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gcp-private-key">Private Key</Label>
                <Input
                  id="gcp-private-key"
                  type={showValues.gcp ? "text" : "password"}
                  value={envVars.gcp.privateKey}
                  onChange={(e) => setEnvVars(prev => ({
                    ...prev,
                    gcp: { ...prev.gcp, privateKey: e.target.value }
                  }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="-----BEGIN PRIVATE KEY-----"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save Credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnvConfigModal;
