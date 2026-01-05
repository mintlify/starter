---
slug: /whats-new/cloud-compatibility
sidebarTitle: 'Cloud compatibility'
title: 'Cloud Compatibility'
description: 'This guide provides an overview of what to expect functionally and operationally in ClickHouse Cloud.'
keywords: ['ClickHouse Cloud', 'compatibility']
doc_type: 'guide'
---

This guide provides an overview of what to expect functionally and operationally in ClickHouse Cloud. While ClickHouse Cloud is based on the open-source ClickHouse distribution, there may be some differences in architecture and implementation. You may find this blog on [how we built ClickHouse Cloud](https://clickhouse.com/blog/building-clickhouse-cloud-from-scratch-in-a-year) interesting and relevant to read as background.

## ClickHouse Cloud architecture [#clickhouse-cloud-architecture]
ClickHouse Cloud significantly simplifies operational overhead and reduces the costs of running ClickHouse at scale. There is no need to size your deployment upfront, set up replication for high availability, manually shard your data, scale up your servers when your workload increases, or scale them down when you are not using them — we handle this for you.

These benefits come as a result of architectural choices underlying ClickHouse Cloud:
- Compute and storage are separated and thus can be automatically scaled along separate dimensions, so you do not have to over-provision either storage or compute in static instance configurations.
- Tiered storage on top of object store and multi-level caching provides virtually limitless scaling and good price/performance ratio, so you do not have to size your storage partition upfront and worry about high storage costs.
- High availability is on by default and replication is transparently managed, so you can focus on building your applications or analyzing your data.
- Automatic scaling for variable continuous workloads is on by default, so you don't have to size your service upfront, scale up your servers when your workload increases, or manually scale down your servers when you have less activity
- Seamless hibernation for intermittent workloads is on by default. We automatically pause your compute resources after a period of inactivity and transparently start it again when a new query arrives, so you don't have to pay for idle resources.
- Advanced scaling controls provide the ability to set an auto-scaling maximum for additional cost control or an auto-scaling minimum to reserve compute resources for applications with specialized performance requirements.

## Capabilities [#capabilities]
ClickHouse Cloud provides access to a curated set of capabilities in the open source distribution of ClickHouse. Tables below describe some features that are disabled in ClickHouse Cloud at this time.

### DDL syntax [#ddl-syntax]
For the most part, the DDL syntax of ClickHouse Cloud should match what is available in self-managed installs. A few notable exceptions:
- Support for `CREATE AS SELECT`, which is currently not available. As a workaround, we suggest using `CREATE ... EMPTY ... AS SELECT` and then inserting into that table (see [this blog](https://clickhouse.com/blog/getting-data-into-clickhouse-part-1) for an example).
- Some experimental syntax may be disabled, for instance, `ALTER TABLE ... MODIFY QUERY` statement.
- Some introspection functionality may be disabled for security purposes, for example, the `addressToLine` SQL function.
- Do not use `ON CLUSTER` parameters in ClickHouse Cloud - these are not needed. While these are mostly no-op functions, they can still cause an error if you are trying to use [macros](/operations/server-configuration-parameters/settings#macros). Macros often do not work and are not needed in ClickHouse Cloud.

### Database and table engines [#database-and-table-engines]

ClickHouse Cloud provides a highly-available, replicated service by default. As a result, all database and table engines are "Replicated". You do not need to specify "Replicated"–for example, `ReplicatedMergeTree` and `MergeTree` are identical when used in ClickHouse Cloud.

**Supported table engines**

- ReplicatedMergeTree (default, when none is specified)
- ReplicatedSummingMergeTree
- ReplicatedAggregatingMergeTree
- ReplicatedReplacingMergeTree
- ReplicatedCollapsingMergeTree
- ReplicatedVersionedCollapsingMergeTree
- MergeTree (converted to ReplicatedMergeTree)
- SummingMergeTree (converted to ReplicatedSummingMergeTree)
- AggregatingMergeTree (converted to ReplicatedAggregatingMergeTree)
- ReplacingMergeTree (converted to ReplicatedReplacingMergeTree)
- CollapsingMergeTree (converted to ReplicatedCollapsingMergeTree)
- VersionedCollapsingMergeTree (converted to ReplicatedVersionedCollapsingMergeTree)
- URL
- View
- MaterializedView
- GenerateRandom
- Null
- Buffer
- Memory
- Deltalake
- Hudi
- MySQL
- MongoDB
- NATS
- RabbitMQ
- PostgreSQL
- S3

### Interfaces [#interfaces]
ClickHouse Cloud supports HTTPS, native interfaces, and the [MySQL wire protocol](/interfaces/mysql). Support for more interfaces such as Postgres is coming soon.

### Dictionaries [#dictionaries]
Dictionaries are a popular way to speed up lookups in ClickHouse.  ClickHouse Cloud currently supports dictionaries from PostgreSQL, MySQL, remote and local ClickHouse servers, Redis, MongoDB and HTTP sources.

### Federated queries [#federated-queries]
We support federated ClickHouse queries for cross-cluster communication in the cloud, and for communication with external self-managed ClickHouse clusters. ClickHouse Cloud currently supports federated queries using the following integration engines:
- Deltalake
- Hudi
- MySQL
- MongoDB
- NATS
- RabbitMQ
- PostgreSQL
- S3

Federated queries with some external database and table engines, such as SQLite, ODBC, JDBC, Redis, HDFS and Hive are not yet supported.

### User defined functions [#user-defined-functions]

User-defined functions are a recent feature in ClickHouse. ClickHouse Cloud currently supports SQL UDFs only.

### Experimental features [#experimental-features]

Experimental features are disabled in ClickHouse Cloud services to ensure the stability of service deployments.

### Kafka [#kafka]

The [Kafka Table Engine](/integrations/data-ingestion/kafka/index.md) is not generally available in ClickHouse Cloud. Instead, we recommend relying on architectures that decouple the Kafka connectivity components from the ClickHouse service to achieve a separation of concerns. We recommend [ClickPipes](https://clickhouse.com/cloud/clickpipes) for pulling data from a Kafka stream. Alternatively, consider the push-based alternatives listed in the [Kafka User Guide](/integrations/data-ingestion/kafka/index.md).

### Named collections [#named-collections]

[Named collections](/operations/named-collections) are not currently supported in ClickHouse Cloud.

## Operational defaults and considerations [#operational-defaults-and-considerations]
The following are default settings for ClickHouse Cloud services. In some cases, these settings are fixed to ensure the correct operation of the service, and in others, they can be adjusted.

### Operational limits [#operational-limits]

#### `max_parts_in_total: 10,000` [#max_parts_in_total-10000]
The default value of the `max_parts_in_total` setting for MergeTree tables has been lowered from 100,000 to 10,000. The reason for this change is that we observed that a large number of data parts is likely to cause a slow startup time of services in the cloud. A large number of parts usually indicate a choice of too granular partition key, which is typically done accidentally and should be avoided. The change of default will allow the detection of these cases earlier.

#### `max_concurrent_queries: 1,000` [#max_concurrent_queries-1000]
Increased this per-server setting from the default of `100` to `1000` to allow for more concurrency. 
This will result in `number of replicas * 1,000` concurrent queries for the offered tier services. 
`1000` concurrent queries for Basic tier service limited to a single replica and `1000+` for Scale and Enterprise, 
depending on the number of replicas configured.

#### `max_table_size_to_drop: 1,000,000,000,000` [#max_table_size_to_drop-1000000000000]
Increased this setting from 50GB to allow for dropping of tables/partitions up to 1TB.

### System settings [#system-settings]
ClickHouse Cloud is tuned for variable workloads, and for that reason most system settings are not configurable at this time. We do not anticipate the need to tune system settings for most users, but if you have a question about advanced system tuning, please contact ClickHouse Cloud Support.

### Advanced security administration [#advanced-security-administration]
As part of creating the ClickHouse service, we create a default database, and the default user that has broad permissions to this database. This initial user can create additional users and assign their permissions to this database. Beyond this, the ability to enable the following security features within the database using Kerberos, LDAP, or SSL X.509 certificate authentication are not supported at this time.

## Roadmap [#roadmap]

We are introducing support for executable UDFs in the Cloud and evaluating demand for many other features. If you have feedback and would like to ask for a specific feature, please [submit it here](https://console.clickhouse.cloud/support).
