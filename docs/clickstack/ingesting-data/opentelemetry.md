---
slug: /use-cases/observability/clickstack/ingesting-data/opentelemetry
pagination_prev: null
pagination_next: null
description: 'Data ingestion with OpenTelemetry for ClickStack - The ClickHouse Observability Stack'
title: 'Ingesting with OpenTelemetry'
doc_type: 'guide'
keywords: ['clickstack', 'opentelemetry', 'traces', 'observability', 'telemetry']
---

All data is ingested into ClickStack via an **OpenTelemetry (OTel) collector** instance, which acts as the primary entry point for logs, metrics, traces, and session data. We recommend using the official [ClickStack distribution](#installing-otel-collector) of the collector for this instance.

Users send data to this collector from [language SDKs](/use-cases/observability/clickstack/sdks) or through data collection agents collecting infrastructure metrics and logs (such OTel collectors in an [agent](/use-cases/observability/clickstack/ingesting-data/otel-collector#collector-roles) role or other technologies e.g. [Fluentd](https://www.fluentd.org/) or [Vector](https://vector.dev/)).

## Installing ClickStack OpenTelemetry collector 

The ClickStack OpenTelemetry collector is included in most ClickStack distributions, including:

- [All-in-One](/use-cases/observability/clickstack/deployment/all-in-one)
- [Docker Compose](/use-cases/observability/clickstack/deployment/docker-compose)
- [Helm](/use-cases/observability/clickstack/deployment/helm)

### Standalone 

The ClickStack OTel collector can also be deployed standalone, independent of other components of the stack.

If you're using the [HyperDX-only](/use-cases/observability/clickstack/deployment/hyperdx-only) distribution, you are responsible for delivering data into ClickHouse yourself. This can be done by:

- Running your own OpenTelemetry collector and pointing it at ClickHouse - see below.
- Sending directly to ClickHouse using alternative tooling, such as [Vector](https://vector.dev/), [Fluentd](https://www.fluentd.org/) etc, or even the default [OTel contrib collector distribution](https://github.com/open-telemetry/opentelemetry-collector-contrib).

<Note title="We recommend using the ClickStack OpenTelemetry collector">
This allows users to benefit from standardized ingestion, enforced schemas, and out-of-the-box compatibility with the HyperDX UI. Using the default schema enables automatic source detection and preconfigured column mappings.
</Note>

For further details see ["Deploying the collector"](/use-cases/observability/clickstack/ingesting-data/otel-collector).

## Sending OpenTelemetry data 

To send data to ClickStack, point your OpenTelemetry instrumentation to the following endpoints made available by the OpenTelemetry collector:

- **HTTP (OTLP):** `http://localhost:4318`
- **gRPC (OTLP):** `localhost:4317`

For most [language SDKs](/use-cases/observability/clickstack/sdks) and telemetry libraries that support OpenTelemetry, users can simply set `OTEL_EXPORTER_OTLP_ENDPOINT` environment variable in your application:

```shell
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

In addition, an authorization header containing the API ingestion key is required. You can find the key in the HyperDX app under `Team Settings → API Keys`.

<img src="/images/use-cases/observability/ingestion-keys.png" alt="Ingestion keys"/>

For language SDKs, this can either be set by an `init` function or via an`OTEL_EXPORTER_OTLP_HEADERS` environment variable e.g.:

```shell
OTEL_EXPORTER_OTLP_HEADERS='authorization=<YOUR_INGESTION_API_KEY>'
```

Agents should likewise include this authorization header in any OTLP communication. For example, if deploying a [contrib distribution of the OTel collector](https://github.com/open-telemetry/opentelemetry-collector-contrib) in the agent role, they can use the OTLP exporter. An example agent config consuming this [structured log file](https://datasets-documentation.s3.eu-west-3.amazonaws.com/http_logs/access-structured.log.gz), is shown below. Note the need to specify an authorization key - see `<YOUR_API_INGESTION_KEY>`.

```yaml
# clickhouse-agent-config.yaml
receivers:
  filelog:
    include:
      - /opt/data/logs/access-structured.log
    start_at: beginning
    operators:
      - type: json_parser
        timestamp:
          parse_from: attributes.time_local
          layout: '%Y-%m-%d %H:%M:%S'
exporters:
  # HTTP setup
  otlphttp/hdx:
    endpoint: 'http://localhost:4318'
    headers:
      authorization: <YOUR_API_INGESTION_KEY>
    compression: gzip
 
  # gRPC setup (alternative)
  otlp/hdx:
    endpoint: 'localhost:4317'
    headers:
      authorization: <YOUR_API_INGESTION_KEY>
    compression: gzip
processors:
  batch:
    timeout: 5s
    send_batch_size: 1000
service:
  telemetry:
    metrics:
      address: 0.0.0.0:9888 # Modified as 2 collectors running on same host
  pipelines:
    logs:
      receivers: [filelog]
      processors: [batch]
      exporters: [otlphttp/hdx]
```
