---
slug: /use-cases/observability
title: 'Observability'
pagination_prev: null
pagination_next: null
description: 'Landing page for the Observability use case guide'
keywords: ['observability', 'logs', 'traces', 'metrics', 'OpenTelemetry', 'Grafana', 'OTel']
doc_type: 'guide'
---

ClickHouse offers unmatched speed, scale, and cost-efficiency for observability. This guide provides two paths depending on your needs:

## ClickStack - the ClickHouse observability stack

The ClickHouse Observability Stack is our **recommended approach** for most users.

**ClickStack** is a production-grade observability platform built on ClickHouse and OpenTelemetry (OTel), unifying logs, traces, metrics and session in a single high-performance scalable solution that works from single-node deployments to **multi-petabyte** scale.

| Section | Description |
|---------|-------------|
| [Overview](/use-cases/observability/clickstack/overview) | Introduction to ClickStack and its key features |
| [Getting Started](/use-cases/observability/clickstack/getting-started) | Quick start guide and basic setup instructions |
| [Example Datasets](/use-cases/observability/clickstack/sample-datasets) | Sample datasets and use cases |
| [Architecture](/use-cases/observability/clickstack/architecture) | System architecture and components overview |
| [Deployment](/use-cases/observability/clickstack/deployment) | Deployment guides and options |
| [Configuration](/use-cases/observability/clickstack/config) | Detailed configuration options and settings |
| [Ingesting Data](/use-cases/observability/clickstack/ingesting-data) | Guidelines for ingesting data to ClickStack |
| [Search](/use-cases/observability/clickstack/search) | How to search and query your observability data |
| [Production](/use-cases/observability/clickstack/production) | Best practices for production deployment |

## Build-your-own stack

For users with **custom requirements** — such as highly specialized ingestion pipelines, schema designs, or extreme scaling needs — we provide guidance to build a custom observability stack with ClickHouse as the core database.

| Page                                                        | Description                                                                                                                                                                   |
|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Introduction](/use-cases/observability/introduction)            | This guide is designed for if you're looking to build your own observability solution using ClickHouse, focusing on logs and traces.                                             |
| [Schema design](/use-cases/observability/schema-design)          | Learn why users are recommended to create their own schema for logs and traces, along with some best practices for doing so.                                                  |
| [Managing data](/observability/managing-data)          | Deployments of ClickHouse for observability invariably involve large datasets, which need to be managed. ClickHouse offers features to assist with data management.           |
| [Integrating OpenTelemetry](/observability/integrating-opentelemetry) | Collecting and exporting logs and traces using OpenTelemetry with ClickHouse.                                                           |
| [Using Visualization Tools](/observability/grafana)    | Learn how to use observability visualization tools for ClickHouse, including HyperDX and Grafana.                                       |
| [Demo Application](/observability/demo-application)    | Explore the OpenTelemetry demo application forked to work with ClickHouse for logs and traces.                                           |
