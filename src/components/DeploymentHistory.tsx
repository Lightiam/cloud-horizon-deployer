
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, ExternalLink, Eye } from "lucide-react";

interface DeploymentRecord {
  id: string;
  projectName: string;
  environment: string;
  provider: string;
  status: "success" | "failed" | "in-progress" | "cancelled";
  timestamp: string;
  duration: string;
  deployedBy: string;
  commitHash?: string;
  url?: string;
}

const DeploymentHistory = () => {
  const deployments: DeploymentRecord[] = [
    {
      id: "azure-deploy-1748743175408",
      projectName: "Web App Frontend",
      environment: "Production",
      provider: "Azure",
      status: "success",
      timestamp: "2 hours ago",
      duration: "3m 24s",
      deployedBy: "John Doe",
      commitHash: "a1b2c3d",
      url: "https://myapp.azurewebsites.net"
    },
    {
      id: "azure-deploy-1748743175407",
      projectName: "API Gateway",
      environment: "Staging",
      provider: "Azure",
      status: "success",
      timestamp: "1 day ago",
      duration: "2m 18s",
      deployedBy: "Jane Smith",
      commitHash: "e4f5g6h"
    },
    {
      id: "azure-deploy-1748743175406",
      projectName: "Database Migration",
      environment: "Production",
      provider: "Azure",
      status: "failed",
      timestamp: "2 days ago",
      duration: "1m 45s",
      deployedBy: "Mike Johnson",
      commitHash: "i7j8k9l"
    },
    {
      id: "azure-deploy-1748743175405",
      projectName: "Web App Frontend",
      environment: "Staging",
      provider: "Azure",
      status: "success",
      timestamp: "3 days ago",
      duration: "4m 12s",
      deployedBy: "Sarah Wilson",
      commitHash: "m1n2o3p",
      url: "https://myapp-staging.azurewebsites.net"
    },
    {
      id: "azure-deploy-1748743175404",
      projectName: "Monitoring Service",
      environment: "Production",
      provider: "Azure",
      status: "in-progress",
      timestamp: "5 minutes ago",
      duration: "Running...",
      deployedBy: "Alex Chen",
      commitHash: "q4r5s6t"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProviderEmoji = (provider: string) => {
    switch (provider) {
      case "Azure":
        return "🔵";
      case "AWS":
        return "🟠";
      case "GCP":
        return "🔴";
      default:
        return "☁️";
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Deployment History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-600">
              <TableHead className="text-gray-300">Project</TableHead>
              <TableHead className="text-gray-300">Environment</TableHead>
              <TableHead className="text-gray-300">Provider</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Duration</TableHead>
              <TableHead className="text-gray-300">Deployed By</TableHead>
              <TableHead className="text-gray-300">Timestamp</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deployments.map((deployment) => (
              <TableRow key={deployment.id} className="border-gray-600">
                <TableCell className="text-white font-medium">
                  <div className="flex flex-col">
                    <span>{deployment.projectName}</span>
                    {deployment.commitHash && (
                      <span className="text-xs text-gray-400">
                        #{deployment.commitHash}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {deployment.environment}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-2">
                    <span>{getProviderEmoji(deployment.provider)}</span>
                    {deployment.provider}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(deployment.status)}
                    <Badge className={`${getStatusColor(deployment.status)} text-white border-0`}>
                      {deployment.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {deployment.duration}
                </TableCell>
                <TableCell className="text-gray-300">
                  {deployment.deployedBy}
                </TableCell>
                <TableCell className="text-gray-300">
                  {deployment.timestamp}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {deployment.url && (
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DeploymentHistory;
