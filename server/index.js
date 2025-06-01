const express = require('express');
const cors = require('cors');
const { ClientSecretCredential, DefaultAzureCredential, EnvironmentCredential } = require('@azure/identity');
const { ResourceManagementClient } = require('@azure/arm-resources');
const { ContainerInstanceManagementClient } = require('@azure/arm-containerinstance');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/deploy/azure', async (req, res) => {
  try {
    const { iacCode } = req.body;
    
    const credentials = {
      clientId: process.env.AZURE_CLIENT_ID,
      secretKey: process.env.Azure_secret,
      tenantId: process.env.AZURE_TENANT_ID,
      subscriptionId: process.env.subscrition_id,
      endpoint: process.env.Azure_endpoint || 'https://management.azure.com'
    };
    
    console.log('Starting Azure deployment...');
    console.log('Available environment variables:', {
      hasAzureSecret: !!process.env.Azure_secret,
      hasAzureEndpoint: !!process.env.Azure_endpoint,
      hasSubscriptionId: !!process.env.subscrition_id,
      hasClientId: !!process.env.AZURE_CLIENT_ID,
      hasTenantId: !!process.env.AZURE_TENANT_ID
    });
    
    let credential;
    
    if (credentials.clientId && credentials.tenantId && credentials.secretKey) {
      console.log('Using ClientSecretCredential...');
      credential = new ClientSecretCredential(
        credentials.tenantId,
        credentials.clientId,
        credentials.secretKey
      );
    } else {
      console.log('Trying DefaultAzureCredential...');
      if (credentials.secretKey) {
        process.env.AZURE_CLIENT_SECRET = credentials.secretKey;
      }
      if (credentials.subscriptionId) {
        process.env.AZURE_SUBSCRIPTION_ID = credentials.subscriptionId;
      }
      
      credential = new DefaultAzureCredential();
    }
    
    const resourceClient = new ResourceManagementClient(credential, credentials.subscriptionId);
    const containerClient = new ContainerInstanceManagementClient(credential, credentials.subscriptionId);
    
    const deploymentId = `azure-deploy-${Date.now()}`;
    const resourceGroupName = `rg-${deploymentId}`;
    const location = 'East US';
    const resources = [];
    
    console.log(`Creating resource group: ${resourceGroupName}`);
    await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, {
      location: location,
      tags: {
        createdBy: 'cloud-horizon-deployer',
        deploymentId: deploymentId
      }
    });
    
    resources.push(`Microsoft.Resources/resourceGroups.${resourceGroupName}`);
    console.log(`Resource group ${resourceGroupName} created successfully`);
    
    if (iacCode.toLowerCase().includes('docker') || iacCode.toLowerCase().includes('container')) {
      const containerGroupName = `container-${deploymentId}`;
      
      console.log(`Creating container group: ${containerGroupName}`);
      
      const containerGroup = {
        location: location,
        containers: [
          {
            name: 'nginx-container',
            image: 'nginx:latest',
            resources: {
              requests: {
                cpu: 1,
                memoryInGB: 1
              }
            },
            ports: [
              {
                port: 80,
                protocol: 'TCP'
              }
            ]
          }
        ],
        osType: 'Linux',
        restartPolicy: 'Always',
        ipAddress: {
          type: 'Public',
          ports: [
            {
              port: 80,
              protocol: 'TCP'
            }
          ]
        },
        tags: {
          createdBy: 'cloud-horizon-deployer',
          deploymentId: deploymentId
        }
      };
      
      await containerClient.containerGroups.beginCreateOrUpdateAndWait(
        resourceGroupName,
        containerGroupName,
        containerGroup
      );
      
      resources.push(`Microsoft.ContainerInstance/containerGroups.${containerGroupName}`);
      console.log(`Container group ${containerGroupName} created successfully`);
    }
    
    res.json({
      success: true,
      message: 'Azure deployment completed successfully',
      deploymentId,
      resources,
      provider: 'azure'
    });
    
  } catch (error) {
    console.error('Azure deployment failed:', error);
    res.status(500).json({
      success: false,
      message: `Azure deployment failed: ${error.message}`,
      provider: 'azure'
    });
  }
});

app.listen(port, () => {
  console.log(`Azure deployment server running on http://localhost:${port}`);
});
