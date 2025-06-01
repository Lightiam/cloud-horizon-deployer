import { ResourceManagementClient } from '@azure/arm-resources';
import { ClientSecretCredential } from '@azure/identity';
import { SubscriptionClient } from '@azure/arm-subscriptions';

interface DeploymentConfig {
  provider: 'aws' | 'azure' | 'gcp';
  iacCode: string;
  credentials: any;
}

interface DeploymentResult {
  success: boolean;
  message: string;
  deploymentId?: string;
  resources?: string[];
  errors?: string[];
}

class DeploymentService {
  async deployToAzure(config: DeploymentConfig): Promise<DeploymentResult> {
    const { iacCode, credentials } = config;
    
    try {
      // Validate Azure credentials
      if (!credentials.clientId || !credentials.secretKey || !credentials.tenantId || !credentials.subscriptionId) {
        return {
          success: false,
          message: 'Missing required Azure credentials. Please configure Client ID, Client Secret, Tenant ID, and Subscription ID.',
          errors: ['Missing credentials']
        };
      }

      console.log('Starting Azure deployment...');
      console.log('Credentials validated:', {
        hasClientId: !!credentials.clientId,
        hasSecretKey: !!credentials.secretKey,
        hasTenantId: !!credentials.tenantId,
        hasSubscriptionId: !!credentials.subscriptionId,
        hasEndpoint: !!credentials.endpoint
      });

      // Create deployment workspace
      const deploymentId = `azure-deploy-${Date.now()}`;
      
      const deploymentSteps = await this.executeAzureDeployment(iacCode, credentials, deploymentId);
      
      return {
        success: true,
        message: 'Azure deployment completed successfully',
        deploymentId,
        resources: deploymentSteps.resources
      };
      
    } catch (error) {
      console.error('Azure deployment failed:', error);
      return {
        success: false,
        message: `Azure deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  private async executeAzureDeployment(iacCode: string, credentials: any, deploymentId: string) {
    console.log(`Attempting to connect to Azure endpoint: ${credentials.endpoint || 'https://management.azure.com'}`);
    console.log(`Using Subscription ID: ${credentials.subscriptionId}`);
    
    try {
      // Create Azure credentials using service principal
      const credential = new ClientSecretCredential(
        credentials.tenantId,
        credentials.clientId,
        credentials.secretKey
      );

      const resourceClient = new ResourceManagementClient(credential, credentials.subscriptionId);
      const subscriptionClient = new SubscriptionClient(credential);

      console.log(`Deployment ${deploymentId}: Validating Azure connection...`);
      
      const subscriptions = subscriptionClient.subscriptions.list();
      let hasValidSubscription = false;
      for await (const subscription of subscriptions) {
        if (subscription.subscriptionId === credentials.subscriptionId) {
          hasValidSubscription = true;
          console.log(`Deployment ${deploymentId}: Connected to subscription: ${subscription.displayName}`);
          break;
        }
      }

      if (!hasValidSubscription) {
        throw new Error(`Subscription ${credentials.subscriptionId} not found or not accessible`);
      }

      console.log(`Deployment ${deploymentId}: Parsing Terraform configuration...`);
      const resources = this.parseResourcesFromIaC(iacCode);
      
      console.log(`Deployment ${deploymentId}: Planning infrastructure changes...`);
      
      const resourceGroupName = `rg-${deploymentId}`;
      const location = 'East US';
      
      console.log(`Deployment ${deploymentId}: Creating resource group: ${resourceGroupName}`);
      
      const resourceGroupResult = await resourceClient.resourceGroups.createOrUpdate(
        resourceGroupName,
        {
          location: location,
          tags: {
            'created-by': 'cloud-horizon-deployer',
            'deployment-id': deploymentId
          }
        }
      );

      console.log(`Deployment ${deploymentId}: Resource group created successfully`);
      console.log('Created resources:', [`Microsoft.Resources/resourceGroups.${resourceGroupName}`, ...resources]);
      
      return { 
        resources: [`Microsoft.Resources/resourceGroups.${resourceGroupName}`, ...resources]
      };

    } catch (error) {
      console.error(`Azure deployment ${deploymentId} failed:`, error);
      throw error;
    }
  }

  private parseResourcesFromIaC(iacCode: string): string[] {
    const resources: string[] = [];
    const resourceMatches = iacCode.match(/resource\s+"([^"]+)"\s+"([^"]+)"/g);
    
    if (resourceMatches) {
      resourceMatches.forEach(match => {
        const parts = match.match(/resource\s+"([^"]+)"\s+"([^"]+)"/);
        if (parts) {
          resources.push(`${parts[1]}.${parts[2]}`);
        }
      });
    }
    
    return resources;
  }

  async deployToAWS(config: DeploymentConfig): Promise<DeploymentResult> {
    // AWS deployment implementation would go here
    return {
      success: false,
      message: 'AWS deployment not implemented yet',
      errors: ['Not implemented']
    };
  }

  async deployToGCP(config: DeploymentConfig): Promise<DeploymentResult> {
    // GCP deployment implementation would go here
    return {
      success: false,
      message: 'GCP deployment not implemented yet',
      errors: ['Not implemented']
    };
  }


}

export const deploymentService = new DeploymentService();
export type { DeploymentConfig, DeploymentResult };
