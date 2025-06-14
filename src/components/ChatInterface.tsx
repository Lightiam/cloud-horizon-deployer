
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

    try {
      const aiResponse = await generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: aiResponse.explanation || "I'll generate the Infrastructure as Code for your requirements.",
        timestamp: new Date(),
        iacCode: aiResponse.code,
        provider: "terraform",
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I encountered an issue generating the code. Please try again or configure your GROQ API key for enhanced AI assistance.",
        timestamp: new Date(),
        iacCode: "# Error generating code\n# Please try again or configure GROQ API key",
        provider: "terraform",
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<{code: string, explanation: string}> => {
    try {
      const { aiChatService } = await import('@/services/aiChatService');
      return await aiChatService.generateInfrastructureCode(userInput, 'aws', 'terraform');
    } catch (error) {
      console.error('AI service error:', error);
      return {
        code: `# Generated Infrastructure as Code
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
# Please configure GROQ API key for AI-powered code generation`,
        explanation: 'Basic infrastructure template. Configure GROQ API key for enhanced AI assistance.'
      };
    }
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
