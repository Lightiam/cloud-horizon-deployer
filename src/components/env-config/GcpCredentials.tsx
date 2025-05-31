
import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface GcpCredentialsProps {
  credentials: {
    projectId: string;
    clientEmail: string;
    privateKey: string;
  };
  onCredentialsChange: (credentials: any) => void;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const GcpCredentials = ({
  credentials,
  onCredentialsChange,
  showValues,
  onToggleVisibility
}: GcpCredentialsProps) => {
  const handleChange = (field: string, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Google Cloud Credentials</h3>
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
          id="gcp-project"
          label="Project ID"
          value={credentials.projectId}
          onChange={(value) => handleChange('projectId', value)}
          placeholder="my-project-id"
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="gcp-client-email"
          label="Client Email"
          value={credentials.clientEmail}
          onChange={(value) => handleChange('clientEmail', value)}
          placeholder="service-account@project.iam.gserviceaccount.com"
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="gcp-private-key"
          label="Private Key"
          value={credentials.privateKey}
          onChange={(value) => handleChange('privateKey', value)}
          placeholder="-----BEGIN PRIVATE KEY-----"
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default GcpCredentials;
