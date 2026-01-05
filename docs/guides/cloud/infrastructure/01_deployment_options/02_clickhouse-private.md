---
title: 'ClickHouse Private'
slug: /cloud/infrastructure/clickhouse-private
keywords: ['private', 'on-prem']
description: 'Overview of ClickHouse Private offering'
doc_type: 'reference'
---

## Overview [#overview]

ClickHouse Private is a self-deployed package consisting of the same proprietary version of ClickHouse that runs on ClickHouse Cloud and our ClickHouse Operator, configured for separation of compute and storage. It is deployed to Kubernetes environments with S3 compatible storage.

This package is currently available for AWS and IBM Cloud, with bare metal deployments coming soon.

<Note title="Note">
ClickHouse Private is designed for large enterprises with the most rigorous compliance requirements, providing full control and management over their dedicated infrastructure. This option is only available by [contacting us](https://clickhouse.com/company/contact?loc=nav).
</Note>

## Benefits over open-source [#benefits-over-os]

The following features differentiate ClickHouse Private from self-managed open source deployments:

<Steps>

<Step>
### Enhanced performance [#enhanced-performance]
- Native separation of compute and storage
- Proprietary cloud features such as [shared merge tree](/cloud/reference/shared-merge-tree) and [warehouse](/cloud/reference/warehouses) functionality

</Step>

<Step>
### Tested and proven through a variety of use cases and conditions [#tested-proven-through-variety-of-use-cases]
- Fully tested and validated in ClickHouse Cloud

</Step>

<Step>
### Full featured roadmap with new features added regularly [#full-featured-roadmap]
Additional features that are coming soon include:
- API to programmatically manage resources
  - Automated backups
  - Automated vertical scaling operations
- Identity provider integration

</Step>

</Steps>

## Architecture [#architecture]

ClickHouse Private is fully self-contained within your deployment environment and consists of compute managed within Kubernetes and storage within an S3 compatible storage solution.

<br />

<img src="/images/cloud/reference/private-gov-architecture.png" alt="ClickHouse Private Architecture"/>

<br />

## Onboarding process [#onboarding-process]

Customers can initiate onboarding by reaching out to [us](https://clickhouse.com/company/contact?loc=nav). For qualified customers, we will provide a detailed environment build guide and access to the images and Helm charts for deployment.

## General requirements [#general-requirements]

This section is intended to provide an overview of the resources required to deploy ClickHouse Private. Specific deployment guides are provided as part of onboarding. Instance/ server types and sizes depend on the use case.

### ClickHouse Private on AWS [#clickhouse-private-aws]

Required resources:
- [ECR](https://docs.aws.amazon.com/ecr/) to receive the images and Helm charts
- [EKS](https://docs.aws.amazon.com/eks/) cluster with [CNI](https://github.com/aws/amazon-vpc-cni-k8s), [EBS CSI Driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver), [DNS](https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html), [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md), [IMDS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) for authentication and an [OIDC](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) provider
- Server nodes run Amazon Linux
- Operator requires an x86 node group
- An S3 bucket in the same region as the EKS cluster
- If ingress is required, also configure an NLB
- One AWS role per ClickHouse cluster for clickhouse-server/keeper operations

### ClickHouse Private on IBM Cloud [#clickhouse-private-ibm-cloud]

Required resources:
- [Container Registry](https://cloud.ibm.com/docs/Registry?topic=Registry-getting-started) to receive the images and Helm charts
- [Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers?topic=containers-getting-started) with [CNI](https://www.ibm.com/docs/en/cloud-private/3.2.x?topic=networking-kubernetes-network-model), [Cloud Block Storage for VPC](https://cloud.ibm.com/docs/containers?topic=containers-vpc-block), [Cloud DNS](https://www.ibm.com/products/dns), and [Cluster Autoscaler](https://cloud.ibm.com/docs/containers?topic=containers-cluster-scaling-install-addon-enable)
- Server nodes run Ubuntu
- Operator requires an x86 node group
- [Cloud Object Storage](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage) in the same region as the Cloud Kubernetes Service cluster
- If ingress is required, also configure an NLB
- One service account per ClickHouse cluster for clickhouse-server/keeper operations
