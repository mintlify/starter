---
slug: /use-cases/observability/clickstack/config
title: 'Configuration Options'
pagination_prev: null
pagination_next: null
description: 'Configuration options for ClickStack - The ClickHouse Observability Stack'
keywords: ['ClickStack configuration', 'observability configuration', 'HyperDX settings', 'collector configuration', 'environment variables']
doc_type: 'reference'
---

The following configuration options are available for each component of ClickStack:

## Modifying settings 

### Docker 

If using the [All in One](/use-cases/observability/clickstack/deployment/all-in-one), [HyperDX Only](/use-cases/observability/clickstack/deployment/hyperdx-only) or [Local Mode](/use-cases/observability/clickstack/deployment/local-mode-only) simply pass the desired setting via an environment variable e.g.

```shell
docker run  -e HYPERDX_LOG_LEVEL='debug' -p 8080:8080 -p 4317:4317 -p 4318:4318 docker.hyperdx.io/hyperdx/hyperdx-all-in-one
```

### Docker Compose 

If using the [Docker Compose](/use-cases/observability/clickstack/deployment/docker-compose) deployment guide, the [`.env`](https://github.com/hyperdxio/hyperdx/blob/main/.env) file can be used to modify settings.

Alternatively, explicitly overwrite settings in the [`docker-compose.yaml`](https://github.com/hyperdxio/hyperdx/blob/main/docker-compose.yml) file e.g.

Example:
```yaml
services:
  app:
    environment:
      HYPERDX_API_KEY: ${HYPERDX_API_KEY}
      HYPERDX_LOG_LEVEL: ${HYPERDX_LOG_LEVEL}
      # ... other settings
```

### Helm 

#### Customizing values (optional) 

You can customize settings by using `--set` flags e.g.

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2 \
  --set replicaCount=2 \
  --set resources.limits.cpu=500m \
  --set resources.limits.memory=512Mi \
  --set resources.requests.cpu=250m \
  --set resources.requests.memory=256Mi \
  --set ingress.enabled=true \
  --set ingress.annotations."kubernetes\.io/ingress\.class"=nginx \
  --set ingress.hosts[0].host=hyperdx.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=ImplementationSpecific \
  --set env[0].name=CLICKHOUSE_USER \
  --set env[0].value=abc
```

Alternatively edit the `values.yaml`. To retrieve the default values:

```shell
helm show values hyperdx/hdx-oss-v2 > values.yaml
```

Example config:

```yaml
replicaCount: 2
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
  hosts:
    - host: hyperdx.example.com
      paths:
        - path: /
          pathType: ImplementationSpecific
  env:
    - name: CLICKHOUSE_USER
      value: abc
```

## HyperDX 

### Data source settings 

HyperDX relies on the user defining a source for each of the Observability data types/pillars:

- `Logs`
- `Traces`
- `Metrics`
- `Sessions`

This configuration can be performed inside the application from `Team Settings -> Sources`, as shown below for logs:

<img src="/images/use-cases/observability/hyperdx-25.png" alt="HyperDX Source configuration"/>

Each of these sources require at least one table specified on creation as well as a set of columns which allow HyperDX to query the data.

If using the [default OpenTelemetry (OTel) schema](/observability/integrating-opentelemetry#out-of-the-box-schema) distributed with ClickStack, these columns can be automatically inferred for each of the sources. If [modifying the schema](#clickhouse) or using a custom schema, users are required to specify and update these mappings.

<Note>
The default schema for ClickHouse distributed with ClickStack is the schema created by the [ClickHouse exporter for the OTel collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/clickhouseexporter). These column names correlate with the OTel official specification documented [here](https://opentelemetry.io/docs/specs/otel/logs/data-model/).
</Note>

The following settings are available for each source:

#### Logs 

| Setting                        | Description                                                                                                             | Required | Inferred in Default Schema | Inferred Value                                      |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------|----------|-----------------------------|-----------------------------------------------------|
| `Name`                        | Source name.                                                                                                            | Yes      | No                          | –                                                   |
| `Server Connection`           | Server connection name.                                                                                                | Yes      | No                          | `Default`                                             |
| `Database`                    | ClickHouse database name.                                                                                              | Yes      | Yes                         | `default`                                             |
| `Table`                       | Target table name. Set to `otel_logs` if default schema is used.                                                                                                     | Yes      | No                         |                                            |
| `Timestamp Column`            | Datetime column or expression that is part of your primary key.                                                        | Yes       | Yes                         | `TimestampTime`                                       |
| `Default Select`              | Columns shown in default search results.                                                                               | Yes       | Yes                         | `Timestamp`, `ServiceName`, `SeverityText`, `Body`         |
| `Service Name Expression`     | Expression or column for the service name.                                                                             | Yes       | Yes                         | `ServiceName`                                         |
| `Log Level Expression`        | Expression or column for the log level.                                                                                | Yes       | Yes                         | `SeverityText`                                        |
| `Body Expression`             | Expression or column for the log message.                                                                              | Yes       | Yes                         | `Body`                                                |
| `Log Attributes Expression`   | Expression or column for custom log attributes.                                                                        | Yes       | Yes                         | `LogAttributes`                                       |
| `Resource Attributes Expression` | Expression or column for resource-level attributes.                                                                  | Yes       | Yes                         | `ResourceAttributes`                                  |
| `Displayed Timestamp Column`  | Timestamp column used in UI display.                                                                                   | Yes       | Yes                         | `ResourceAttributes`                                  |
| `Correlated Metric Source`    | Linked metric source (e.g. HyperDX metrics).                                                                           | No       | No                          | –                                                   |
| `Correlated Trace Source`     | Linked trace source (e.g. HyperDX traces).                                                                             | No       | No                          | –                                                   |
| `Trace Id Expression`         | Expression or column used to extract trace ID.                                                                         | Yes       | Yes                         | `TraceId`                                             |
| `Span Id Expression`          | Expression or column used to extract span ID.                                                                          | Yes       | Yes                         | `SpanId`                                              |
| `Implicit Column Expression`  | Column used for full-text search if no field is specified (Lucene-style). Typically the log body.                      | Yes       | Yes                         | `Body`                                                |

#### Traces 

| Setting                          | Description                                                                                                             | Required | Inferred in Default Schema | Inferred Value         |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------|----------|-----------------------------|------------------------|
| `Name`                           | Source name.                                                                                                            | Yes      | No                          | –                      |
| `Server Connection`              | Server connection name.                                                                                                | Yes      | No                          | `Default`              |
| `Database`                       | ClickHouse database name.                                                                                              | Yes      | Yes                         | `default`                |
| `Table`                          | Target table name. Set to `otel_traces` if using the default schema.                                                                                                    | Yes      | Yes                         |      -       |
| `Timestamp Column`              | Datetime column or expression that is part of your primary key.                                                        | Yes      | Yes                         | `Timestamp`              |
| `Timestamp`                      | Alias for `Timestamp Column`.                                                                                          | Yes      | Yes                         | `Timestamp`              |
| `Default Select`                | Columns shown in default search results.                                                                               | Yes      | Yes                         | `Timestamp, ServiceName as service, StatusCode as level, round(Duration / 1e6) as duration, SpanName` |
| `Duration Expression`           | Expression for calculating span duration.                                                                              | Yes      | Yes                         | `Duration`               |
| `Duration Precision`            | Precision for the duration expression (e.g. nanoseconds, microseconds).                                                | Yes      | Yes                         | ns                     |
| `Trace Id Expression`           | Expression or column for trace IDs.                                                                                    | Yes      | Yes                         | `TraceId`                |
| `Span Id Expression`            | Expression or column for span IDs.                                                                                     | Yes      | Yes                         | `SpanId`                 |
| `Parent Span Id Expression`     | Expression or column for parent span IDs.                                                                              | Yes      | Yes                         | `ParentSpanId`           |
| `Span Name Expression`          | Expression or column for span names.                                                                                   | Yes      | Yes                         | `SpanName`               |
| `Span Kind Expression`          | Expression or column for span kind (e.g. client, server).                                                              | Yes      | Yes                         | `SpanKind`               |
| `Correlated Log Source`         | Optional. Linked log source (e.g. HyperDX logs).                                                                       | No       | No                          | –                      |
| `Correlated Session Source`     | Optional. Linked session source.                                                                                       | No       | No                          | –                      |
| `Correlated Metric Source`      | Optional. Linked metric source (e.g. HyperDX metrics).                                                                  | No       | No                          | –                      |
| `Status Code Expression`        | Expression for the span status code.                                                                                   | Yes      | Yes                         | `StatusCode`             |
| `Status Message Expression`     | Expression for the span status message.                                                                                | Yes      | Yes                         | `StatusMessage`          |
| `Service Name Expression`       | Expression or column for the service name.                                                                             | Yes      | Yes                         | `ServiceName`            |
| `Resource Attributes Expression`| Expression or column for resource-level attributes.                                                                    | Yes      | Yes                         | `ResourceAttributes`     |
| `Event Attributes Expression`   | Expression or column for event attributes.                                                                             | Yes      | Yes                         | `SpanAttributes`         |
| `Span Events Expression`        | Expression to extract span events. Typically a `Nested` type column. This allows rendering of exception stack traces with supported language SDKs.                                                   | Yes      | Yes                         | `Events`                 |
| `Implicit Column Expression`   | Column used for full-text search if no field is specified (Lucene-style). Typically the log body.  | Yes  | Yes  | `SpanName`|

#### Metrics 

| Setting               | Description                                                                                   | Required | Inferred in Default Schema | Inferred Value              |
|------------------------|-----------------------------------------------------------------------------------------------|----------|-----------------------------|-----------------------------|
| `Name`                 | Source name.                                                                                  | Yes      | No                          | –                           |
| `Server Connection`    | Server connection name.                                                                        | Yes      | No                          | `Default`                   |
| `Database`             | ClickHouse database name.                                                                      | Yes      | Yes                         | `default`                   |
| `Gauge Table`          | Table storing gauge-type metrics.                                                              | Yes      | No                         | `otel_metrics_gauge`        |
| `Histogram Table`      | Table storing histogram-type metrics.                                                          | Yes      | No                         | `otel_metrics_histogram`    |
| `Sum Table`            | Table storing sum-type (counter) metrics.                                                      | Yes      | No                         | `otel_metrics_sum`          |
| `Correlated Log Source`| Optional. Linked log source (e.g. HyperDX logs).                                               | No       | No                          | –                           |

#### Sessions 

| Setting                        | Description                                                                                         | Required | Inferred in Default Schema | Inferred Value         |
|-------------------------------|-----------------------------------------------------------------------------------------------------|----------|-----------------------------|------------------------|
| `Name`                        | Source name.                                                                                        | Yes      | No                          | –                      |
| `Server Connection`           | Server connection name.                                                                             | Yes      | No                          | `Default`              |
| `Database`                    | ClickHouse database name.                                                                           | Yes      | Yes                         | `default`              |
| `Table`                       | Target table for session data. Target table name. Set to `hyperdx_sessions` if using the default schema.                                                                          | Yes      | Yes                         | -      |
| `Timestamp Column`           | Datetime column or expression that is part of your primary key.                                    | Yes      | Yes                         | `TimestampTime`            |
| `Log Attributes Expression`   | Expression for extracting log-level attributes from session data.                                  | Yes      | Yes                         | `LogAttributes`        |
| `LogAttributes`               | Alias or field reference used to store log attributes.                                              | Yes      | Yes                         | `LogAttributes`        |
| `Resource Attributes Expression` | Expression for extracting resource-level metadata.                                               | Yes      | Yes                         | `ResourceAttributes`   |
| `Correlated Trace Source`     | Optional. Linked trace source for session correlation.                                              | No       | No                          | –                      |
| `Implicit Column Expression`  | Column used for full-text search when no field is specified (e.g. Lucene-style query parsing).      | Yes      | Yes                         | `Body` |

### Correlated sources 

To enable full cross-source correlation in ClickStack, users must configure correlated sources for logs, traces, metrics, and sessions. This allows HyperDX to associate related data and provide rich context when rendering events.

- `Logs`: Can be correlated with traces and metrics.
- `Traces`: Can be correlated with logs, sessions, and metrics.
- `Metrics`: Can be correlated with logs.
- `Sessions`: Can be correlated with traces.

By setting these correlations, HyperDX can, for example, render relevant logs alongside a trace or surface metric anomalies linked to a session. Proper configuration ensures a unified and contextual observability experience.

For example, below is the Logs source configured with correlated sources:

<img src="/images/use-cases/observability/hyperdx-26.png" alt="HyperDX Source correlated"/>

### Application configuration settings 

- `HYPERDX_API_KEY`
  - **Default:** None (required)
  - **Description:** Authentication key for the HyperDX API.
  - **Guidance:** 
  - Required for telemetry and logging
  - In local development, can be any non-empty value
  - For production, use a secure, unique key
  - Can be obtained from the team settings page after account creation

- `HYPERDX_LOG_LEVEL`
  - **Default:** `info`
  - **Description:** Sets the logging verbosity level.
  - **Options:** `debug`, `info`, `warn`, `error`
  - **Guidance:**
  - Use `debug` for detailed troubleshooting
  - Use `info` for normal operation
  - Use `warn` or `error` in production to reduce log volume

- `HYPERDX_API_PORT`
  - **Default:** `8000`
  - **Description:** Port for the HyperDX API server.
  - **Guidance:**
  - Ensure this port is available on your host
  - Change if you have port conflicts
  - Must match the port in your API client configurations

- `HYPERDX_APP_PORT`
  - **Default:** `8000`
  - **Description:** Port for the HyperDX frontend app.
  - **Guidance:**
  - Ensure this port is available on your host
  - Change if you have port conflicts
  - Must be accessible from your browser

- `HYPERDX_APP_URL`
  - **Default:** `http://localhost`
  - **Description:** Base URL for the frontend app.
  - **Guidance:**
  - Set to your domain in production
  - Include protocol (http/https)
  - Don't include trailing slash

- `MONGO_URI`
  - **Default:** `mongodb://db:27017/hyperdx`
  - **Description:** MongoDB connection string.
  - **Guidance:**
  - Use default for local development with Docker
  - For production, use a secure connection string
  - Include authentication if required
  - Example: `mongodb://user:pass@host:port/db`

- `MINER_API_URL`
  - **Default:** `http://miner:5123`
  - **Description:** URL for the log pattern mining service.
  - **Guidance:**
  - Use default for local development with Docker
  - Set to your miner service URL in production
  - Must be accessible from the API service

- `FRONTEND_URL`
  - **Default:** `http://localhost:3000`
  - **Description:** URL for the frontend app.
  - **Guidance:**
  - Use default for local development
  - Set to your domain in production
  - Must be accessible from the API service

- `OTEL_SERVICE_NAME`
  - **Default:** `hdx-oss-api`
  - **Description:** Service name for OpenTelemetry instrumentation.
  - **Guidance:**
  - Use descriptive name for your HyperDX service. Applicable if HyperDX self-instruments.
  - Helps identify the HyperDX service in telemetry data

- `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT`
  - **Default:** `http://localhost:4318`
  - **Description:** OpenTelemetry collector endpoint.
  - **Guidance:**
  - Relevant of self-instrumenting HyperDX.
  - Use default for local development
  - Set to your collector URL in production
  - Must be accessible from your HyperDX service

- `USAGE_STATS_ENABLED`
  - **Default:** `true`
  - **Description:** Toggles usage statistics collection.
  - **Guidance:**
  - Set to `false` to disable usage tracking
  - Useful for privacy-sensitive deployments
  - Default is `true` for better product improvement

- `IS_OSS`
  - **Default:** `true`
  - **Description:** Indicates if running in OSS mode.
  - **Guidance:**
  - Keep as `true` for open-source deployments
  - Set to `false` for enterprise deployments
  - Affects feature availability

- `IS_LOCAL_MODE`
  - **Default:** `false`
  - **Description:** Indicates if running in local mode.
  - **Guidance:**
  - Set to `true` for local development
  - Disables certain production features
  - Useful for testing and development

- `EXPRESS_SESSION_SECRET`
  - **Default:** `hyperdx is cool 👋`
  - **Description:** Secret for Express session management.
  - **Guidance:**
  - Change in production
  - Use a strong, random string
  - Keep secret and secure

- `ENABLE_SWAGGER`
  - **Default:** `false`
  - **Description:** Toggles Swagger API documentation.
  - **Guidance:**
  - Set to `true` to enable API documentation
  - Useful for development and testing
  - Disable in production

- `BETA_CH_OTEL_JSON_SCHEMA_ENABLED`
  - **Default:** `false`
  - **Description:** Enables Beta support for the JSON type in HyperDX. See also [`OTEL_AGENT_FEATURE_GATE_ARG`](#otel-collector) to enable JSON support in the OTel collector.
  - **Guidance:**
  - Set to `true` to enable JSON support in ClickStack.

## OpenTelemetry collector 

See ["ClickStack OpenTelemetry Collector"](/use-cases/observability/clickstack/ingesting-data/otel-collector) for more details.

- `CLICKHOUSE_ENDPOINT`  
  - **Default:** *None (required)* if standalone image. If All-in-one or Docker Compose distribution this is set to the integrated ClickHouse instance.
  - **Description:** The HTTPS URL of the ClickHouse instance to export telemetry data to.  
  - **Guidance:**  
    - Must be a full HTTPS endpoint including port (e.g., `https://clickhouse.example.com:8443`)  
    - Required for the collector to send data to ClickHouse  

- `CLICKHOUSE_USER`  
  - **Default:** `default`  
  - **Description:** Username used to authenticate with the ClickHouse instance.  
  - **Guidance:**  
    - Ensure the user has `INSERT` and `CREATE TABLE` permissions  
    - Recommended to create a dedicated user for ingestion  

- `CLICKHOUSE_PASSWORD`  
  - **Default:** *None (required if authentication is enabled)*  
  - **Description:** Password for the specified ClickHouse user.  
  - **Guidance:**  
    - Required if the user account has a password set  
    - Store securely via secrets in production deployments  

- `HYPERDX_LOG_LEVEL`  
  - **Default:** `info`  
  - **Description:** Log verbosity level for the collector.  
  - **Guidance:**  
    - Accepts values like `debug`, `info`, `warn`, `error`  
    - Use `debug` during troubleshooting  

- `OPAMP_SERVER_URL`  
  - **Default:** *None (required)* if standalone image. If All-in-one or Docker Compose distribution this points to the deployed HyperDX instance.
  - **Description:** URL of the OpAMP server used to manage the collector (e.g., HyperDX instance). This is port `4320` by default.
  - **Guidance:**  
    - Must point to your HyperDX instance  
    - Enables dynamic configuration and secure ingestion  

- `HYPERDX_OTEL_EXPORTER_CLICKHOUSE_DATABASE`  
  - **Default:** `default`  
  - **Description:** ClickHouse database the collector writes telemetry data to.  
  - **Guidance:**  
    - Set if using a custom database name  
    - Ensure the specified user has access to this database  

- `OTEL_AGENT_FEATURE_GATE_ARG`
  - **Default:** `<empty string>`
  - **Description:** Enables feature flags to enabled in the collector. If set to `--feature-gates=clickhouse.json` enables Beta support for the JSON type in collector, ensuring schemas are created with the type. See also [`BETA_CH_OTEL_JSON_SCHEMA_ENABLED`](#hyperdx) to enable JSON support in HyperDX.
  - **Guidance:**
  - Set to `true` to enable JSON support in ClickStack.

## ClickHouse 

ClickStack ships with a default ClickHouse configuration designed for multi-terabyte scale, but users are free to modify and optimize it to suit their workload.

To tune ClickHouse effectively, users should understand key storage concepts such as [parts](/parts), [partitions](/partitions), [shards and replicas](/shards), as well as how [merges](/merges) occur at insert time. We recommend reviewing the fundamentals of [primary indices](/primary-indexes), [sparse secondary indices](/optimize/skipping-indexes), and data skipping indices, along with techniques for [managing data lifecycle](/observability/managing-data) e.g. using a TTL lifecycle.

ClickStack supports [schema customization](/use-cases/observability/schema-design) - users may modify column types, extract new fields (e.g. from logs), apply codecs and dictionaries, and accelerate queries using projections.

Additionally, materialized views can be used to [transform or filter data during ingestion](/use-cases/observability/schema-design#materialized-columns), provided that data is written to the source table of the view and the application reads from the target table.

For more details, refer to ClickHouse documentation on schema design, indexing strategies, and data management best practices - most of which apply directly to ClickStack deployments.
