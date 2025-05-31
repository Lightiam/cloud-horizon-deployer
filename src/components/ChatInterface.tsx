
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Copy, Download } from "lucide-react";
import CodeOutput from "@/components/CodeOutput";
import MessageHistory from "@/components/MessageHistory";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  iacCode?: string;
  provider?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'll generate the Infrastructure as Code for your requirements.",
        timestamp: new Date(),
        iacCode: generateSampleIaC(input),
        provider: "terraform",
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const generateSampleIaC = (userInput: string): string => {
    // Simple keyword-based IaC generation (placeholder for actual AI/RAG)
    if (userInput.toLowerCase().includes("s3") || userInput.toLowerCase().includes("storage")) {
      return `# AWS S3 Bucket Configuration
resource "aws_s3_bucket" "main_bucket" {
  bucket = "my-app-storage-bucket"
  
  tags = {
    Name        = "Main Storage"
    Environment = "production"
  }
}

resource "aws_s3_bucket_versioning" "main_bucket_versioning" {
  bucket = aws_s3_bucket.main_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "main_bucket_encryption" {
  bucket = aws_s3_bucket.main_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`;
    }

    if (userInput.toLowerCase().includes("ec2") || userInput.toLowerCase().includes("server")) {
      return `# AWS EC2 Instance Configuration
resource "aws_instance" "web_server" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.medium"
  
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  
  tags = {
    Name = "Web Server"
    Type = "Production"
  }
}

resource "aws_security_group" "web_sg" {
  name_prefix = "web-server-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
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
    }

    return `# Generated Infrastructure as Code
# Based on your requirements: "${userInput}"

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

# Your infrastructure components will be generated here
# Please provide more specific requirements for detailed IaC`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Chat Section */}
      <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Infrastructure Chat</h2>
          <p className="text-sm text-gray-400">Describe what you need to deploy</p>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageHistory messages={messages} isLoading={isLoading} />
          
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., I need a scalable web application with a database, load balancer, and auto-scaling group on AWS..."
                className="bg-gray-700 border-gray-600 text-white resize-none min-h-[60px]"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Code Output Section */}
      <CodeOutput messages={messages} />
    </div>
  );
};

export default ChatInterface;
