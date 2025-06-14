
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";
import NewDeploymentModal from "@/components/NewDeploymentModal";
import EnvConfigModal from "@/components/EnvConfigModal";
import { Button } from "@/components/ui/button";
import { Settings, Rocket, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Infrastructure Assistant
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            Describe your infrastructure needs in natural language and get ready-to-deploy 
            Infrastructure as Code (IaC) for 11+ cloud providers including AWS, Azure, GCP, Netlify, Replit, and more.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <EnvConfigModal />
            <NewDeploymentModal />
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Dashboard
            </Button>
          </div>
        </div>

        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
