---
slug: /use-cases/observability/clickstack/ingesting-data/otel-collector
pagination_prev: null
pagination_next: null
description: 'OpenTelemetry collector for ClickStack - The ClickHouse Observability Stack'
sidebarTitle: 'OpenTelemetry collector'
title: 'ClickStack OpenTelemetry Collector'
doc_type: 'guide'
keywords: ['ClickStack', 'OpenTelemetry collector', 'ClickHouse observability', 'OTel collector configuration', 'OpenTelemetry ClickHouse']
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'

This page includes details on configuring the official ClickStack OpenTelemetry (OTel) collector.

## Collector roles 

OpenTelemetry collectors can be deployed in two principal roles:

- **Agent** - Agent instances collect data at the edge e.g. on servers or on Kubernetes nodes, or receive events directly from applications - instrumented with an OpenTelemetry SDK. In the latter case, the agent instance runs with the application or on the same host as the application (such as a sidecar or a DaemonSet). Agents can either send their data directly to ClickHouse or to a gateway instance. In the former case, this is referred to as [Agent deployment pattern](https://opentelemetry.io/docs/collector/deployment/agent/). 

- **Gateway** - Gateway instances provide a standalone service (for example, a deployment in Kubernetes), typically per cluster, per data center, or per region. These receive events from applications (or other collectors as agents) via a single OTLP endpoint. Typically, a set of gateway instances are deployed, with an out-of-the-box load balancer used to distribute the load amongst them. If all agents and applications send their signals to this single endpoint, it is often referred to as a [Gateway deployment pattern](https://opentelemetry.io/docs/collector/deployment/gateway/). 

**Important: The collector, including in default distributions of ClickStack, assumes the [gateway role described below](#collector-roles), receiving data from agents or SDKs.**

Users deploying OTel collectors in the agent role will typically use the [default contrib distribution of the collector](https://github.com/open-telemetry/opentelemetry-collector-contrib) and not the ClickStack version but are free to use other OTLP compatible technologies such as [Fluentd](https://www.fluentd.org/) and [Vector](https://vector.dev/).

## Deploying the collector 

If you are managing your own OpenTelemetry collector in a standalone deployment - such as when using the HyperDX-only distribution - we [recommend still using the official ClickStack distribution of the collector](/use-cases/observability/clickstack/deployment/hyperdx-only#otel-collector) for the gateway role where possible, but if you choose to bring your own, ensure it includes the [ClickHouse exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/clickhouseexporter).

### Standalone 

To deploy the ClickStack distribution of the OTel connector in a standalone mode, run the following docker command:

```shell
docker run -e OPAMP_SERVER_URL=${OPAMP_SERVER_URL} -e CLICKHOUSE_ENDPOINT=${CLICKHOUSE_ENDPOINT} -e CLICKHOUSE_USER=default -e CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD} -p 8080:8080 -p 4317:4317 -p 4318:4318 docker.hyperdx.io/hyperdx/hyperdx-otel-collector
```

Note that we can overwrite the target ClickHouse instance with environment variables for `CLICKHOUSE_ENDPOINT`, `CLICKHOUSE_USERNAME`, and `CLICKHOUSE_PASSWORD`. The `CLICKHOUSE_ENDPOINT` should be the full ClickHouse HTTP endpoint, including the protocol and port—for example, `http://localhost:8123`.

**These environment variables can be used with any of the docker distributions which include the connector.** 

The `OPAMP_SERVER_URL` should point to your HyperDX deployment - for example, `http://localhost:4320`. HyperDX exposes an OpAMP (Open Agent Management Protocol) server at `/v1/opamp` on port `4320` by default. Make sure to expose this port from the container running HyperDX (e.g., using `-p 4320:4320`).

<Note title="Exposing and connecting to the OpAMP port">
For the collector to connect to the OpAMP port it must be exposed by the HyperDX container e.g. `-p 4320:4320`. For local testing, OSX users can then set `OPAMP_SERVER_URL=http://host.docker.internal:4320`. Linux users can start the collector container with `--network=host`.
</Note>

Users should use a user with the [appropriate credentials](/use-cases/observability/clickstack/ingesting-data/otel-collector#creating-an-ingestion-user) in production.

### Modifying configuration 

#### Using docker 

All docker images, which include the OpenTelemetry collector, can be configured to use a clickhouse instance via the environment variables `OPAMP_SERVER_URL`,`CLICKHOUSE_ENDPOINT`, `CLICKHOUSE_USERNAME` and `CLICKHOUSE_PASSWORD`:

For example the all-in-one image:

```shell
export OPAMP_SERVER_URL=<OPAMP_SERVER_URL>
export CLICKHOUSE_ENDPOINT=<HTTPS ENDPOINT>
export CLICKHOUSE_USER=<CLICKHOUSE_USER>
export CLICKHOUSE_PASSWORD=<CLICKHOUSE_PASSWORD>
```

```shell
docker run -e OPAMP_SERVER_URL=${OPAMP_SERVER_URL} -e CLICKHOUSE_ENDPOINT=${CLICKHOUSE_ENDPOINT} -e CLICKHOUSE_USER=default -e CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD} -p 8080:8080 -p 4317:4317 -p 4318:4318 docker.hyperdx.io/hyperdx/hyperdx-all-in-one
```

#### Docker Compose 

With Docker Compose, modify the collector configuration using the same environment variables as above:

```yaml
  otel-collector:
    image: hyperdx/hyperdx-otel-collector
    environment:
      CLICKHOUSE_ENDPOINT: 'https://mxl4k3ul6a.us-east-2.aws.clickhouse-staging.com:8443'
      HYPERDX_LOG_LEVEL: ${HYPERDX_LOG_LEVEL}
      CLICKHOUSE_USER: 'default'
      CLICKHOUSE_PASSWORD: 'password'
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

### Advanced configuration 

Currently, the ClickStack distribution of the OTel collector does not support modification of its configuration file. If you need a more complex configuration e.g. [configuring TLS](#securing-the-collector), or modifying the batch size, we recommend copying and modifying the [default configuration](https://github.com/hyperdxio/hyperdx/blob/main/docker/otel-collector/config.yaml) and deploying your own version of the OTel collector using the ClickHouse exporter documented [here](/observability/integrating-opentelemetry#exporting-to-clickhouse) and [here](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/clickhouseexporter/README.md#configuration-options).

The default ClickStack configuration for the OpenTelemetry (OTel) collector can be found [here](https://github.com/hyperdxio/hyperdx/blob/main/docker/otel-collector/config.yaml).

#### Configuration structure 

For details on configuring OTel collectors, including [`receivers`](https://opentelemetry.io/docs/collector/transforming-telemetry/), [`operators`](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/stanza/docs/operators/README.md), and [`processors`](https://opentelemetry.io/docs/collector/configuration/#processors), we recommend the [official OpenTelemetry collector documentation](https://opentelemetry.io/docs/collector/configuration).

## Securing the collector 

The ClickStack distribution of the OpenTelemetry collector includes built-in support for OpAMP (Open Agent Management Protocol), which it uses to securely configure and manage the OTLP endpoint. On startup, users must provide an `OPAMP_SERVER_URL` environment variable — this should point to the HyperDX app, which hosts the OpAMP API at `/v1/opamp`.

This integration ensures that the OTLP endpoint is secured using an auto-generated ingestion API key, created when the HyperDX app is deployed. All telemetry data sent to the collector must include this API key for authentication. You can find the key in the HyperDX app under `Team Settings → API Keys`.

<img src="/images/use-cases/observability/ingestion-keys.png" alt="Ingestion keys"/>

To further secure your deployment, we recommend:

- Configuring the collector to communicate with ClickHouse over HTTPS.
- Create a dedicated user for ingestion with limited permissions - see below.
- Enabling TLS for the OTLP endpoint, ensuring encrypted communication between SDKs/agents and the collector. **Currently, this requires users to deploy a default distribution of the collector and manage the configuration themselves**. 

### Creating an ingestion user 

We recommend creating a dedicated database and user for the OTel collector for ingestion into ClickHouse. This should have the ability to create and insert into the [tables created and used by ClickStack](/use-cases/observability/clickstack/ingesting-data/schemas). 

```sql
CREATE DATABASE otel;
CREATE USER hyperdx_ingest IDENTIFIED WITH sha256_password BY 'ClickH0u3eRocks123!';
GRANT SELECT, INSERT, CREATE TABLE, CREATE VIEW ON otel.* TO hyperdx_ingest;
```

This assumes the collector has been configured to use the database `otel`. This can be controlled through the environment variable `HYPERDX_OTEL_EXPORTER_CLICKHOUSE_DATABASE`. Pass this to the image hosting the collector [similar to other environment variables](#modifying-otel-collector-configuration).

## Processing - filtering, transforming, and enriching 

Users will invariably want to filter, transform, and enrich event messages during ingestion. Since the configuration for the ClickStack connector cannot be modified, we recommend users who need further event filtering and processing either:

- Deploy their own version of the OTel collector performing filtering and processing, sending events to the ClickStack collector via OTLP for ingestion into ClickHouse.
- Deploy their own version of the OTel collector and send events directly to ClickHouse using the ClickHouse exporter.

If processing is done using the OTel collector, we recommend doing transformations at gateway instances and minimizing any work done at agent instances. This will ensure the resources required by agents at the edge, running on servers, are as minimal as possible. Typically, we see users only performing filtering (to minimize unnecessary network usage), timestamp setting (via operators), and enrichment, which requires context in agents. For example, if gateway instances reside in a different Kubernetes cluster, k8s enrichment will need to occur in the agent.

OpenTelemetry supports the following processing and filtering features users can exploit:

- **Processors** - Processors take the data collected by [receivers and modify or transform](https://opentelemetry.io/docs/collector/transforming-telemetry/) it before sending it to the exporters. Processors are applied in the order as configured in the `processors` section of the collector configuration. These are optional, but the minimal set is [typically recommended](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor#recommended-processors). When using an OTel collector with ClickHouse, we recommend limiting processors to:

- A [memory_limiter](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md) is used to prevent out of memory situations on the collector. See [Estimating Resources](#estimating-resources) for recommendations.
- Any processor that does enrichment based on context. For example, the [Kubernetes Attributes Processor](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/k8sattributesprocessor) allows the automatic setting of spans, metrics, and logs resource attributes with k8s metadata e.g. enriching events with their source pod id.
- [Tail or head sampling](https://opentelemetry.io/docs/concepts/sampling/) if required for traces.
- [Basic filtering](https://opentelemetry.io/docs/collector/transforming-telemetry/) - Dropping events that are not required if this cannot be done via operator (see below).
- [Batching](https://github.com/open-telemetry/opentelemetry-collector/tree/main/processor/batchprocessor) - essential when working with ClickHouse to ensure data is sent in batches. See ["Optimizing inserts"](#optimizing-inserts).

- **Operators** - [Operators](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/pkg/stanza/docs/operators/README.md) provide the most basic unit of processing available at the receiver. Basic parsing is supported, allowing fields such as the Severity and Timestamp to be set. JSON and regex parsing are supported here along with event filtering and basic transformations. We recommend performing event filtering here.

We recommend users avoid doing excessive event processing using operators or [transform processors](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/processor/transformprocessor/README.md). These can incur considerable memory and CPU overhead, especially JSON parsing.  It is possible to do all processing in ClickHouse at insert time with materialized views and columns with some exceptions - specifically, context-aware enrichment e.g. adding of k8s metadata. For more details, see [Extracting structure with SQL](/use-cases/observability/schema-design#extracting-structure-with-sql).

### Example 

The following configuration shows collection of this [unstructured log file](https://datasets-documentation.s3.eu-west-3.amazonaws.com/http_logs/access-unstructured.log.gz). This configuration could be used by a collector in the agent role sending data to the ClickStack gateway.

Note the use of operators to extract structure from the log lines (`regex_parser`) and filter events, along with a processor to batch events and limit memory usage.

```yaml file=code_snippets/ClickStack/config-unstructured-logs-with-processor.yaml
receivers:
  filelog:
    include:
      - /opt/data/logs/access-unstructured.log
    start_at: beginning
    operators:
      - type: regex_parser
        regex: '^(?P<ip>[\d.]+)\s+-\s+-\s+\[(?P<timestamp>[^\]]+)\]\s+"(?P<method>[A-Z]+)\s+(?P<url>[^\s]+)\s+HTTP/[^\s]+"\s+(?P<status>\d+)\s+(?P<size>\d+)\s+"(?P<referrer>[^"]*)"\s+"(?P<user_agent>[^"]*)"'
        timestamp:
          parse_from: attributes.timestamp
          layout: '%d/%b/%Y:%H:%M:%S %z'
          #22/Jan/2019:03:56:14 +0330
processors:
  batch:
    timeout: 1s
    send_batch_size: 100
  memory_limiter:
    check_interval: 1s
    limit_mib: 2048
    spike_limit_mib: 256
exporters:
  # HTTP setup
  otlphttp/hdx:
    endpoint: 'http://localhost:4318'
    headers:
      authorization: <YOUR_INGESTION_API_KEY>
    compression: gzip

  # gRPC setup (alternative)
  otlp/hdx:
    endpoint: 'localhost:4317'
    headers:
      authorization: <YOUR_API_INGESTION_KEY>
    compression: gzip
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

Note the need to include an [authorization header containing your ingestion API key](#securing-the-collector) in any OTLP communication.

For more advanced configuration, we suggest the [OpenTelemetry collector documentation](https://opentelemetry.io/docs/collector/).

## Optimizing inserts 

In order to achieve high insert performance while obtaining strong consistency guarantees, users should adhere to simple rules when inserting Observability data into ClickHouse via the ClickStack collector. With the correct configuration of the OTel collector, the following rules should be straightforward to follow. This also avoids [common issues](https://clickhouse.com/blog/common-getting-started-issues-with-clickhouse) users encounter when using ClickHouse for the first time.

### Batching 

By default, each insert sent to ClickHouse causes ClickHouse to immediately create a part of storage containing the data from the insert together with other metadata that needs to be stored. Therefore sending a smaller amount of inserts that each contain more data, compared to sending a larger amount of inserts that each contain less data, will reduce the number of writes required. We recommend inserting data in fairly large batches of at least 1,000 rows at a time. Further details [here](https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse#data-needs-to-be-batched-for-optimal-performance).

By default, inserts into ClickHouse are synchronous and idempotent if identical. For tables of the merge tree engine family, ClickHouse will, by default, automatically [deduplicate inserts](https://clickhouse.com/blog/common-getting-started-issues-with-clickhouse#5-deduplication-at-insert-time). This means inserts are tolerant in cases like the following:

- (1) If the node receiving the data has issues, the insert query will time out (or get a more specific error) and not receive an acknowledgment.
- (2) If the data got written by the node, but the acknowledgement can't be returned to the sender of the query because of network interruptions, the sender will either get a timeout or a network error.

From the collector's perspective, (1) and (2) can be hard to distinguish. However, in both cases, the unacknowledged insert can just be retried immediately. As long as the retried insert query contains the same data in the same order, ClickHouse will automatically ignore the retried insert if the original (unacknowledged) insert succeeded.

For this reason, the ClickStack distribution of the OTel collector uses the [batch processor](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md). This ensures inserts are sent as consistent batches of rows satisfying the above requirements. If a collector is expected to have high throughput (events per second), and at least 5000 events can be sent in each insert, this is usually the only batching required in the pipeline. In this case the collector will flush batches before the batch processor's `timeout` is reached, ensuring the end-to-end latency of the pipeline remains low and batches are of a consistent size.

### Use asynchronous inserts 

Typically, users are forced to send smaller batches when the throughput of a collector is low, and yet they still expect data to reach ClickHouse within a minimum end-to-end latency. In this case, small batches are sent when the `timeout` of the batch processor expires. This can cause problems and is when asynchronous inserts are required. This issue is rare if users are sending data to the ClickStack collector acting as a Gateway - by acting as aggregators, they alleviate this problem - see [Collector roles](#collector-roles).

If large batches cannot be guaranteed, users can delegate batching to ClickHouse using [Asynchronous Inserts](/best-practices/selecting-an-insert-strategy#asynchronous-inserts). With asynchronous inserts, data is inserted into a buffer first and then written to the database storage later or asynchronously respectively.

<img src="/images/use-cases/observability/observability-6.png" alt="Async inserts"/>

With [asynchronous inserts enabled](/optimize/asynchronous-inserts#enabling-asynchronous-inserts), when ClickHouse ① receives an insert query, the query's data is ② immediately written into an in-memory buffer first. When ③ the next buffer flush takes place, the buffer's data is [sorted](/guides/best-practices/sparse-primary-indexes#data-is-stored-on-disk-ordered-by-primary-key-columns) and written as a part to the database storage. Note, that the data is not searchable by queries before being flushed to the database storage; the buffer flush is [configurable](/optimize/asynchronous-inserts).

To enable asynchronous inserts for the collector, add `async_insert=1` to the connection string. We recommend users use `wait_for_async_insert=1` (the default) to get delivery guarantees - see [here](https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse) for further details.

Data from an async insert is inserted once the ClickHouse buffer is flushed. This occurs either after the [`async_insert_max_data_size`](/operations/settings/settings#async_insert_max_data_size) is exceeded or after [`async_insert_busy_timeout_ms`](/operations/settings/settings#async_insert_max_data_size) milliseconds since the first INSERT query. If the `async_insert_stale_timeout_ms` is set to a non-zero value, the data is inserted after `async_insert_stale_timeout_ms milliseconds` since the last query. Users can tune these settings to control the end-to-end latency of their pipeline. Further settings that can be used to tune buffer flushing are documented [here](/operations/settings/settings#async_insert). Generally, defaults are appropriate.

<Note title="Consider Adaptive Asynchronous Inserts">
In cases where a low number of agents are in use, with low throughput but strict end-to-end latency requirements, [adaptive asynchronous inserts](https://clickhouse.com/blog/clickhouse-release-24-02#adaptive-asynchronous-inserts) may be useful. Generally, these are not applicable to high throughput Observability use cases, as seen with ClickHouse.
</Note>

Finally, the previous deduplication behavior associated with synchronous inserts into ClickHouse is not enabled by default when using asynchronous inserts. If required, see the setting [`async_insert_deduplicate`](/operations/settings/settings#async_insert_deduplicate).

Full details on configuring this feature can be found on this [docs page](/optimize/asynchronous-inserts#enabling-asynchronous-inserts), or with a deep dive [blog post](https://clickhouse.com/blog/asynchronous-data-inserts-in-clickhouse).

## Scaling 

The ClickStack OTel collector acts a Gateway instance - see [Collector roles](#collector-roles). These provide a standalone service, typically per data center or per region. These receive events from applications (or other collectors in the agent role) via a single OTLP endpoint. Typically a set of collector instances are deployed, with an out-of-the-box load balancer used to distribute the load amongst them.

<img src="/images/use-cases/observability/clickstack-with-gateways.png" alt="Scaling with gateways"/>

The objective of this architecture is to offload computationally intensive processing from the agents, thereby minimizing their resource usage. These ClickStack gateways can perform transformation tasks that would otherwise need to be done by agents. Furthermore, by aggregating events from many agents, the gateways can ensure large batches are sent to ClickHouse - allowing efficient insertion. These gateway collectors can easily be scaled as more agents and SDK sources are added and event throughput increases. 

### Adding Kafka 

Readers may notice the above architectures do not use Kafka as a message queue.

Using a Kafka queue as a message buffer is a popular design pattern seen in logging architectures and was popularized by the ELK stack. It provides a few benefits: principally, it helps provide stronger message delivery guarantees and helps deal with backpressure. Messages are sent from collection agents to Kafka and written to disk. In theory, a clustered Kafka instance should provide a high throughput message buffer since it incurs less computational overhead to write data linearly to disk than parse and process a message. In Elastic, for example, tokenization and indexing incurs significant overhead. By moving data away from the agents, you also incur less risk of losing messages as a result of log rotation at the source. Finally, it offers some message reply and cross-region replication capabilities, which might be attractive for some use cases.

However, ClickHouse can handle inserting data very quickly - millions of rows per second on moderate hardware. Backpressure from ClickHouse is rare. Often, leveraging a Kafka queue means more architectural complexity and cost. If you can embrace the principle that logs do not need the same delivery guarantees as bank transactions and other mission-critical data, we recommend avoiding the complexity of Kafka.

However, if you require high delivery guarantees or the ability to replay data (potentially to multiple sources), Kafka can be a useful architectural addition.

<img src="/images/use-cases/observability/observability-8.png" alt="Adding kafka"/>

In this case, OTel agents can be configured to send data to Kafka via the [Kafka exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/kafkaexporter/README.md). Gateway instances, in turn, consume messages using the [Kafka receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/kafkareceiver/README.md). We recommend the Confluent and OTel documentation for further details.

<Note title="OTel collector configuration">
The ClickStack OpenTelemetry collector distribution cannot be used with Kafka as it requires a configuration modification. Users will need to deploy a default OTel collector using the ClickHouse exporter.
</Note>

## Estimating resources 

Resource requirements for the OTel collector will depend on the event throughput, the size of messages and amount of processing performed. The OpenTelemetry project maintains [benchmarks users](https://opentelemetry.io/docs/collector/benchmarks/) can use to estimate resource requirements.

[In our experience](https://clickhouse.com/blog/building-a-logging-platform-with-clickhouse-and-saving-millions-over-datadog#architectural-overview), a ClickStack gateway instance with 3 cores and 12GB of RAM can handle around 60k events per second. This assumes a minimal processing pipeline responsible for renaming fields and no regular expressions.

For agent instances responsible for shipping events to a gateway, and only setting the timestamp on the event, we recommend users size based on the anticipated logs per second. The following represent approximate numbers users can use as a starting point:

| Logging rate | Resources to collector agent |
|--------------|------------------------------|
| 1k/second    | 0.2CPU, 0.2GiB              |
| 5k/second    | 0.5 CPU, 0.5GiB             |
| 10k/second   | 1 CPU, 1GiB                 |

## JSON support 

<BetaBadge/>

ClickStack has beta support for the [JSON type](/interfaces/formats/JSON) from version `2.0.4`.

### Benefits of the JSON type 

The JSON type offers the following benefits to ClickStack users:

- **Type preservation** - Numbers stay numbers, booleans stay booleans—no more flattening everything into strings. This means fewer casts, simpler queries, and more accurate aggregations.
- **Path-level columns** - Each JSON path becomes its own sub-column, reducing I/O. Queries only read the fields they need, unlocking major performance gains over the old Map type which required the entire column to be read in order to query a specific field.
- **Deep nesting just works** - Naturally handle complex, deeply nested structures without manual flattening (as required by the Map type) and subsequent awkward JSONExtract functions.
- **Dynamic, evolving schemas** - Perfect for observability data where teams add new tags and attributes over time. JSON handles these changes automatically, without schema migrations. 
- **Faster queries, lower memory** - Typical aggregations over attributes like `LogAttributes` see 5-10x less data read and dramatic speedups, cutting both query time and peak memory usage.
- **Simple management** - No need to pre-materialize columns for performance. Each field becomes its own sub-column, delivering the same speed as native ClickHouse columns.

### Enabling JSON support 

To enable this support for the collector, set the environment variable `OTEL_AGENT_FEATURE_GATE_ARG='--feature-gates=clickhouse.json'` on any deployment that includes the collector. This ensures the schemas are created in ClickHouse using the JSON type.

<Note title="HyperDX support">
In order to query the JSON type, support must also be enabled in the HyperDX application layer via the environment variable `BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true`.
</Note>

For example:

```shell
docker run -e OTEL_AGENT_FEATURE_GATE_ARG='--feature-gates=clickhouse.json' -e OPAMP_SERVER_URL=${OPAMP_SERVER_URL} -e CLICKHOUSE_ENDPOINT=${CLICKHOUSE_ENDPOINT} -e CLICKHOUSE_USER=default -e CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD} -p 8080:8080 -p 4317:4317 -p 4318:4318 docker.hyperdx.io/hyperdx/hyperdx-otel-collector
```

### Migrating from map-based schemas to the JSON type 

:::important Backwards compatibility
The [JSON type](/interfaces/formats/JSON) type is not backwards compatible with existing map-based schemas. New tables will be created using the `JSON` type.
:::

To migrate from the Map-based schemas, follow these steps:

<Steps>

<Step>

#### Stop the OTel collector

</Step>

<Step>

#### Rename existing tables and update sources

Rename existing tables and update data sources in HyperDX.

For example:

```sql
RENAME TABLE otel_logs TO otel_logs_map;
RENAME TABLE otel_metrics TO otel_metrics_map;
```

</Step>

<Step>

#### Deploy the collector

Deploy the collector with `OTEL_AGENT_FEATURE_GATE_ARG` set.

</Step>

<Step>

#### Restart the HyperDX container with JSON schema support

```shell
export BETA_CH_OTEL_JSON_SCHEMA_ENABLED=true
```

</Step>

<Step>

#### Create new data sources

Create new data sources in HyperDX pointing to the JSON tables.

</Step>

</Steps>

#### Migrating existing data (optional) 

To move old data into the new JSON tables:

```sql
INSERT INTO otel_logs SELECT * FROM otel_logs_map;
INSERT INTO otel_metrics SELECT * FROM otel_metrics_map;
```

<Warning>
Recommended only for datasets smaller than ~10 billion rows. Data previously stored with the Map type did not preserve type precision (all values were strings). As a result, this old data will appear as strings in the new schema until it ages out, requiring some casting on the frontend. Type for new data will be preserved with the JSON type.
</Warning>
