---
slug: /use-cases/observability/clickstack/ttl
title: 'Managing TTL'
sidebarTitle: 'Managing TTL'
pagination_prev: null
pagination_next: null
description: 'Managing TTL with ClickStack'
doc_type: 'guide'
keywords: ['clickstack', 'ttl', 'data retention', 'lifecycle', 'storage management']
---

## TTL in ClickStack 

Time-to-Live (TTL) is a crucial feature in ClickStack for efficient data retention and management, especially given vast amounts of data are continuously generated. TTL allows for automatic expiration and deletion of older data, ensuring that the storage is optimally used and performance is maintained without manual intervention. This capability is essential for keeping the database lean, reducing storage costs, and ensuring that queries remain fast and efficient by focusing on the most relevant and recent data. Moreover, it helps in compliance with data retention policies by systematically managing data life cycles, thus enhancing the overall sustainability and scalability of the observability solution.

**By default, ClickStack retains data for 3 days. To modify this, see ["Modifying TTL"](#modifying-ttl).**

TTL is controlled at a table level in ClickHouse. For example, the schema for logs is shown below:

```sql
CREATE TABLE default.otel_logs
(
    `Timestamp` DateTime64(9) CODEC(Delta(8), ZSTD(1)),
    `TimestampTime` DateTime DEFAULT toDateTime(Timestamp),
    `TraceId` String CODEC(ZSTD(1)),
    `SpanId` String CODEC(ZSTD(1)),
    `TraceFlags` UInt8,
    `SeverityText` LowCardinality(String) CODEC(ZSTD(1)),
    `SeverityNumber` UInt8,
    `ServiceName` LowCardinality(String) CODEC(ZSTD(1)),
    `Body` String CODEC(ZSTD(1)),
    `ResourceSchemaUrl` LowCardinality(String) CODEC(ZSTD(1)),
    `ResourceAttributes` Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    `ScopeSchemaUrl` LowCardinality(String) CODEC(ZSTD(1)),
    `ScopeName` String CODEC(ZSTD(1)),
    `ScopeVersion` LowCardinality(String) CODEC(ZSTD(1)),
    `ScopeAttributes` Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    `LogAttributes` Map(LowCardinality(String), String) CODEC(ZSTD(1)),
    INDEX idx_trace_id TraceId TYPE bloom_filter(0.001) GRANULARITY 1,
    INDEX idx_res_attr_key mapKeys(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_res_attr_value mapValues(ResourceAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_scope_attr_key mapKeys(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_scope_attr_value mapValues(ScopeAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_log_attr_key mapKeys(LogAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_log_attr_value mapValues(LogAttributes) TYPE bloom_filter(0.01) GRANULARITY 1,
    INDEX idx_body Body TYPE tokenbf_v1(32768, 3, 0) GRANULARITY 8
)
ENGINE = MergeTree
PARTITION BY toDate(TimestampTime)
PRIMARY KEY (ServiceName, TimestampTime)
ORDER BY (ServiceName, TimestampTime, Timestamp)
TTL TimestampTime + toIntervalDay(3)
SETTINGS index_granularity = 8192, ttl_only_drop_parts = 1
```

Partitioning in ClickHouse allows data to be logically separated on disk according to a column or SQL expression. By separating data logically, each partition can be operated on independently e.g. deleted when it expires according to a TTL policy. 

As shown in the above example, partitioning is specified on a table when it is initially defined via the `PARTITION BY` clause. This clause can contain an SQL expression on any column/s, the results of which will define which partition a row is sent to. This causes data to be logically associated (via a common folder name prefix) with each partition on the disk, which can then be queried in isolation. For the example above, the default `otel_logs` schema partitions by day using the expression `toDate(Timestamp).` As rows are inserted into ClickHouse, this expression will be evaluated against each row and routed to the resulting partition if it exists (if the row is the first for a day, the partition will be created). For further details on partitioning and its other applications, see ["Table Partitions"](/partitions).

<img src="/images/use-cases/observability/observability-14.png" alt="Partitions"/>

The table schema also includes a `TTL TimestampTime + toIntervalDay(3)` and setting `ttl_only_drop_parts = 1`. The former clause ensures data will be dropped once it is older than 3 days. The setting `ttl_only_drop_parts = 1` enforces only expiring data parts where all of the data has expired (vs. attempting to partially delete rows). With partitioning ensuring data from separate days is never "merged," data can thus be efficiently dropped. 

:::important `ttl_only_drop_parts`
We recommend always using the setting [`ttl_only_drop_parts=1`](/operations/settings/merge-tree-settings#ttl_only_drop_parts). When this setting is enabled, ClickHouse drops a whole part when all rows in it are expired. Dropping whole parts instead of partial cleaning TTL-d rows (achieved through resource-intensive mutations when `ttl_only_drop_parts=0`) allows having shorter `merge_with_ttl_timeout` times and lower impact on system performance. If data is partitioned by the same unit at which you perform TTL expiration e.g. day, parts will naturally only contain data from the defined interval. This will ensure `ttl_only_drop_parts=1` can be efficiently applied.
:::

By default, data with an expired TTL is removed when ClickHouse [merges data parts](/engines/table-engines/mergetree-family/mergetree#mergetree-data-storage). When ClickHouse detects that data is expired, it performs an off-schedule merge.

<Note title="TTL schedule">
TTLs are not applied immediately but rather on a schedule, as noted above. The MergeTree table setting `merge_with_ttl_timeout` sets the minimum delay in seconds before repeating a merge with delete TTL. The default value is 14400 seconds (4 hours). But that is just the minimum delay; it can take longer until a TTL merge is triggered. If the value is too low, it will perform many off-schedule merges that may consume a lot of resources. A TTL expiration can be forced using the command `ALTER TABLE my_table MATERIALIZE TTL`.
</Note>

## Modifying TTL 

To modify TTL users can either:

1. **Modify the table schemas (recommended)**. This requires connecting to the ClickHouse instance e.g. using the [clickhouse-client](/interfaces/cli) or [Cloud SQL Console](/cloud/get-started/sql-console). For example, we can modify the TTL for the `otel_logs` table using the following DDL:

```sql
ALTER TABLE default.otel_logs
MODIFY TTL TimestampTime + toIntervalDay(7);
```

2. **Modify the OTel collector**. The ClickStack OpenTelemetry collector creates tables in ClickHouse if they do not exist. This is achieved via the ClickHouse exporter, which itself exposes a `ttl` parameter used for controlling the default TTL expression e.g.

```yaml
exporters:
 clickhouse:
   endpoint: tcp://localhost:9000?dial_timeout=10s&compress=lz4&async_insert=1
   ttl: 72h
```

### Column level TTL 

The above examples expire data at a table level. Users can also expire data at a column level. As data ages, this can be used to drop columns whose value in investigations does not justify their resource overhead to retain. For example, we recommend retaining the `Body` column in case new dynamic metadata is added that has not been extracted at insert time, e.g., a new Kubernetes label. After a period e.g. 1 month, it might be obvious that this additional metadata is not useful - thus limiting the value in retaining the `Body` column.

Below, we show how the `Body` column can be dropped after 30 days.

```sql
CREATE TABLE otel_logs_v2
(
        `Body` String TTL Timestamp + INTERVAL 30 DAY,
        `Timestamp` DateTime,
 ...
)
ENGINE = MergeTree
ORDER BY (ServiceName, Timestamp)
```

<Note>
Specifying a column level TTL requires users to specify their own schema. This cannot be specified in the OTel collector.
</Note>
