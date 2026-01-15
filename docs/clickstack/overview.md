---
slug: /use-cases/observability/clickstack/overview
title: 'ClickStack - The ClickHouse Observability Stack'
sidebarTitle: 'Overview'
pagination_prev: null
pagination_next: use-cases/observability/clickstack/getting-started
description: 'Overview for ClickStack - The ClickHouse Observability Stack'
doc_type: 'guide'
keywords: ['clickstack', 'observability', 'logs', 'monitoring', 'platform']
---

<img src="/images/use-cases/observability/hyperdx-landing.png" alt="Landing page"/>

**ClickStack** is a production-grade observability platform built on ClickHouse, unifying logs, traces, metrics and session in a single high-performance solution. Designed for monitoring and debugging complex systems, ClickStack enables developers and SREs to trace issues end-to-end without switching between tools or manually stitching together data using timestamps or correlation IDs.

At the core of ClickStack is a simple but powerful idea: all observability data should be ingested as wide, rich events. These events are stored in ClickHouse tables by data type - logs, traces, metrics, and sessions - but remain fully queryable and cross-correlatable at the database level.

ClickStack is built to handle high-cardinality workloads efficiently by leveraging ClickHouse's column-oriented architecture, native JSON support, and fully parallelized execution engine. This enables sub-second queries across massive datasets, fast aggregations over wide time ranges, and deep inspection of individual traces. JSON is stored in a compressed, columnar format, allowing schema evolution without manual intervention or upfront definitions.

## Features 

The stack includes several key features designed for debugging and root cause analysis:

- Correlate/search logs, metrics, session replays, and traces all in one place
- Schema agnostic, works on top of your existing ClickHouse schema
- Blazing-fast searches & visualizations optimized for ClickHouse
- Intuitive full-text search and property search syntax (ex. `level:err`), SQL optional.
- Analyze trends in anomalies with event deltas
- Set up alerts in just a few clicks
- Dashboard high cardinality events without a complex query language
- Native JSON string querying
- Live tail logs and traces to always get the freshest events
- OpenTelemetry (OTel) supported out of the box
- Monitor health and performance from HTTP requests to DB queries (APM)
- Event deltas for identifying anomalies and performance regressions
- Log pattern recognition

## Components 

ClickStack consists of three core components:

1. **HyperDX UI** – a purpose-built frontend for exploring and visualizing observability data
2. **OpenTelemetry collector** – a custom-built, preconfigured collector with an opinionated schema for logs, traces, and metrics
3. **ClickHouse** – the high-performance analytical database at the heart of the stack

These components can be deployed independently or together. A browser-hosted version of the HyperDX UI is also available, allowing users to connect to existing ClickHouse deployments without additional infrastructure.

To get started, visit the [Getting started guide](/use-cases/observability/clickstack/getting-started) before loading a [sample dataset](/use-cases/observability/clickstack/sample-datasets). You can also explore documentation on [deployment options](/use-cases/observability/clickstack/deployment) and [production best practices](/use-cases/observability/clickstack/production).

## Principles 

ClickStack is designed with a set of core principles that prioritize ease of use, performance, and flexibility at every layer of the observability stack:

### Easy to set up in minutes 

ClickStack works out of the box with any ClickHouse instance and schema, requiring minimal configuration. Whether you're starting fresh or integrating with an existing setup, you can be up and running in minutes.

### User-friendly and purpose-built 

The HyperDX UI supports both SQL and Lucene-style syntax, allowing users to choose the query interface that fits their workflow. Purpose-built for observability, the UI is optimized to help teams identify root causes quickly and navigate complex data without friction.

### End-to-end observability 

ClickStack provides full-stack visibility, from front-end user sessions to backend infrastructure metrics, application logs, and distributed traces. This unified view enables deep correlation and analysis across the entire system.

### Built for ClickHouse 

Every layer of the stack is designed to make full use of ClickHouse's capabilities. Queries are optimized to leverage ClickHouse's analytical functions and columnar engine, ensuring fast search and aggregation over massive volumes of data.

### OpenTelemetry-native 

ClickStack is natively integrated with OpenTelemetry, ingesting all data through an OpenTelemetry collector endpoint. For advanced users, it also supports direct ingestion into ClickHouse using native file formats, custom pipelines, or third-party tools like Vector.

### Open source and fully customizable 

ClickStack is fully open source and can be deployed anywhere. The schema is flexible and user-modifiable, and the UI is designed to be configurable to custom schemas without requiring changes. All components—including collectors, ClickHouse, and the UI - can be scaled independently to meet ingestion, query, or storage demands.

## Architectural overview 

<img src="/images/use-cases/observability/clickstack-simple-architecture.png" alt="Simple architecture"/>

ClickStack consists of three core components:

1. **HyperDX UI**  
   A user-friendly interface built for observability. It supports both Lucene-style and SQL queries, interactive dashboards, alerting, trace exploration, and more—all optimized for ClickHouse as the backend.

2. **OpenTelemetry collector**  
   A custom-built collector configured with an opinionated schema optimized for ClickHouse ingestion. It receives logs, metrics, and traces via OpenTelemetry protocols and writes them directly to ClickHouse using efficient batched inserts.

3. **ClickHouse**  
   The high-performance analytical database that serves as the central data store for wide events. ClickHouse powers fast search, filtering, and aggregation at scale, leveraging its columnar engine and native support for JSON.

In addition to these three components, ClickStack uses a **MongoDB instance** to store application state such as dashboards, user accounts, and configuration settings.

A full architectural diagram and deployment details can be found in the [Architecture section](/use-cases/observability/clickstack/architecture).

For users interesting in deploying ClickStack to production, we recommend reading the ["Production"](/use-cases/observability/clickstack/production) guide.
