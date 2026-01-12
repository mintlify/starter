---
sidebarTitle: 'Architecture'
slug: /cloud/reference/architecture
title: 'ClickHouse Cloud architecture'
description: 'This page describes the architecture of ClickHouse Cloud'
keywords: ['ClickHouse Cloud', 'cloud architecture', 'separation of storage and compute']
doc_type: 'reference'
---

<img src="/images/cloud/reference/architecture.png" alt="Cloud architecture"/>

## Storage backed by object store 
- Virtually unlimited storage
- No need to manually share data
- Significantly lower price point for storing data, especially data that is accessed less frequently

## Compute 
- Automatic scaling and idling: No need to size up front, and no need to over-provision for peak use
- Automatic idling and resume: No need to have unused compute running while no one is using it
- Secure and HA by default

## Administration 
- Setup, monitoring, backups, and billing are performed for you.
- Cost controls are enabled by default, and can be adjusted by you through the Cloud console.

## Service isolation 

### Network isolation 

All services are isolated at the network layer.

### Compute isolation 

All services are deployed in separate pods in their respective Kubernetes spaces, with network level isolation.

### Storage isolation 

All services use a separate subpath of a shared bucket (AWS, GCP) or storage container (Azure).

For AWS, access to storage is controlled via AWS IAM, and each IAM role is unique per service. For the Enterprise service, [CMEK](/cloud/security/cmek) can be enabled to provide advanced data isolation at rest. CMEK is only supported for AWS services at this time.

For GCP and Azure, services have object storage isolation (all services have their own buckets or storage container).

## Compute-compute separation 
[Compute-compute separation](/cloud/reference/warehouses) lets users create multiple compute node groups, each with their own service URL, that all use the same shared object storage. This allows for compute isolation of different use cases such as reads from writes, that share the same data. It also leads to more efficient resource utilization by allowing for independent scaling of the compute groups as needed.

## Concurrency limits 

There is no limit to the number of queries per second (QPS) in your ClickHouse Cloud service. There is, however, a limit of 1000 concurrent queries per replica. QPS is ultimately a function of your average query execution time and the number of replicas in your service.

A major benefit of ClickHouse Cloud compared to a self-managed ClickHouse instance or other databases/data warehouses is that you can easily increase concurrency by [adding more replicas (horizontal scaling)](/manage/scaling#manual-horizontal-scaling).
