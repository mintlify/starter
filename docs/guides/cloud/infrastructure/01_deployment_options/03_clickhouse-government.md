---
title: 'ClickHouse Government'
slug: /cloud/infrastructure/clickhouse-government
keywords: ['government', 'fips', 'fedramp', 'gov cloud']
description: 'Overview of ClickHouse Government offering'
doc_type: 'reference'
---

## Overview [#overview]

ClickHouse Government is a self-deployed package consisting of the same proprietary version of ClickHouse that runs on ClickHouse Cloud and our ClickHouse Operator, configured for separation of compute and storage and hardened to meet the rigorous demands of government agencies and public sector organizations. It is deployed to Kubernetes environments with S3 compatible storage.

This package is currently available for AWS, with bare metal deployments coming soon.

<Note title="Note">
ClickHouse Government is designed for government agencies, public sector organizations, or cloud software companies selling to these agencies and organizations, providing full control and management over their dedicated infrastructure. This option is only available by [contacting us](https://clickhouse.com/government).
</Note>

## Benefits over open-source [#benefits-over-os]

The following features differentiate ClickHouse Government from self-managed open source deployments:

<Steps>

<Step>
### Enhanced performance [#enhanced-performance]
- Native separation of compute and storage
- Proprietary cloud features such as [shared merge tree](/cloud/reference/shared-merge-tree) and [warehouse](/cloud/reference/warehouses) functionality

</Step>

<Step>
### Tested and proven through a variety of use cases and conditions [#tested-proven]
- Fully tested and validated in ClickHouse Cloud

</Step>

<Step>
### Compliance package [#compliance-package]
- [NIST Risk Management Framework (RMF)](https://csrc.nist.gov/projects/risk-management/about-rmf) documentation to accelerate your Authorization to Operate (ATO)

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

ClickHouse Government is fully self-contained within your deployment environment and consists of compute managed within Kubernetes and storage within an S3 compatible storage solution.

<br />

<img src="/images/cloud/reference/private-gov-architecture.png" alt="ClickHouse Government Architecture"/>

<br />

## Onboarding process [#onboarding-process]

Customers can initiate onboarding by reaching out to [us](https://clickhouse.com/government). For qualified customers, we will provide a detailed environment build guide and access to the images and Helm charts for deployment.

## General requirements [#general-requirements]

This section is intended to provide an overview of the resources required to deploy ClickHouse Government. Specific deployment guides are provided as part of onboarding. Instance/server types and sizes depend on the use case.

### ClickHouse Government on AWS [#clickhouse-government-aws]

Required resources:
- [ECR](https://docs.aws.amazon.com/ecr/) to receive the images and Helm charts
- Certificate Authority capable of generating FIPS compliant certificates
- [EKS](https://docs.aws.amazon.com/eks/) cluster with [CNI](https://github.com/aws/amazon-vpc-cni-k8s), [EBS CSI Driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver), [DNS](https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html), [Cluster Autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md), [IMDS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html) for authentication and an [OIDC](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html) provider
- Server nodes run Amazon Linux
- Operator requires an x86 node group
- An S3 bucket in the same region as the EKS cluster
- If ingress is required, also configure an NLB
- One AWS role per ClickHouse cluster for clickhouse-server/keeper operations
