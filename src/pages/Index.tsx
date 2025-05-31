
import Header from "@/components/Header";
import CloudProviderCard from "@/components/CloudProviderCard";
import DeploymentCard from "@/components/DeploymentCard";
import MetricsCard from "@/components/MetricsCard";
import NewDeploymentModal from "@/components/NewDeploymentModal";
import { Cloud, Server, Globe, Zap } from "lucide-react";

const Index = () => {
  const cloudProviders = [
    {
      name: "Amazon AWS",
      logo: "🟠",
      status: "connected" as const,
      deployments: 12,
      regions: 3,
      onConnect: () => console.log("Connect to AWS")
    },
    {
      name: "Microsoft Azure",
      logo: "🔵", 
      status: "connected" as const,
      deployments: 8,
      regions: 2,
      onConnect: () => console.log("Connect to Azure")
    },
    {
      name: "Google Cloud",
      logo: "🔴",
      status: "disconnected" as const,
      deployments: 0,
      regions: 0,
      onConnect: () => console.log("Connect to GCP")
    }
  ];

  const recentDeployments = [
    {
      projectName: "E-commerce Frontend",
      environment: "Production",
      provider: "AWS",
      status: "deployed" as const,
      url: "https://shop.example.com",
      lastDeployed: "2 hours ago",
      buildTime: "3m 42s"
    },
    {
      projectName: "API Gateway",
      environment: "Staging",
      provider: "Azure",
      status: "deploying" as const,
      lastDeployed: "In progress",
      buildTime: "1m 23s"
    },
    {
      projectName: "Analytics Dashboard",
      environment: "Development",
      provider: "AWS",
      status: "failed" as const,
      lastDeployed: "1 day ago",
      buildTime: "Failed"
    },
    {
      projectName: "User Service",
      environment: "Production",
      provider: "Azure",
      status: "deployed" as const,
      url: "https://users.example.com",
      lastDeployed: "3 hours ago",
      buildTime: "2m 15s"
    }
  ];

  const metrics = [
    {
      title: "Active Deployments",
      value: 23,
      change: 12,
      changeType: "increase" as const,
      icon: <Server className="h-4 w-4" />
    },
    {
      title: "Total Requests",
      value: "1.2M",
      change: 8.2,
      changeType: "increase" as const,
      icon: <Globe className="h-4 w-4" />
    },
    {
      title: "Average Response Time",
      value: "143ms",
      change: 5.1,
      changeType: "decrease" as const,
      icon: <Zap className="h-4 w-4" />
    },
    {
      title: "Success Rate",
      value: "99.9%",
      change: 0.1,
      changeType: "increase" as const,
      icon: <Cloud className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Deploy Everywhere
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Seamlessly deploy your applications across AWS, Azure, and Google Cloud Platform 
                with real-time monitoring and automated scaling.
              </p>
            </div>
            <NewDeploymentModal />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>

        {/* Cloud Providers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Cloud Providers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cloudProviders.map((provider, index) => (
              <CloudProviderCard key={index} {...provider} />
            ))}
          </div>
        </div>

        {/* Recent Deployments */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Deployments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentDeployments.map((deployment, index) => (
              <DeploymentCard key={index} {...deployment} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
