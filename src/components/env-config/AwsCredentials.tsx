
import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface AwsCredentialsProps {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  onCredentialsChange: (credentials: any) => void;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const AwsCredentials = ({
  credentials,
  onCredentialsChange,
  showValues,
  onToggleVisibility
}: AwsCredentialsProps) => {
  const handleChange = (field: string, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AWS Credentials</h3>
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
          id="aws-access-key"
          label="Access Key ID"
          value={credentials.accessKeyId}
          onChange={(value) => handleChange('accessKeyId', value)}
          placeholder="AKIA..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="aws-secret-key"
          label="Secret Access Key"
          value={credentials.secretAccessKey}
          onChange={(value) => handleChange('secretAccessKey', value)}
          placeholder="Secret key..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="aws-region"
          label="Default Region"
          value={credentials.region}
          onChange={(value) => handleChange('region', value)}
          placeholder="us-west-2"
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default AwsCredentials;
