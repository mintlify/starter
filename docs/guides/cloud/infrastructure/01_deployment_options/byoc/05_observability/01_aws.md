---
title: 'BYOC on AWS Observability'
slug: /cloud/reference/byoc/observability
sidebarTitle: 'AWS'
keywords: ['BYOC', 'cloud', 'bring your own cloud', 'AWS']
description: 'Deploy ClickHouse on your own cloud infrastructure'
doc_type: 'reference'
---

import {DeprecatedBadge} from '/snippets/components/DeprecatedBadge/DeprecatedBadge.jsx'

## Observability [#observability]

### Built-in monitoring tools [#built-in-monitoring-tools]
ClickHouse BYOC provides several approaches for various use cases.

#### Observability dashboard [#observability-dashboard]

ClickHouse Cloud includes an advanced observability dashboard that displays metrics such as memory usage, query rates, and I/O. This can be accessed in the **Monitoring** section of ClickHouse Cloud web console interface.

<br />

<img src="/images/cloud/reference/byoc-3.png" alt="Observability dashboard"/>

<br />

#### Advanced dashboard [#advanced-dashboard]

You can customize a dashboard using metrics from system tables like `system.metrics`, `system.events`, and `system.asynchronous_metrics` and more to monitor server performance and resource utilization in detail.

<br />

<img src="/images/cloud/reference/byoc-4.png" alt="Advanced dashboard"/>

<br />

#### Access the BYOC Prometheus stack [#prometheus-access]
ClickHouse BYOC deploys a Prometheus stack on your Kubernetes cluster. You may access and scrape the metrics from there and integrate them with your own monitoring stack.

Contact ClickHouse support to enable the Private Load balancer and ask for the URL. Please note that this URL is only accessible via private network and does not support authentication

**Sample URL**
```bash
https://prometheus-internal.<subdomain>.<region>.aws.clickhouse-byoc.com/query
```

#### Prometheus Integration [#prometheus-integration]

<DeprecatedBadge/>

Please use the Prometheus stack integration in the above section instead. Besides the ClickHouse Server metrics, it provides more metrics including the K8S metrics and metrics from other services.

ClickHouse Cloud provides a Prometheus endpoint that you can use to scrape metrics for monitoring. This allows for integration with tools like Grafana and Datadog for visualization.

**Sample request via https endpoint /metrics_all**

```bash
curl --user <username>:<password> https://i6ro4qarho.mhp0y4dmph.us-west-2.aws.byoc.clickhouse.cloud:8443/metrics_all
```

**Sample Response**

```bash
# HELP ClickHouse_CustomMetric_StorageSystemTablesS3DiskBytes The amount of bytes stored on disk `s3disk` in system database
# TYPE ClickHouse_CustomMetric_StorageSystemTablesS3DiskBytes gauge
ClickHouse_CustomMetric_StorageSystemTablesS3DiskBytes{hostname="c-jet-ax-16-server-43d5baj-0"} 62660929
# HELP ClickHouse_CustomMetric_NumberOfBrokenDetachedParts The number of broken detached parts
# TYPE ClickHouse_CustomMetric_NumberOfBrokenDetachedParts gauge
ClickHouse_CustomMetric_NumberOfBrokenDetachedParts{hostname="c-jet-ax-16-server-43d5baj-0"} 0
# HELP ClickHouse_CustomMetric_LostPartCount The age of the oldest mutation (in seconds)
# TYPE ClickHouse_CustomMetric_LostPartCount gauge
ClickHouse_CustomMetric_LostPartCount{hostname="c-jet-ax-16-server-43d5baj-0"} 0
# HELP ClickHouse_CustomMetric_NumberOfWarnings The number of warnings issued by the server. It usually indicates about possible misconfiguration
# TYPE ClickHouse_CustomMetric_NumberOfWarnings gauge
ClickHouse_CustomMetric_NumberOfWarnings{hostname="c-jet-ax-16-server-43d5baj-0"} 2
# HELP ClickHouseErrorMetric_FILE_DOESNT_EXIST FILE_DOESNT_EXIST
# TYPE ClickHouseErrorMetric_FILE_DOESNT_EXIST counter
ClickHouseErrorMetric_FILE_DOESNT_EXIST{hostname="c-jet-ax-16-server-43d5baj-0",table="system.errors"} 1
# HELP ClickHouseErrorMetric_UNKNOWN_ACCESS_TYPE UNKNOWN_ACCESS_TYPE
# TYPE ClickHouseErrorMetric_UNKNOWN_ACCESS_TYPE counter
ClickHouseErrorMetric_UNKNOWN_ACCESS_TYPE{hostname="c-jet-ax-16-server-43d5baj-0",table="system.errors"} 8
# HELP ClickHouse_CustomMetric_TotalNumberOfErrors The total number of errors on server since the last restart
# TYPE ClickHouse_CustomMetric_TotalNumberOfErrors gauge
ClickHouse_CustomMetric_TotalNumberOfErrors{hostname="c-jet-ax-16-server-43d5baj-0"} 9
```

**Authentication**

A ClickHouse username and password pair can be used for authentication. We recommend creating a dedicated user with minimal permissions for scraping metrics. At minimum, a `READ` permission is required on the `system.custom_metrics` table across replicas. For example:

```sql
GRANT REMOTE ON *.* TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_custom_metrics_tables TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_database_replicated_recovery_time TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_failed_mutations TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_group TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_shared_catalog_recovery_time TO scrapping_user;
GRANT SELECT ON system._custom_metrics_dictionary_table_read_only_duration_seconds TO scrapping_user;
GRANT SELECT ON system._custom_metrics_view_error_metrics TO scrapping_user;
GRANT SELECT ON system._custom_metrics_view_histograms TO scrapping_user;
GRANT SELECT ON system._custom_metrics_view_metrics_and_events TO scrapping_user;
GRANT SELECT(description, metric, value) ON system.asynchronous_metrics TO scrapping_user;
GRANT SELECT ON system.custom_metrics TO scrapping_user;
GRANT SELECT(name, value) ON system.errors TO scrapping_user;
GRANT SELECT(description, event, value) ON system.events TO scrapping_user;
GRANT SELECT(description, labels, metric, value) ON system.histogram_metrics TO scrapping_user;
GRANT SELECT(description, metric, value) ON system.metrics TO scrapping_user;
```

**Configuring Prometheus**

An example configuration is shown below. The `targets` endpoint is the same one used for accessing the ClickHouse service.

```bash
global:
 scrape_interval: 15s

scrape_configs:
 - job_name: "prometheus"
   static_configs:
   - targets: ["localhost:9090"]
 - job_name: "clickhouse"
   static_configs:
     - targets: ["<subdomain1>.<subdomain2>.aws.byoc.clickhouse.cloud:8443"]
   scheme: https
   metrics_path: "/metrics_all"
   basic_auth:
     username: <KEY_ID>
     password: <KEY_SECRET>
   honor_labels: true
```

Please also see [this blog post](https://clickhouse.com/blog/clickhouse-cloud-now-supports-prometheus-monitoring) and the [Prometheus setup docs for ClickHouse](/integrations/prometheus).
