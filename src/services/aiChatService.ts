interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface DeploymentContext {
  provider?: 'azure' | 'aws' | 'gcp' | 'netlify' | 'replit';
  resourceType?: string;
  userQuery: string;
  errorLogs?: string;
  currentInfrastructure?: any;
  deploymentId?: string;
}

interface AIResponse {
  message: string;
  suggestions?: string[];
  codeSnippet?: {
    language: 'terraform' | 'pulumi' | 'bash' | 'yaml' | 'javascript' | 'python';
    code: string;
    description: string;
  };
  troubleshooting?: {
    possibleCauses: string[];
    solutions: string[];
    preventionTips: string[];
  };
  nextSteps?: string[];
}

export class AIChatService {
  private apiKey: string | null = null;
  private systemPrompt: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || null;

    this.systemPrompt = `You are an expert cloud infrastructure and DevOps assistant for a multi-cloud deployment platform. Your role is to help users with:

1. Infrastructure planning and architecture recommendations
2. Troubleshooting deployment issues across Azure, AWS, GCP, Netlify, and Replit
3. Generating Infrastructure as Code (Terraform, Pulumi, Docker)
4. Optimizing cloud costs and performance
5. Security best practices and compliance
6. Real-time deployment assistance and error resolution

Key capabilities:
- Analyze deployment logs and error messages
- Suggest specific fixes for failed deployments
- Generate working code examples
- Provide step-by-step troubleshooting guides
- Recommend best practices for each cloud provider
- Help with container orchestration and serverless architectures

Always provide practical, actionable advice with specific examples. When generating code, ensure it's production-ready and follows security best practices.

Response format:
- Provide clear, step-by-step solutions
- Include relevant code snippets when helpful
- Suggest preventive measures for future deployments
- Reference specific error codes and troubleshooting steps
- Recommend optimal configurations for each cloud provider`;
  }

  async generateResponse(context: DeploymentContext, chatHistory: ChatMessage[] = []): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.getFallbackResponse(context);
    }

    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        ...chatHistory.slice(-10),
        { role: 'user', content: this.formatUserQuery(context) }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

      return this.parseAIResponse(aiResponse, context);
    } catch (error: any) {
      console.error('AI Chat Service Error:', error);
      return this.getFallbackResponse(context);
    }
  }

  async generateInfrastructureCode(prompt: string, provider: 'azure' | 'aws' | 'gcp' | 'netlify' | 'replit', codeType: 'terraform' | 'pulumi'): Promise<{ code: string; explanation: string }> {
    if (!this.apiKey) {
      return this.getFallbackInfrastructureCode(prompt, provider, codeType);
    }

    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        { 
          role: 'user', 
          content: `Generate ${codeType} code for ${provider} to: ${prompt}. Provide the code and a brief explanation of what it does.` 
        }
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'llama3-8b-8192',
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      const codeMatch = aiResponse.match(/```[\w]*\n([\s\S]*?)\n```/);
      const code = codeMatch ? codeMatch[1] : aiResponse;
      const explanation = aiResponse.replace(/```[\w]*\n[\s\S]*?\n```/g, '').trim();

      return { code, explanation };
    } catch (error: any) {
      console.error('Infrastructure Code Generation Error:', error);
      return this.getFallbackInfrastructureCode(prompt, provider, codeType);
    }
  }

  private getFallbackResponse(context: DeploymentContext): AIResponse {
    return {
      message: `I'll help you with your ${context.provider || 'cloud'} infrastructure needs. ${context.userQuery}`,
      suggestions: [
        'Configure your GROQ API key for enhanced AI assistance',
        'Check your cloud provider credentials',
        'Review the deployment logs for specific errors'
      ],
      nextSteps: [
        'Set up your cloud provider credentials',
        'Review your infrastructure requirements',
        'Test your deployment configuration'
      ]
    };
  }

  private getFallbackInfrastructureCode(prompt: string, provider: string, codeType: string): { code: string; explanation: string } {
    const templates = {
      terraform: {
        aws: `# AWS Infrastructure Template
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

# ${prompt}
resource "aws_instance" "example" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.micro"
  
  tags = {
    Name = "ExampleInstance"
  }
}`,
        azure: `# Azure Infrastructure Template
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ${prompt}
resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "East US"
}`,
        gcp: `# Google Cloud Infrastructure Template
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "your-project-id"
  region  = "us-central1"
}

# ${prompt}
resource "google_compute_instance" "example" {
  name         = "example-instance"
  machine_type = "e2-micro"
  zone         = "us-central1-a"
}`
      }
    };

    const code = templates[codeType as keyof typeof templates]?.[provider as keyof typeof templates.terraform] || 
                 `# ${codeType} template for ${provider}\n# ${prompt}\n# Please configure GROQ API key for detailed code generation`;
    
    return {
      code,
      explanation: `Basic ${codeType} template for ${provider}. Configure your GROQ API key for AI-powered code generation.`
    };
  }

  private formatUserQuery(context: DeploymentContext): string {
    let query = context.userQuery;
    
    if (context.provider) {
      query += `\n\nCloud Provider: ${context.provider}`;
    }
    
    if (context.resourceType) {
      query += `\nResource Type: ${context.resourceType}`;
    }
    
    if (context.deploymentId) {
      query += `\nDeployment ID: ${context.deploymentId}`;
    }
    
    if (context.errorLogs) {
      query += `\n\nError Logs:\n${context.errorLogs}`;
    }
    
    if (context.currentInfrastructure) {
      query += `\n\nCurrent Infrastructure:\n${JSON.stringify(context.currentInfrastructure, null, 2)}`;
    }

    return query;
  }

  private parseAIResponse(response: string, context: DeploymentContext): AIResponse {
    const codeMatches = response.match(/```(\w+)?\n([\s\S]*?)\n```/g);
    let codeSnippet;
    
    if (codeMatches && codeMatches.length > 0) {
      const firstMatch = codeMatches[0];
      const languageMatch = firstMatch.match(/```(\w+)?/);
      const codeMatch = firstMatch.match(/```\w*\n([\s\S]*?)\n```/);
      
      if (codeMatch) {
        codeSnippet = {
          language: (languageMatch?.[1] as any) || 'bash',
          code: codeMatch[1],
          description: 'Generated code snippet'
        };
      }
    }

    const suggestionMatches = response.match(/^- .+$/gm);
    const suggestions = suggestionMatches?.map(s => s.replace(/^- /, '')) || [];

    const cleanMessage = response.replace(/```[\w]*\n[\s\S]*?\n```/g, '').trim();

    return {
      message: cleanMessage,
      suggestions: suggestions.length > 0 ? suggestions.slice(0, 5) : undefined,
      codeSnippet,
      nextSteps: this.extractNextSteps(response)
    };
  }

  private extractNextSteps(response: string): string[] {
    const nextStepsMatch = response.match(/(?:next steps?|recommendations?):?\s*\n((?:(?:\d+\.|\-)\s*.+\n?)+)/i);
    if (nextStepsMatch) {
      return nextStepsMatch[1]
        .split('\n')
        .filter(step => step.trim())
        .map(step => step.replace(/^\d+\.\s*|\-\s*/, '').trim())
        .slice(0, 3);
    }
    return [];
  }
}

export const aiChatService = new AIChatService();
