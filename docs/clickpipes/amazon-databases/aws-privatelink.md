---
sidebarTitle: 'AWS PrivateLink for ClickPipes'
description: 'Establish a secure connection between ClickPipes and a data source using AWS PrivateLink.'
slug: /integrations/clickpipes/aws-privatelink
title: 'AWS PrivateLink for ClickPipes'
doc_type: 'guide'
keywords: ['aws privatelink', 'ClickPipes security', 'vpc endpoint', 'private connectivity', 'vpc resource']
---


You can use [AWS PrivateLink](https://aws.amazon.com/privatelink/) to establish secure connectivity between VPCs,
AWS services, your on-premises systems, and ClickHouse Cloud without exposing traffic to the public Internet.

This document outlines the ClickPipes reverse private endpoint functionality
that allows setting up an AWS PrivateLink VPC endpoint.

## Supported ClickPipes data sources 

ClickPipes reverse private endpoint functionality is limited to the following
data source types:
- Kafka
- Postgres
- MySQL

## Supported AWS PrivateLink endpoint types 

ClickPipes reverse private endpoint can be configured with one of the following AWS PrivateLink approaches:

- [VPC resource](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-resources.html)
- [MSK multi-VPC connectivity for MSK ClickPipe](https://docs.aws.amazon.com/msk/latest/developerguide/aws-access-mult-vpc.html)
- [VPC endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html)

### VPC resource 

Your VPC resources can be accessed in ClickPipes using [PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-resources.html). This approach doesn't require setting up a load balancer in front of your data source.

Resource configuration can be targeted with a specific host or RDS cluster ARN.
Cross-region is not supported.

It's the preferred choice for Postgres CDC ingesting data from an RDS cluster.

To set up PrivateLink with VPC resource:
1. Create a resource gateway
2. Create a resource configuration
3. Create a resource share

<Steps>

<Step>

#### Create a resource gateway

Resource gateway is the point that receives traffic for specified resources in your VPC.

<Note>
Your resource gateway attached subnets are recommended to have sufficient IP addresses available.
It's recommended to have at least `/26` subnet mask for each subnet.

For each VPC endpoint (each Reverse Private Endpoint), AWS requires a consecutive block of 16 IP addresses per subnet. (`/28` subnet mask)
If this requirement is not met, Reverse Private Endpoint will transition to a failed state.
</Note>

You can create a resource gateway from the [AWS console](https://docs.aws.amazon.com/vpc/latest/privatelink/create-resource-gateway.html) or with the following command:

```bash
aws vpc-lattice create-resource-gateway \
    --vpc-identifier <VPC_ID> \
    --subnet-ids <SUBNET_IDS> \
    --security-group-ids <SG_IDs> \
    --name <RESOURCE_GATEWAY_NAME>
```

The output will contain a resource gateway id, which you will need for the next step.

Before you can proceed,  you'll need to wait for the resource gateway to enter into an `Active` state. You can check the state by running the following command:

```bash
aws vpc-lattice get-resource-gateway \
    --resource-gateway-identifier <RESOURCE_GATEWAY_ID>
```

</Step>

<Step>

#### Create a VPC Resource-Configuration

Resource-Configuration is associated with resource gateway to make your resource accessible.

You can create a Resource-Configuration from the [AWS console](https://docs.aws.amazon.com/vpc/latest/privatelink/create-resource-configuration.html) or with the following command:

```bash
aws vpc-lattice create-resource-configuration \
    --resource-gateway-identifier <RESOURCE_GATEWAY_ID> \
    --type <RESOURCE_CONFIGURATION_TYPE> \
    --resource-configuration-definition <RESOURCE_CONFIGURATION_DEFINITION> \
    --name <RESOURCE_CONFIGURATION_NAME>
```

The simplest [resource configuration type](https://docs.aws.amazon.com/vpc-lattice/latest/ug/resource-configuration.html#resource-configuration-types) is a single Resource-Configuration. You can configure with the ARN directly, or share an IP address or a domain name that is publicly resolvable.

For example, to configure with the ARN of an RDS Cluster:

```bash
aws vpc-lattice create-resource-configuration \
    --name my-rds-cluster-config \
    --type ARN \
    --resource-gateway-identifier rgw-0bba03f3d56060135 \
    --resource-configuration-definition 'arnResource={arn=arn:aws:rds:us-east-1:123456789012:cluster:my-rds-cluster}'
```

<Note>
You can't create a resource configuration for a publicly accessible cluster.
If your cluster is publicly accessible, you must modify the cluster
to make it private before creating the resource configuration
or use [IP allow list](/integrations/clickpipes#list-of-static-ips) instead.
For more information, see the [AWS documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/resource-configuration.html#resource-definition).
</Note>

The output will contain a Resource-Configuration ARN, which you will need for the next step. It will also contain a Resource-Configuration ID, which you will need to set up a ClickPipe connection with VPC resource.

</Step>

<Step>

#### Create a Resource-Share

Sharing your resource requires a Resource-Share. This is facilitated through the Resource Access Manager (RAM).

You can put the Resource-Configuration into the Resource-Share through [AWS console](https://docs.aws.amazon.com/ram/latest/userguide/working-with-sharing-create.html) or by running the following command with ClickPipes account ID `072088201116` (arn:aws:iam::072088201116:root):

```bash
aws ram create-resource-share \
    --principals 072088201116 \
    --resource-arns <RESOURCE_CONFIGURATION_ARN> \
    --name <RESOURCE_SHARE_NAME>
```

The output will contain a Resource-Share ARN, which you will need to set up a ClickPipe connection with VPC resource.

You are ready to [create a ClickPipe with Reverse private endpoint](#creating-clickpipe) using VPC resource. You will need to:
- Set `VPC endpoint type` to `VPC Resource`.
- Set `Resource configuration ID` to the ID of the Resource-Configuration created in step 2.
- Set `Resource share ARN` to the ARN of the Resource-Share created in step 3.

For more details on PrivateLink with VPC resource, see [AWS documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-access-resources.html).

</Step>

</Steps>

### MSK multi-VPC connectivity 

The [Multi-VPC connectivity](https://docs.aws.amazon.com/msk/latest/developerguide/aws-access-mult-vpc.html) is a built-in feature of AWS MSK that allows you to connect multiple VPCs to a single MSK cluster.
Private DNS support is out of the box and does not require any additional configuration.
Cross-region is not supported.

It is a recommended option for ClickPipes for MSK.
See the [getting started](https://docs.aws.amazon.com/msk/latest/developerguide/mvpc-getting-started.html) guide for more details.

<Note>
Update your MSK cluster policy and add `072088201116` to the allowed principals to your MSK cluster.
See AWS guide for [attaching a cluster policy](https://docs.aws.amazon.com/msk/latest/developerguide/mvpc-cluster-owner-action-policy.html) for more details.
</Note>

Follow our [MSK setup guide for ClickPipes](/knowledgebase/aws-privatelink-setup-for-msk-clickpipes) to learn how to set up the connection.

### VPC endpoint service 

[VPC endpoint service](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html) is another approach to share your data source with ClickPipes.
It requires setting up a NLB (Network Load Balancer) in front of your data source
and configuring the VPC endpoint service to use the NLB.

VPC endpoint service can be [configured with a private DNS](https://docs.aws.amazon.com/vpc/latest/privatelink/manage-dns-names.html),
that will be accessible in a ClickPipes VPC.

It's a preferred choice for:

- Any on-premise Kafka setup that requires private DNS support
- [Cross-region connectivity for Postgres CDC](/knowledgebase/aws-privatelink-setup-for-clickpipes)
- Cross-region connectivity for MSK cluster. Please reach out to the ClickHouse support team for assistance.

See the [getting started](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html) guide for more details.

<Note>
Add ClickPipes account ID `072088201116` to the allowed principals to your VPC endpoint service.
See AWS guide for [managing permissions](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#add-remove-permissions) for more details.
</Note>

<Note>
[Cross-region access](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html#endpoint-service-cross-region)
can be configured for ClickPipes. Add [your ClickPipe region](#aws-privatelink-regions) to the allowed regions in your VPC endpoint service.
</Note>

## Creating a ClickPipe with reverse private endpoint 

<Steps>

<Step>

Access the SQL Console for your ClickHouse Cloud Service.

<img src="/images/integrations/data-ingestion/clickpipes/cp_service.png" alt="ClickPipes service"/>

</Step>

<Step>

Select the `Data Sources` button on the left-side menu and click on "Set up a ClickPipe"

<img src="/images/integrations/data-ingestion/clickpipes/cp_step0.png" alt="Select imports"/>

</Step>

<Step>

Select either Kafka or Postgres as a data source.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_select.png" alt="Select data source"/>

</Step>

<Step>

Select the `Reverse private endpoint` option.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_step0.png" alt="Select reverse private endpoint"/>

</Step>

<Step>

Select any of existing reverse private endpoints or create a new one.

<Note>
If cross-region access is required for RDS, you need to create a VPC endpoint service and
[this guide should provide](/knowledgebase/aws-privatelink-setup-for-clickpipes) a good starting point to set it up.

For same-region access, creating a VPC Resource is the recommended approach.
</Note>

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_step1.png" alt="Select reverse private endpoint"/>

</Step>

<Step>

Provide the required parameters for the selected endpoint type.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_step2.png" alt="Select reverse private endpoint"/>

- For VPC resource, provide the configuration share ARN and configuration ID.
- For MSK multi-VPC, provide the cluster ARN and authentication method used with a created endpoint.
- For VPC endpoint service, provide the service name.

</Step>

<Step>

Click on `Create` and wait for the reverse private endpoint to be ready.

If you are creating a new endpoint, it will take some time to set up the endpoint.
The page will refresh automatically once the endpoint is ready.
VPC endpoint service might require accepting the connection request in your AWS console.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_step3.png" alt="Select reverse private endpoint"/>

</Step>

<Step>

Once the endpoint is ready, you can use a DNS name to connect to the data source.

On a list of endpoints, you can see the DNS name for the available endpoint.
It can be either an internally ClickPipes provisioned DNS name or a private DNS name supplied by a PrivateLink service.
DNS name is not a complete network address.
Add the port according to the data source.

MSK connection string can be accessed in the AWS console.

To see a full list of DNS names, access it in the cloud service settings.

</Step>

</Steps>

## Managing existing reverse private endpoints 

You can manage existing reverse private endpoints in the ClickHouse Cloud service settings:

<Steps>

<Step>

On a sidebar find the `Settings` button and click on it.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_settings0.png" alt="ClickHouse Cloud settings"/>

</Step>

<Step>

Click on `Reverse private endpoints` in a `ClickPipe reverse private endpoints` section.

<img src="/images/integrations/data-ingestion/clickpipes/cp_rpe_settings1.png" alt="ClickHouse Cloud settings"/>

Reverse private endpoint extended information is shown in the flyout.

Endpoint can be removed from here. It will affect any ClickPipes using this endpoint.

</Step>

</Steps>

## Supported AWS regions 

AWS PrivateLink support is limited to specific AWS regions for ClickPipes.
Please refer to the [ClickPipes regions list](/integrations/clickpipes#list-of-static-ips) to see the available regions.

This restriction does not apply to PrivateLink VPC endpoint service with a cross-region connectivity enabled.

## Limitations 

AWS PrivateLink endpoints for ClickPipes created in ClickHouse Cloud are not guaranteed to be created
in the same AWS region as the ClickHouse Cloud service.

Currently, only VPC endpoint service supports
cross-region connectivity.

Private endpoints are linked to a specific ClickHouse service and are not transferable between services.
Multiple ClickPipes for a single ClickHouse service can reuse the same endpoint.
