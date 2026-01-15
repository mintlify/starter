---
sidebarTitle: 'Integrations'
slug: /manage/integrations
title: 'Integrations'
description: 'Integrations for ClickHouse'
doc_type: 'landing-page'
keywords: ['integrations', 'cloud features', 'third-party tools', 'data sources', 'connectors']
---

ClickHouse Cloud allows you to connect the tools and services that you love.

## Managed integration pipelines for ClickHouse Cloud 

ClickPipes is a managed integration platform that makes ingesting data from a diverse set of sources as simple as clicking a few buttons.
Designed for the most demanding workloads, ClickPipes's robust and scalable architecture ensures consistent performance and reliability.
ClickPipes can be used for long-term streaming needs or one-time data loading job.

| Name                                               | Logo                                                                                             |Type| Status           | Description                                                                                          |
|----------------------------------------------------|--------------------------------------------------------------------------------------------------|----|------------------|------------------------------------------------------------------------------------------------------|
| [Apache Kafka](/integrations/clickpipes/kafka)     | <Kafkasvg class="image" alt="Apache Kafka logo" style={{width: '3rem', 'height': '3rem'}}/>      |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from Apache Kafka into ClickHouse Cloud.     |
| Confluent Cloud                                    | <Confluentsvg class="image" alt="Confluent Cloud logo" style={{width: '3rem'}}/>                 |Streaming| Stable           | Unlock the combined power of Confluent and ClickHouse Cloud through our direct integration.          |
| Redpanda                                           | <img src="/images/integrations/logos/logo_redpanda.png" alt="Redpanda logo"/>                                     |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from Redpanda into ClickHouse Cloud.         |
| AWS MSK                                            | <Msksvg class="image" alt="AWS MSK logo" style={{width: '3rem', 'height': '3rem'}}/>             |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from AWS MSK into ClickHouse Cloud.          |
| Azure Event Hubs                                   | <Azureeventhubssvg class="image" alt="Azure Event Hubs logo" style={{width: '3rem'}}/>           |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from Azure Event Hubs into ClickHouse Cloud. |
| WarpStream                                         | <Warpstreamsvg class="image" alt="WarpStream logo" style={{width: '3rem'}}/>                     |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from WarpStream into ClickHouse Cloud.       |
| Amazon S3                                          | <S3svg class="image" alt="Amazon S3 logo" style={{width: '3rem', height: 'auto'}}/>              |Object Storage| Stable           | Configure ClickPipes to ingest large volumes of data from object storage.                            |
| Google Cloud Storage                               | <Gcssvg class="image" alt="Google Cloud Storage logo" style={{width: '3rem', height: 'auto'}}/>  |Object Storage| Stable           | Configure ClickPipes to ingest large volumes of data from object storage.                            |
| DigitalOcean Spaces                                | <DOsvg class="image" alt="Digital Ocean logo" style={{width: '3rem', height: 'auto'}}/>          | Object Storage | Stable | Configure ClickPipes to ingest large volumes of data from object storage.
| Azure Blob Storage                                 | <ABSsvg class="image" alt="Azure Blob Storage logo" style={{width: '3rem', height: 'auto'}}/>    | Object Storage | Private Beta | Configure ClickPipes to ingest large volumes of data from object storage.
| [Amazon Kinesis](/integrations/clickpipes/kinesis) | <AmazonKinesis class="image" alt="Amazon Kinesis logo" style={{width: '3rem', height: 'auto'}}/> |Streaming| Stable           | Configure ClickPipes and start ingesting streaming data from Amazon Kinesis into ClickHouse cloud.   |
| [Postgres](/integrations/clickpipes/postgres)      | <Postgressvg class="image" alt="Postgres logo" style={{width: '3rem', height: 'auto'}}/>         |DBMS| Stable      | Configure ClickPipes and start ingesting data from Postgres into ClickHouse Cloud.                   |
| [MySQL](/integrations/clickpipes/mysql)            | <Mysqlsvg class="image" alt="MySQL logo" style={{width: '3rem', height: 'auto'}}/>               |DBMS| Private Beta | Configure ClickPipes and start ingesting data from MySQL into ClickHouse Cloud.                      |
| [MongoDB](/integrations/clickpipes/mongodb)        | <Mongodbsvg class="image" alt="MongoDB logo" style={{width: '3rem', height: 'auto'}}/>           |DBMS| Private Preview | Configure ClickPipes and start ingesting data from MongoDB into ClickHouse Cloud.                   |

## Language client integrations 

ClickHouse offers a number of language client integrations, for which the documentation for each is linked below.

| Page                                                                    | Description                                                                      |
|-------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| [C++](/interfaces/cpp)                                          | C++ Client Library and userver Asynchronous Framework                            |
| [C#](/integrations/csharp)                                  | Learn how to connect your C# projects to ClickHouse.                         |
| [Go](/integrations/go)                                          | Learn how to connect your Go projects to ClickHouse.                             |
| [JavaScript](/integrations/javascript)                          | Learn how to connect your JS projects to ClickHouse with the official JS client. |
| [Java](/integrations/java)                                      | Learn more about several integrations for Java and ClickHouse.                   |
| [Python](/integrations/python)                                  | Learn how to connect your Python projects to ClickHouse.                         |
| [Rust](/integrations/rust)                                      | Learn how to connect your Rust projects to ClickHouse.                           |
| [Third-party clients](/interfaces/third-party/client-libraries) | Learn more about client libraries from third party developers.                   |

In addition to ClickPipes, language clients, ClickHouse supports a host of other integrations, spanning core integrations,
partner integrations and community integrations.
For a complete list see the ["Integrations"](/integrations) section of the docs.