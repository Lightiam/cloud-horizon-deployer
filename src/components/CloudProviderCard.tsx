
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CloudProviderCardProps {
  name: string;
  logo: string;
  status: "connected" | "disconnected" | "configuring";
  deployments: number;
  regions: number;
  onConnect: () => void;
}

const CloudProviderCard = ({ name, logo, status, deployments, regions, onConnect }: CloudProviderCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "connected": return "bg-emerald-500";
      case "configuring": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected": return "Connected";
      case "configuring": return "Configuring";
      default: return "Disconnected";
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{logo}</div>
            <CardTitle className="text-white">{name}</CardTitle>
          </div>
          <Badge className={`${getStatusColor()} text-white border-0`}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Deployments</span>
            <p className="text-xl font-semibold text-white">{deployments}</p>
          </div>
          <div>
            <span className="text-gray-400">Regions</span>
            <p className="text-xl font-semibold text-white">{regions}</p>
          </div>
        </div>
        <Button 
          onClick={onConnect}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={status === "configuring"}
        >
          {status === "connected" ? "Manage" : status === "configuring" ? "Configuring..." : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CloudProviderCard;
