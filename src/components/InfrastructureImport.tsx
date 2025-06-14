import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Download, CheckCircle, AlertTriangle } from "lucide-react";

interface ImportResult {
  success: boolean;
  message: string;
  convertedCode?: string;
  warnings?: string[];
}

const InfrastructureImport = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [importContent, setImportContent] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<string>("terraform");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!selectedFormat || !importContent.trim()) {
      setImportResult({
        success: false,
        message: "Please select a format and provide infrastructure code to import."
      });
      return;
    }

    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockConversion = generateMockConversion(selectedFormat, targetFormat, importContent);
    setImportResult(mockConversion);
    setIsProcessing(false);
  };

  const generateMockConversion = (from: string, to: string, content: string): ImportResult => {
    const resourceCount = (content.match(/resource|Resource|apiVersion/g) || []).length;
    
    if (resourceCount === 0) {
      return {
        success: false,
        message: "No infrastructure resources detected in the provided code."
      };
    }

    const convertedCode = `# Converted from ${from} to ${to}
# Original had ${resourceCount} resource(s)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

# Converted resources
resource "aws_instance" "imported_instance" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  
  tags = {
    Name = "Imported Instance"
    Source = "${from}"
  }
}

resource "aws_security_group" "imported_sg" {
  name_prefix = "imported-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`;

    return {
      success: true,
      message: `Successfully converted ${resourceCount} resource(s) from ${from} to ${to}`,
      convertedCode,
      warnings: [
        "Some resource properties may need manual adjustment",
        "Please review security group rules",
        "Verify region and availability zone settings"
      ]
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportContent(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Infrastructure Import</h2>
        <p className="text-gray-400">Import and convert infrastructure from various formats</p>
      </div>

      <Tabs defaultValue="paste" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="paste" className="data-[state=active]:bg-gray-700">Paste Code</TabsTrigger>
          <TabsTrigger value="upload" className="data-[state=active]:bg-gray-700">Upload File</TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Import Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-format" className="text-gray-300">Source Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select source format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="terraform">Terraform (.tf)</SelectItem>
                      <SelectItem value="cloudformation">CloudFormation (.yaml/.json)</SelectItem>
                      <SelectItem value="arm">ARM Template (.json)</SelectItem>
                      <SelectItem value="kubernetes">Kubernetes (.yaml)</SelectItem>
                      <SelectItem value="pulumi">Pulumi</SelectItem>
                      <SelectItem value="cdk">AWS CDK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-format" className="text-gray-300">Target Format</Label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="terraform">Terraform</SelectItem>
                      <SelectItem value="pulumi">Pulumi</SelectItem>
                      <SelectItem value="cdk">AWS CDK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="import-content" className="text-gray-300">Infrastructure Code</Label>
                <Textarea
                  id="import-content"
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  placeholder="Paste your infrastructure code here..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[200px] font-mono"
                />
              </div>

              <Button 
                onClick={handleImport}
                disabled={isProcessing || !selectedFormat || !importContent.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Convert Infrastructure
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Upload File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-format-upload" className="text-gray-300">Source Format</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select source format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="terraform">Terraform (.tf)</SelectItem>
                      <SelectItem value="cloudformation">CloudFormation (.yaml/.json)</SelectItem>
                      <SelectItem value="arm">ARM Template (.json)</SelectItem>
                      <SelectItem value="kubernetes">Kubernetes (.yaml)</SelectItem>
                      <SelectItem value="pulumi">Pulumi</SelectItem>
                      <SelectItem value="cdk">AWS CDK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-format-upload" className="text-gray-300">Target Format</Label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select target format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="terraform">Terraform</SelectItem>
                      <SelectItem value="pulumi">Pulumi</SelectItem>
                      <SelectItem value="cdk">AWS CDK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-gray-300">Upload Infrastructure File</Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Drag and drop your file here, or click to browse</p>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".tf,.yaml,.yml,.json,.py,.ts,.js"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Button 
                onClick={handleImport}
                disabled={isProcessing || !selectedFormat || !importContent.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 w-full"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Convert Infrastructure
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {importResult && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              )}
              Import Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={`text-sm ${importResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {importResult.message}
            </p>

            {importResult.warnings && importResult.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-400">Warnings:</h4>
                <ul className="text-sm text-yellow-300 space-y-1">
                  {importResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {importResult.convertedCode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Converted Code:</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                    onClick={() => navigator.clipboard.writeText(importResult.convertedCode || '')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  value={importResult.convertedCode}
                  readOnly
                  className="bg-gray-900 border-gray-600 text-green-400 font-mono text-sm min-h-[300px]"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfrastructureImport;
