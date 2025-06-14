import CredentialInput from "./CredentialInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ReplitCredentialsProps {
  credentials: {
    token: string;
    username: string;
  };
  onCredentialsChange: (credentials: any) => void;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const ReplitCredentials = ({
  credentials,
  onCredentialsChange,
  showValues,
  onToggleVisibility
}: ReplitCredentialsProps) => {
  const handleChange = (field: string, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Replit Credentials</h3>
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
          id="replit-token"
          label="API Token"
          value={credentials.token}
          onChange={(value) => handleChange('token', value)}
          placeholder="API token..."
          isSecret={true}
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
        <CredentialInput
          id="replit-username"
          label="Username"
          value={credentials.username}
          onChange={(value) => handleChange('username', value)}
          placeholder="Username..."
          showValues={showValues}
          onToggleVisibility={onToggleVisibility}
        />
      </div>
    </div>
  );
};

export default ReplitCredentials;
