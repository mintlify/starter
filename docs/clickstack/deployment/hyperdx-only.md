---
slug: /use-cases/observability/clickstack/deployment/hyperdx-only
title: 'HyperDX Only'
pagination_prev: null
pagination_next: null
sidebar_position: 4
description: 'Deploying HyperDX only'
doc_type: 'guide'
keywords: ['HyperDX standalone deployment', 'HyperDX ClickHouse integration', 'deploy HyperDX only', 'HyperDX Docker installation', 'ClickHouse visualization tool']
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'
import JsonSupport from '/snippets/_json_support.mdx';

This option is designed for users who already have a running ClickHouse instance populated with observability or event data.

HyperDX can be used independently of the rest of the stack and is compatible with any data schema - not just OpenTelemetry (OTel). This makes it suitable for custom observability pipelines already built on ClickHouse.

To enable full functionality, you must provide a MongoDB instance for storing application state, including dashboards, saved searches, user settings, and alerts.

In this mode, data ingestion is left entirely to the user. You can ingest data into ClickHouse using your own hosted OpenTelemetry collector, direct ingestion from client libraries, ClickHouse-native table engines (such as Kafka or S3), ETL pipelines, or managed ingestion services like ClickPipes. This approach offers maximum flexibility and is suitable for teams that already operate ClickHouse and want to layer HyperDX on top for visualization, search, and alerting.

### Suitable for 

- Existing ClickHouse users
- Custom event pipelines

## Deployment steps 
<br/>

<Steps>

<Step>

### Deploy with Docker 

Run the following command, modifying `YOUR_MONGODB_URI` as required.

```shell
docker run -e MONGO_URI=mongodb://YOUR_MONGODB_URI -p 8080:8080 docker.hyperdx.io/hyperdx/hyperdx
```

</Step>

<Step>

### Navigate to the HyperDX UI 

Visit [http://localhost:8080](http://localhost:8080) to access the HyperDX UI.

Create a user, providing a username and password which meets the requirements.

On clicking `Create` you'll be prompted for connection details.

<img src="/images/use-cases/observability/hyperdx-login.png" alt="HyperDX UI"/>

</Step>

<Step>

### Complete connection details 

Connect to your own external ClickHouse cluster e.g. ClickHouse Cloud.

<img src="/images/use-cases/observability/hyperdx-2.png" alt="HyperDX Login"/>

If prompted to create a source, retain all default values and complete the `Table` field with the value `otel_logs`. All other settings should be auto-detected, allowing you to click `Save New Source`.

<Note title="Creating a source">
Creating a source requires tables to exist in ClickHouse. If you don't have data, we recommend deploying the ClickStack OpenTelemetry collector to create tables.
</Note>

</Step>

</Steps>

## Using Docker Compose 

Users can modify the [Docker Compose configuration](/use-cases/observability/clickstack/deployment/docker-compose) to achieve the same effect as this guide, removing the OTel collector and ClickHouse instance from the manifest.

## ClickStack OpenTelemetry collector 

Even if you are managing your own OpenTelemetry collector, independent of the other components in the stack, we still recommend using the ClickStack distribution of the collector. This ensures the default schema is used and best practices for ingestion are applied.

For details on deploying and configuring a standalone collector see ["Ingesting with OpenTelemetry"](/use-cases/observability/clickstack/ingesting-data/otel-collector#modifying-otel-collector-configuration).

<JsonSupport />

For the HyperDX-only image, users only need to set the `BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true` parameter e.g.

```shell
docker run -e BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true -e MONGO_URI=mongodb://YOUR_MONGODB_URI -p 8080:8080 docker.hyperdx.io/hyperdx/hyperdx
```
