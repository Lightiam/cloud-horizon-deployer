
import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface AzureCredentialsProps {
  credentials: {
    subscriptionId: string;
    clientId: string;
    clientSecret: string;
    tenantId: string;
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
          id="azure-client-id"
          label="Client ID"
          value={credentials.clientId}
          onChange={(value) => handleChange('clientId', value)}
          placeholder="Client ID..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="azure-client-secret"
          label="Client Secret"
          value={credentials.clientSecret}
          onChange={(value) => handleChange('clientSecret', value)}
          placeholder="Client secret..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="azure-tenant"
          label="Tenant ID"
          value={credentials.tenantId}
          onChange={(value) => handleChange('tenantId', value)}
          placeholder="Tenant ID..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default AzureCredentials;
