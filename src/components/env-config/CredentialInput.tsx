
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface CredentialInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSecret?: boolean;
  showValues: boolean;
  onToggleVisibility: () => void;
}

const CredentialInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  isSecret = false,
  showValues,
  onToggleVisibility
}: CredentialInputProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={isSecret && !showValues ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-800 border-gray-600 text-white pr-10"
          placeholder={placeholder}
        />
        {isSecret && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            {showValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CredentialInput;
