---
slug: /use-cases/observability/clickstack/getting-started/local-data
title: 'Local Logs & Metrics'
sidebar_position: 1
pagination_prev: null
pagination_next: null
description: 'Getting started with ClickStack local and system data and metrics'
doc_type: 'guide'
keywords: ['clickstack', 'example data', 'sample dataset', 'logs', 'observability']
---

This getting started guide allows you collect local logs and metrics from your system, sending them to ClickStack for visualization and analysis.

**This example works on OSX and Linux systems only**

The following example assumes you have started ClickStack using the [instructions for the all-in-one image](/use-cases/observability/clickstack/getting-started) and connected to the [local ClickHouse instance](/use-cases/observability/clickstack/getting-started#complete-connection-credentials) or a [ClickHouse Cloud instance](/use-cases/observability/clickstack/getting-started#create-a-cloud-connection).

<Note title="HyperDX in ClickHouse Cloud">
This sample dataset can also be used with HyperDX in ClickHouse Cloud, with only minor adjustments to the flow as noted. If using HyperDX in ClickHouse Cloud, users will require an Open Telemetry collector to be running locally as described in the [getting started guide for this deployment model](/use-cases/observability/clickstack/deployment/hyperdx-clickhouse-cloud).
</Note>

<Steps>

## Navigate to the HyperDX UI 

Visit [http://localhost:8080](http://localhost:8080) to access the HyperDX UI if deploying locally. If using HyperDX in ClickHouse Cloud, select your service and `HyperDX` from the left menu.

## Copy ingestion API key 

<Note title="HyperDX in ClickHouse Cloud">
This step is not required if using HyperDX in ClickHouse Cloud.
</Note>

Navigate to [`Team Settings`](http://localhost:8080/team) and copy the `Ingestion API Key` from the `API Keys` section. This API key ensures data ingestion through the OpenTelemetry collector is secure.

<img src="/images/use-cases/observability/copy_api_key.png" alt="Copy API key"/>

## Create a local OpenTelemetry configuration 

Create a `otel-local-file-collector.yaml` file with the following content.

**Important**: Populate the value `<YOUR_INGESTION_API_KEY>` with your ingestion API key copied above (not required for HyperDX in ClickHouse Cloud).

```yaml
receivers:
  filelog:
    include:
      - /var/log/**/*.log             # Linux
      - /var/log/syslog
      - /var/log/messages
      - /private/var/log/*.log       # macOS
      - /tmp/all_events.log # macos - see below
    start_at: beginning # modify to collect new files only

  hostmetrics:
    collection_interval: 1s
    scrapers:
      cpu:
        metrics:
          system.cpu.time:
            enabled: true
          system.cpu.utilization:
            enabled: true
      memory:
        metrics:
          system.memory.usage:
            enabled: true
          system.memory.utilization:
            enabled: true
      filesystem:
        metrics:
          system.filesystem.usage:
            enabled: true
          system.filesystem.utilization:
            enabled: true
      paging:
        metrics:
          system.paging.usage:
            enabled: true
          system.paging.utilization:
            enabled: true
          system.paging.faults:
            enabled: true
      disk:
      load:
      network:
      processes:

exporters:
  otlp:
    endpoint: localhost:4317
    headers:
      authorization: <YOUR_INGESTION_API_KEY>
    tls:
      insecure: true
    sending_queue:
      enabled: true
      num_consumers: 10
      queue_size: 262144  # 262,144 items × ~8 KB per item ≈ 2 GB

service:
  pipelines:
    logs:
      receivers: [filelog]
      exporters: [otlp]
    metrics:
      receivers: [hostmetrics]
      exporters: [otlp]
```

This configuration collects system logs and metric for OSX and Linux systems, sending the results to ClickStack via the OTLP endpoint on port 4317.

<Note title="Ingestion timestamps">
This configuration adjusts timestamps at ingest, assigning an updated time value to each event. Users should ideally [preprocess or parse timestamps](/use-cases/observability/clickstack/ingesting-data/otel-collector#processing-filtering-transforming-enriching) using OTel processors or operators in their log files to ensure accurate event time is retained.

With this example setup, if the receiver or file processor is configured to start at the beginning of the file, all existing log entries will be assigned the same adjusted timestamp - the time of processing rather than the original event time. Any new events appended to the file will receive timestamps approximating their actual generation time.

To avoid this behavior, you can set the start position to `end` in the receiver configuration. This ensures only new entries are ingested and timestamped near their true arrival time.
</Note>

For more details on the OpenTelemetry (OTel) configuration structure, we recommend [the official guide](https://opentelemetry.io/docs/collector/configuration/).

<Note title="Detailed logs for OSX">
Users wanting more detailed logs on OSX can run the command `log stream --debug --style ndjson >> /tmp/all_events.log` before starting the collector below. This will capture detailed operating system logs to the file `/tmp/all_events.log`, already included in the above configuration.
</Note>

## Start the collector 

Run the following docker command to start an instance of the OTel collector.

```shell
docker run --network=host --rm -it \
  --user 0:0 \
  -v "$(pwd)/otel-local-file-collector.yaml":/etc/otel/config.yaml \
  -v /var/log:/var/log:ro \
  -v /private/var/log:/private/var/log:ro \
  otel/opentelemetry-collector-contrib:latest \
  --config /etc/otel/config.yaml
```

<Note title="Root user">
We run the collector as the root user to access all system logs—this is necessary to capture logs from protected paths on Linux-based systems. However, this approach is not recommended for production. In production environments, the OpenTelemetry Collector should be deployed as a local agent with only the minimal permissions required to access the intended log sources.
</Note>

The collector will immediately begin collecting local system logs and metrics.

## Explore system logs 

Navigate to the HyperDX UI. The search UI should be populated with local system logs. Expand the filters to select the `system.log`:

<img src="/images/use-cases/observability/hyperdx-20.png" alt="HyperDX Local logs"/>

## Explore system metrics 

We can explore our metrics using charts.

Navigate to the Chart Explorer via the left menu. Select the source `Metrics` and `Maximum` as the aggregation type. 

For the `Select a Metric` menu simply type `memory` before selecting `system.memory.utilization (Gauge)`.

Press the run button to visualize your memory utilization over time.

<img src="/images/use-cases/observability/hyperdx-21.png" alt="Memory over time"/>

Note the number is returned as a floating point `%`. To render it more clearly, select `Set number format`. 

<img src="/images/use-cases/observability/hyperdx-22.png" alt="Number format"/>

From the subsequent menu you can select `Percentage` from the `Output format` drop down before clicking `Apply`.

<img src="/images/use-cases/observability/hyperdx-23.png" alt="Memory % of time"/>

</Steps>
