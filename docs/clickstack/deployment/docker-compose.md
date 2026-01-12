---
slug: /use-cases/observability/clickstack/deployment/docker-compose
title: 'Docker Compose'
pagination_prev: null
pagination_next: null
sidebar_position: 3
description: 'Deploying ClickStack with Docker Compose - The ClickHouse Observability Stack'
doc_type: 'guide'
keywords: ['ClickStack Docker Compose', 'Docker Compose ClickHouse', 'HyperDX Docker deployment', 'ClickStack deployment guide', 'OpenTelemetry Docker Compose']
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'
import JsonSupport from '/snippets/_json_support.mdx';

All ClickStack components are distributed separately as individual Docker images:

* **ClickHouse**
* **HyperDX**
* **OpenTelemetry (OTel) collector**
* **MongoDB**

These images can be combined and deployed locally using Docker Compose.

Docker Compose exposes additional ports for observability and ingestion based on the default `otel-collector` setup:

- `13133`: Health check endpoint for the `health_check` extension
- `24225`: Fluentd receiver for log ingestion
- `4317`: OTLP gRPC receiver (standard for traces, logs, and metrics)
- `4318`: OTLP HTTP receiver (alternative to gRPC)
- `8888`: Prometheus metrics endpoint for monitoring the collector itself

These ports enable integrations with a variety of telemetry sources and make the OpenTelemetry collector production-ready for diverse ingestion needs.

### Suitable for 

* Local testing
* Proof of concepts
* Production deployments where fault tolerance is not required and a single server is sufficient to host all ClickHouse data
* When deploying ClickStack but hosting ClickHouse separately e.g. using ClickHouse Cloud.

## Deployment steps 
<br/>

<Steps>

<Step>

### Clone the repo 

To deploy with Docker Compose clone the HyperDX repo, change into the directory and run `docker-compose up`:

```shell
git clone git@github.com:hyperdxio/hyperdx.git
cd hyperdx
# switch to the v2 branch
git checkout v2
docker compose up
```

</Step>

<Step>

### Navigate to the HyperDX UI 

Visit [http://localhost:8080](http://localhost:8080) to access the HyperDX UI.

Create a user, providing a username and password which meets the requirements.

On clicking `Create` data sources will be created for the ClickHouse instance deployed with the Helm chart.

<Note title="Overriding default connection">
You can override the default connection to the integrated ClickHouse instance. For details, see ["Using ClickHouse Cloud"](#using-clickhouse-cloud).
</Note>

<img src="/images/use-cases/observability/hyperdx-login.png" alt="HyperDX UI"/>

For an example of using an alternative ClickHouse instance, see ["Create a ClickHouse Cloud connection"](/use-cases/observability/clickstack/getting-started#create-a-cloud-connection).

</Step>

<Step>

### Complete connection details 

To connect to the deployed ClickHouse instance, simply click **Create** and accept the default settings.

If you prefer to connect to your own **external ClickHouse cluster** e.g. ClickHouse Cloud, you can manually enter your connection credentials.

If prompted to create a source, retain all default values and complete the `Table` field with the value `otel_logs`. All other settings should be auto-detected, allowing you to click `Save New Source`.

<img src="/images/use-cases/observability/hyperdx-logs.png" alt="Create logs source"/>

</Step>

</Steps>

## Modifying compose settings 

Users can modify settings for the stack, such as the version used, through the environment variable file:

```shell
user@example-host hyperdx % cat .env
# Used by docker-compose.yml
# Used by docker-compose.yml
HDX_IMAGE_REPO=docker.hyperdx.io
IMAGE_NAME=ghcr.io/hyperdxio/hyperdx
IMAGE_NAME_DOCKERHUB=hyperdx/hyperdx
LOCAL_IMAGE_NAME=ghcr.io/hyperdxio/hyperdx-local
LOCAL_IMAGE_NAME_DOCKERHUB=hyperdx/hyperdx-local
ALL_IN_ONE_IMAGE_NAME=ghcr.io/hyperdxio/hyperdx-all-in-one
ALL_IN_ONE_IMAGE_NAME_DOCKERHUB=hyperdx/hyperdx-all-in-one
OTEL_COLLECTOR_IMAGE_NAME=ghcr.io/hyperdxio/hyperdx-otel-collector
OTEL_COLLECTOR_IMAGE_NAME_DOCKERHUB=hyperdx/hyperdx-otel-collector
CODE_VERSION=2.0.0-beta.16
IMAGE_VERSION_SUB_TAG=.16
IMAGE_VERSION=2-beta
IMAGE_NIGHTLY_TAG=2-nightly

# Set up domain URLs
HYPERDX_API_PORT=8000 #optional (should not be taken by other services)
HYPERDX_APP_PORT=8080
HYPERDX_APP_URL=http://localhost
HYPERDX_LOG_LEVEL=debug
HYPERDX_OPAMP_PORT=4320

# Otel/Clickhouse config
HYPERDX_OTEL_EXPORTER_CLICKHOUSE_DATABASE=default
```

### Configuring the OpenTelemetry collector 

The OTel collector configuration can be modified if required - see ["Modifying configuration"](/use-cases/observability/clickstack/ingesting-data/otel-collector#modifying-otel-collector-configuration).

## Using ClickHouse Cloud 

This distribution can be used with ClickHouse Cloud. Users should:

- Remove the ClickHouse service from the `docker-compose.yaml` file. This is optional if testing, as the deployed ClickHouse instance will simply be ignored - although waste local resources. If removing the service, ensure any references to the service such as `depends_on` are removed.
- Modify the OTel collector to use a ClickHouse Cloud instance by setting the environment variables `CLICKHOUSE_ENDPOINT`, `CLICKHOUSE_USER` and `CLICKHOUSE_PASSWORD` in the compose file. Specifically, add the environment variables to the OTel collector service:

    ```shell
    otel-collector:
        image: ${OTEL_COLLECTOR_IMAGE_NAME}:${IMAGE_VERSION}
        environment:
          CLICKHOUSE_ENDPOINT: '<CLICKHOUSE_ENDPOINT>' # https endpoint here
          CLICKHOUSE_USER: '<CLICKHOUSE_USER>'
          CLICKHOUSE_PASSWORD: '<CLICKHOUSE_PASSWORD>'
          HYPERDX_OTEL_EXPORTER_CLICKHOUSE_DATABASE: ${HYPERDX_OTEL_EXPORTER_CLICKHOUSE_DATABASE}
          HYPERDX_LOG_LEVEL: ${HYPERDX_LOG_LEVEL}
          OPAMP_SERVER_URL: 'http://app:${HYPERDX_OPAMP_PORT}'
        ports:
          - '13133:13133' # health_check extension
          - '24225:24225' # fluentd receiver
          - '4317:4317' # OTLP gRPC receiver
          - '4318:4318' # OTLP http receiver
          - '8888:8888' # metrics extension
        restart: always
        networks:
          - internal
    ```

    The `CLICKHOUSE_ENDPOINT` should be the ClickHouse Cloud HTTPS endpoint, including the port `8443` e.g. `https://mxl4k3ul6a.us-east-2.aws.clickhouse.com:8443`

- On connecting to the HyperDX UI and creating a connection to ClickHouse, use your Cloud credentials.

<JsonSupport />

To set these, modify the relevant services in the `docker-compose.yaml`:

```yaml
  app:
    image: ${HDX_IMAGE_REPO}/${IMAGE_NAME_DOCKERHUB}:${IMAGE_VERSION}
    ports:
      - ${HYPERDX_API_PORT}:${HYPERDX_API_PORT}
      - ${HYPERDX_APP_PORT}:${HYPERDX_APP_PORT}
    environment:
      BETA_CH_OTEL_JSON_SCHEMA_ENABLED: true # enable JSON
      FRONTEND_URL: ${HYPERDX_APP_URL}:${HYPERDX_APP_PORT}
      HYPERDX_API_KEY: ${HYPERDX_API_KEY}
      HYPERDX_API_PORT: ${HYPERDX_API_PORT}
    # truncated for brevity

  otel-collector:
    image: ${HDX_IMAGE_REPO}/${OTEL_COLLECTOR_IMAGE_NAME_DOCKERHUB}:${IMAGE_VERSION}
    environment:
      OTEL_AGENT_FEATURE_GATE_ARG: '--feature-gates=clickhouse.json' # enable JSON
      CLICKHOUSE_ENDPOINT: 'tcp://ch-server:9000?dial_timeout=10s' 
      # truncated for brevity
```
