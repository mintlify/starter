---


sidebarTitle: 'Integrating Kafka with ClickHouse'
sidebar_position: 1
slug: /integrations/kafka
description: 'Introduction to Kafka with ClickHouse'
title: 'Integrating Kafka with ClickHouse'
keywords: ['Apache Kafka', 'event streaming', 'data pipeline', 'message broker', 'real-time data']
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'data_ingestion'
---

[Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. ClickHouse provides multiple options to **read from** and **write to** Kafka and other Kafka API-compatible brokers (e.g., Redpanda, Amazon MSK).

## Available options 

Choosing the right option for your use case depends on multiple factors, including your ClickHouse deployment type, data flow direction and operational requirements.

| Option                                                  | Deployment type | Fully managed | Kafka to ClickHouse | ClickHouse to Kafka |
|---------------------------------------------------------|------------|:-------------------:|:-------------------:|:------------------:|
| [ClickPipes for Kafka](/integrations/clickpipes/kafka)                                | [Cloud], [BYOC] (coming soon!)   | ✅ | ✅ |   |
| [Kafka Connect Sink](./kafka-clickhouse-connect-sink.md) | [Cloud], [BYOC], [Self-hosted] | | ✅ |   |
| [Kafka table engine](./kafka-table-engine.md)           | [Cloud], [BYOC], [Self-hosted] | | ✅ | ✅ |

For a more detailed comparison between these options, see [Choosing an option](#choosing-an-option).

### ClickPipes for Kafka 

[ClickPipes](../clickpipes/index.md) is a managed integration platform that makes ingesting data from a diverse set of sources as simple as clicking a few buttons. Because it is fully managed and purpose-built for production workloads, ClickPipes significantly lowers infrastructure and operational costs, removing the need for external data streaming and ETL tools.

<Tip>
This is the recommended option if you're a ClickHouse Cloud user. ClickPipes is **fully managed** and purpose-built to deliver the **best performance** in Cloud environments.
</Tip>

#### Main features 

[//]: # "TODO It isn't optimal to link to a static alpha-release of the Terraform provider. Link to a Terraform guide once that's available."

* Optimized for ClickHouse Cloud, delivering blazing-fast performance
* Horizontal and vertical scalability for high-throughput workloads
* Built-in fault tolerance with configurable replicas and automatic retries
* Deployment and management via ClickHouse Cloud UI, [Open API](/cloud/manage/api/api-overview), or [Terraform](https://registry.terraform.io/providers/ClickHouse/clickhouse/3.3.3-alpha2/docs/resources/clickpipe)
* Enterprise-grade security with support for cloud-native authorization (IAM) and private connectivity (PrivateLink)
* Supports a wide range of [data sources](/integrations/clickpipes/kafka/reference/), including Confluent Cloud, Amazon MSK, Redpanda Cloud, and Azure Event Hubs
* Supports most common serialization formats (JSON, Avro, Protobuf coming soon!)

#### Getting started 

To get started using ClickPipes for Kafka, see the [reference documentation](/integrations/clickpipes/kafka/reference) or navigate to the `Data Sources` tab in the ClickHouse Cloud UI.

### Kafka Connect Sink 

Kafka Connect is an open-source framework that works as a centralized data hub for simple data integration between Kafka and other data systems. The [ClickHouse Kafka Connect Sink](https://github.com/ClickHouse/clickhouse-kafka-connect) connector provides a scalable and highly-configurable option to read data from Apache Kafka and other Kafka API-compatible brokers.

<Tip>
This is the recommended option if you prefer **high configurability** or are already a Kafka Connect user.
</Tip>

#### Main features 

* Can be configured to support exactly-once semantics
* Supports most common serialization formats (JSON, Avro, Protobuf)
* Tested continuously against ClickHouse Cloud

#### Getting started 

To get started using the ClickHouse Kafka Connect Sink, see the [reference documentation](./kafka-clickhouse-connect-sink.md).

### Kafka table engine 

The [Kafka table engine](./kafka-table-engine.md) can be used to read data from and write data to Apache Kafka and other Kafka API-compatible brokers. This option is bundled with open-source ClickHouse and is available across all deployment types.

<Tip>
This is the recommended option if you're self-hosting ClickHouse and need a **low entry barrier** option, or if you need to **write** data to Kafka.
</Tip>

#### Main features 

* Can be used for [reading](./kafka-table-engine.md/#kafka-to-clickhouse) and [writing](./kafka-table-engine.md/#clickhouse-to-kafka) data
* Bundled with open-source ClickHouse
* Supports most common serialization formats (JSON, Avro, Protobuf)

#### Getting started 

To get started using the Kafka table engine, see the [reference documentation](./kafka-table-engine.md).

### Choosing an option 

| Product | Strengths | Weaknesses |
|---------|-----------|------------|
| **ClickPipes for Kafka** | • Scalable architecture for high throughput and low latency<br/>• Built-in monitoring and schema management<br/>• Private networking connections (via PrivateLink)<br/>• Supports SSL/TLS authentication and IAM authorization<br/>• Supports programmatic configuration (Terraform, API endpoints) | • Does not support pushing data to Kafka<br/>• At-least-once semantics |
| **Kafka Connect Sink** | • Exactly-once semantics<br/>• Allows granular control over data transformation, batching and error handling<br/>• Can be deployed in private networks<br/>• Allows real-time replication from databases not yet supported in ClickPipes via Debezium | • Does not support pushing data to Kafka<br/>• Operationally complex to set up and maintain<br/>• Requires Kafka and Kafka Connect expertise |
| **Kafka table engine** | • Supports [pushing data to Kafka](./kafka-table-engine.md/#clickhouse-to-kafka)<br/>• Operationally simple to set up | • At-least-once semantics<br/>• Limited horizontal scaling for consumers. Cannot be scaled independently from the ClickHouse server<br/>• Limited error handling and debugging options<br/>• Requires Kafka expertise |

### Other options 

* [**Confluent Cloud**](./confluent/index.md) - Confluent Platform provides an option to upload and [run ClickHouse Connector Sink on Confluent Cloud](./confluent/custom-connector.md) or use [HTTP Sink Connector for Confluent Platform](./confluent/kafka-connect-http.md) that integrates Apache Kafka with an API via HTTP or HTTPS.

* [**Vector**](./kafka-vector.md) - Vector is a vendor-agnostic data pipeline. With the ability to read from Kafka, and send events to ClickHouse, this represents a robust integration option.

* [**JDBC Connect Sink**](./kafka-connect-jdbc.md) - The Kafka Connect JDBC Sink connector allows you to export data from Kafka topics to any relational database with a JDBC driver.

* **Custom code** - Custom code using Kafka and ClickHouse [client libraries](../../language-clients/index.md) may be appropriate in cases where custom processing of events is required.

[BYOC]: /cloud/reference/byoc/overview
[Cloud]: /cloud/get-started
[Self-hosted]: ../../../intro.md
