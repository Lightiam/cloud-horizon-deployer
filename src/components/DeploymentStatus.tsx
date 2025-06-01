
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { DeploymentResult } from "@/services/deploymentService";

interface DeploymentStatusProps {
  isDeploying: boolean;
  deploymentResult: DeploymentResult | null;
  onClose: () => void;
}

const DeploymentStatus = ({ isDeploying, deploymentResult, onClose }: DeploymentStatusProps) => {
  const [deploymentSteps, setDeploymentSteps] = useState<string[]>([]);

  useEffect(() => {
    if (isDeploying) {
      const steps = [
        "Validating credentials...",
        "Setting up Azure provider...",
        "Validating Terraform configuration...",
        "Planning infrastructure changes...",
        "Applying infrastructure changes...",
        "Finalizing deployment..."
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setDeploymentSteps(prev => [...prev, step]);
        }, index * 1000);
      });
    } else {
      setDeploymentSteps([]);
    }
  }, [isDeploying]);

  if (!isDeploying && !deploymentResult) {
    return null;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {isDeploying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Deploying to Azure...
            </>
          ) : deploymentResult?.success ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              Deployment Successful
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-500" />
              Deployment Failed
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isDeploying && (
          <div className="space-y-2">
            {deploymentSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{step}</span>
              </div>
            ))}
            {deploymentSteps.length < 6 && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Waiting for next step...</span>
              </div>
            )}
          </div>
        )}

        {deploymentResult && (
          <div className="space-y-3">
            <p className="text-gray-300">{deploymentResult.message}</p>
            
            {deploymentResult.deploymentId && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Deployment ID:</span>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                  {deploymentResult.deploymentId}
                </Badge>
              </div>
            )}

            {deploymentResult.resources && deploymentResult.resources.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Created Resources:</h4>
                <div className="space-y-1">
                  {deploymentResult.resources.map((resource, index) => (
                    <Badge key={index} variant="outline" className="text-blue-400 border-blue-400 mr-2">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {deploymentResult.errors && deploymentResult.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Errors:</h4>
                <div className="space-y-1">
                  {deploymentResult.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-300 bg-red-900/20 p-2 rounded">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white mt-4"
            >
              Close
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentStatus;
