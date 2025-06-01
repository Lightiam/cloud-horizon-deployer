import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Play, Rocket } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { deploymentService, DeploymentResult } from "@/services/deploymentService";
import DeploymentStatus from "./DeploymentStatus";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  iacCode?: string;
  provider?: string;
}

interface CodeOutputProps {
  messages: Message[];
}

const CodeOutput = ({ messages }: CodeOutputProps) => {
  const [selectedProvider, setSelectedProvider] = useState("terraform");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  
  const latestIaCMessage = messages
    .filter(m => m.type === "assistant" && m.iacCode)
    .pop();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "IaC code has been copied to your clipboard.",
    });
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeploy = async () => {
    if (!latestIaCMessage?.iacCode) {
      toast({
        title: "No code to deploy",
        description: "Please generate some infrastructure code first.",
        variant: "destructive"
      });
      return;
    }

    // Get Azure credentials from localStorage
    const azureCredentials = {
      secretKey: localStorage.getItem('AZURE_SECRET_KEY') || '',
      subscriptionId: localStorage.getItem('AZURE_SUBSCRIPTION_ID') || '',
      endpoint: localStorage.getItem('AZURE_ENDPOINT') || ''
    };

    setIsDeploying(true);
    setDeploymentResult(null);

    try {
      const result = await deploymentService.deployToAzure({
        provider: 'azure',
        iacCode: latestIaCMessage.iacCode,
        credentials: azureCredentials
      });

      setDeploymentResult(result);
      
      if (result.success) {
        toast({
          title: "Deployment completed!",
          description: "Your infrastructure has been deployed to Azure successfully.",
        });
      } else {
        toast({
          title: "Deployment failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast({
        title: "Deployment error",
        description: "An unexpected error occurred during deployment.",
        variant: "destructive"
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Generated Infrastructure Code
            {latestIaCMessage && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(latestIaCMessage.iacCode!)}
                  className="border-gray-600 text-gray-300"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCode(latestIaCMessage.iacCode!, "infrastructure.tf")}
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Rocket className="h-4 w-4 mr-1" />
                  Deploy to Azure
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          {latestIaCMessage ? (
            <Tabs value={selectedProvider} onValueChange={setSelectedProvider} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="terraform" className="data-[state=active]:bg-emerald-600">
                  Terraform
                </TabsTrigger>
                <TabsTrigger value="cloudformation" className="data-[state=active]:bg-emerald-600">
                  CloudFormation
                </TabsTrigger>
                <TabsTrigger value="pulumi" className="data-[state=active]:bg-emerald-600">
                  Pulumi
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terraform" className="flex-1 overflow-hidden mt-4">
                <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {latestIaCMessage.iacCode}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="cloudformation" className="flex-1 overflow-hidden mt-4">
                <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
                  <pre className="text-yellow-400 text-sm font-mono whitespace-pre-wrap">
                    {`# CloudFormation version coming soon
# Convert from Terraform using tools like terraformer
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Generated CloudFormation template'

Resources:
  # Resources will be generated based on your requirements`}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="pulumi" className="flex-1 overflow-hidden mt-4">
                <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
                  <pre className="text-purple-400 text-sm font-mono whitespace-pre-wrap">
                    {`# Pulumi version coming soon
import * as aws from "@pulumi/aws";

// Generated Pulumi infrastructure code
// Based on your requirements`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation to generate Infrastructure as Code</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DeploymentStatus 
        isDeploying={isDeploying}
        deploymentResult={deploymentResult}
        onClose={() => setDeploymentResult(null)}
      />
    </div>
  );
};

export default CodeOutput;
