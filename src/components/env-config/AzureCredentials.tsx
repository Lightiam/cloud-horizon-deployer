
import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface AzureCredentialsProps {
  credentials: {
    secretKey: string;
    subscriptionId: string;
    endpoint: string;
  };
  onCredentialsChange: (credentials: any) => void;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const AzureCredentials = ({
  credentials,
  onCredentialsChange,
  showValues,
  onToggleVisibility
}: AzureCredentialsProps) => {
  const handleChange = (field: string, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Azure Credentials</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="text-gray-400 hover:text-white"
        >
          {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <div className="grid gap-4">
        <CredentialInput
          id="azure-secret-key"
          label="Secret Key"
          value={credentials.secretKey}
          onChange={(value) => handleChange('secretKey', value)}
          placeholder="Secret key..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="azure-subscription"
          label="Subscription ID"
          value={credentials.subscriptionId}
          onChange={(value) => handleChange('subscriptionId', value)}
          placeholder="Subscription ID..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="azure-endpoint"
          label="Endpoint"
          value={credentials.endpoint}
          onChange={(value) => handleChange('endpoint', value)}
          placeholder="https://your-endpoint.azure.com"
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default AzureCredentials;
