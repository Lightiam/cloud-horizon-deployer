import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface NetlifyCredentialsProps {
  credentials: {
    accessToken: string;
    siteId: string;
  };
  onCredentialsChange: (credentials: any) => void;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const NetlifyCredentials = ({
  credentials,
  onCredentialsChange,
  showValues,
  onToggleVisibility
}: NetlifyCredentialsProps) => {
  const handleChange = (field: string, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Netlify Credentials</h3>
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
          id="netlify-access-token"
          label="Access Token"
          value={credentials.accessToken}
          onChange={(value) => handleChange('accessToken', value)}
          placeholder="Access token..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="netlify-site-id"
          label="Site ID"
          value={credentials.siteId}
          onChange={(value) => handleChange('siteId', value)}
          placeholder="Site ID..."
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default NetlifyCredentials;
