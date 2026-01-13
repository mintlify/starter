---
slug: /use-cases/observability/oss-monitoring
title: 'Self-managed monitoring'
sidebar_label: 'Self-managed monitoring'
description: 'Self-Managed Monitoring Guide'
doc_type: 'guide'
keywords: ['observability', 'monitoring', 'self-managed', 'metrics', 'system health']
---

import ObservabilityIntegrations from '@site/docs/_snippets/_observability_integration_options.md';
import DirectIntegrations from '@site/docs/_snippets/_direct_observability_integration_options.md';
import CommunityMonitoring from '@site/docs/_snippets/_community_monitoring.md';

# Self-managed monitoring

This guide provides enterprise teams evaluating ClickHouse open-source with comprehensive information on monitoring and observability capabilities for production deployments. Enterprise customers frequently ask about out-of-the-box monitoring features, integration with existing observability stacks including tools like Datadog and AWS CloudWatch, and how ClickHouse’ss monitoring compares to self-hosted deployments.

### Prometheus-based integration architecture
ClickHouse exposes Prometheus-compatible metrics through different endpoints depending on your deployment model, each with distinct operational characteristics:

**Self-Managed/OSS ClickHouse**

Direct server Prometheus endpoint accessible via the standard /metrics endpoint on your ClickHouse server. This approach provides:
- Complete metric exposure: Full range of available ClickHouse metrics without built-in filtering
- Real-time metrics: Generated directly from system tables when scraped

**Direct system access** 

Queries production system tables, which adds monitoring load and prevents cost-saving idle states

<ObservabilityIntegrations/>

### ClickStack deployment options

- [Helm](/use-cases/observability/clickstack/deployment/helm): Recommended for Kubernetes-based debugging environments. Allows for environment-specific configuration, resource limits, and scaling via `values.yaml`.
- [Docker Compose](/use-cases/observability/clickstack/deployment/docker-compose): Deploys each component (ClickHouse, HyperDX, OTel collector, MongoDB) individually.
- [HyperDX Only](/use-cases/observability/clickstack/deployment/hyperdx-only): Standalone HyperDX container.

For complete deployment options and architecture details, see the [ClickStack documentation](/use-cases/observability/clickstack/overview) and [data ingestion guide](/use-cases/observability/clickstack/ingesting-data/overview).

<DirectIntegrations/>

<CommunityMonitoring/>
