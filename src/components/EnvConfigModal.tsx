import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";
import AwsCredentials from "./env-config/AwsCredentials";
import AzureCredentials from "./env-config/AzureCredentials";
import GcpCredentials from "./env-config/GcpCredentials";

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
      clientId: localStorage.getItem('AZURE_CLIENT_ID') || '',
      secretKey: localStorage.getItem('AZURE_SECRET_KEY') || '',
      tenantId: localStorage.getItem('AZURE_TENANT_ID') || '',
      subscriptionId: localStorage.getItem('AZURE_SUBSCRIPTION_ID') || '',
      endpoint: localStorage.getItem('AZURE_ENDPOINT') || 'https://management.azure.com'
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
    localStorage.setItem('AZURE_CLIENT_ID', envVars.azure.clientId);
    localStorage.setItem('AZURE_SECRET_KEY', envVars.azure.secretKey);
    localStorage.setItem('AZURE_TENANT_ID', envVars.azure.tenantId);
    localStorage.setItem('AZURE_SUBSCRIPTION_ID', envVars.azure.subscriptionId);
    localStorage.setItem('AZURE_ENDPOINT', envVars.azure.endpoint);

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

  const handleCredentialsChange = (provider: 'aws' | 'azure' | 'gcp', credentials: any) => {
    setEnvVars(prev => ({
      ...prev,
      [provider]: credentials
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
          
          <TabsContent value="aws">
            <AwsCredentials
              credentials={envVars.aws}
              onCredentialsChange={(creds) => handleCredentialsChange('aws', creds)}
              showValues={showValues.aws}
              onToggleVisibility={() => toggleShowValues('aws')}
            />
          </TabsContent>
          
          <TabsContent value="azure">
            <AzureCredentials
              credentials={envVars.azure}
              onCredentialsChange={(creds) => handleCredentialsChange('azure', creds)}
              showValues={showValues.azure}
              onToggleVisibility={() => toggleShowValues('azure')}
            />
          </TabsContent>
          
          <TabsContent value="gcp">
            <GcpCredentials
              credentials={envVars.gcp}
              onCredentialsChange={(creds) => handleCredentialsChange('gcp', creds)}
              showValues={showValues.gcp}
              onToggleVisibility={() => toggleShowValues('gcp')}
            />
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
