---
slug: /use-cases/observability/clickstack/deployment/local-mode-only
title: 'Local Mode Only'
pagination_prev: null
pagination_next: null
sidebar_position: 5
description: 'Deploying ClickStack with Local Mode Only - The ClickHouse Observability Stack'
doc_type: 'guide'
keywords: ['clickstack', 'deployment', 'setup', 'configuration', 'observability']
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'
import JsonSupport from '/snippets/_json_support.mdx';

Similar to the [all-in-one image](/use-cases/observability/clickstack/deployment/docker-compose), this comprehensive Docker image bundles all ClickStack components:

* **ClickHouse**
* **HyperDX**
* **OpenTelemetry (OTel) collector** (exposing OTLP on ports `4317` and `4318`)
* **MongoDB** (for persistent application state)

**However, user authentication is disabled for this distribution of HyperDX**

### Suitable for 

* Demos
* Debugging
* Development where HyperDX is used

## Deployment steps 
<br/>

<Steps>

<Step>

### Deploy with Docker 

Local mode deploys the HyperDX UI on port 8080.

```shell
docker run -p 8080:8080 docker.hyperdx.io/hyperdx/hyperdx-local
```

</Step>

<Step>

### Navigate to the HyperDX UI 

Visit [http://localhost:8080](http://localhost:8080) to access the HyperDX UI.

**You will not be prompted to create a user, as authentication is not enabled in this deployment mode.**

Connect to your own external ClickHouse cluster e.g. ClickHouse Cloud.

<img src="/images/use-cases/observability/hyperdx-2.png" alt="Create login"/>

Create a source, retain all default values, and complete the `Table` field with the value `otel_logs`. All other settings should be auto-detected, allowing you to click `Save New Source`.

<img src="/images/use-cases/observability/hyperdx-logs.png" alt="Create logs source"/>

</Step>

</Steps>

<JsonSupport />

For the local mode only image, users only need to set the `BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true` parameter e.g.

```shell
docker run -e BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true -p 8080:8080 docker.hyperdx.io/hyperdx/hyperdx-local
```
