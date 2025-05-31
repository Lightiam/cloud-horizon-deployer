
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal, Activity } from "lucide-react";

interface DeploymentCardProps {
  projectName: string;
  environment: string;
  provider: string;
  status: "deployed" | "deploying" | "failed" | "stopped";
  url?: string;
  lastDeployed: string;
  buildTime: string;
}

const DeploymentCard = ({ 
  projectName, 
  environment, 
  provider, 
  status, 
  url, 
  lastDeployed, 
  buildTime 
}: DeploymentCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "deployed": return "bg-emerald-500";
      case "deploying": return "bg-blue-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getProviderEmoji = () => {
    switch (provider) {
      case "AWS": return "🟠";
      case "Azure": return "🔵";
      case "GCP": return "🔴";
      default: return "☁️";
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{projectName}</CardTitle>
            <p className="text-gray-400 text-sm mt-1">{environment}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getProviderEmoji()}</span>
            <Badge className={`${getStatusColor()} text-white border-0`}>
              {status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Last Deployed</span>
            <p className="text-white">{lastDeployed}</p>
          </div>
          <div>
            <span className="text-gray-400">Build Time</span>
            <p className="text-white">{buildTime}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {url && (
            <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Logs
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentCard;
