---
sidebarTitle: 'Kafka Connector Sink on Confluent Platform'
sidebar_position: 3
slug: /integrations/kafka/cloud/confluent/custom-connector
description: 'Using ClickHouse Connector Sink with Kafka Connect and ClickHouse'
title: 'Integrating Confluent Cloud with ClickHouse'
keywords: ['Confluent ClickHouse integration', 'ClickHouse Kafka connector', 'Kafka Connect ClickHouse sink', 'Confluent Platform ClickHouse', 'custom connector Confluent']
doc_type: 'guide'
---

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';


<Frame>
  <iframe src="//www.youtube.com/embed/SQAiPVbd3gg"
    width="640"
    height="360"
    frameborder="0"
    allow="autoplay;
    fullscreen;
    picture-in-picture"
    allowfullscreen>
  </iframe>
</Frame>

## Prerequisites 
We assume you are familiar with:
* [ClickHouse Connector Sink](../kafka-clickhouse-connect-sink.md)
* Confluent Platform and [Custom Connectors](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/overview.html).

## The official Kafka connector from ClickHouse with Confluent Platform 

### Installing on Confluent platform 
This is meant to be a quick guide to get you started with the ClickHouse Sink Connector on Confluent Platform.
For more details, please refer to the [official Confluent documentation](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/custom-connector-qs.html#uploading-and-launching-the-connector).

#### Create a Topic 
Creating a topic on Confluent Platform is fairly simple, and there are detailed instructions [here](https://docs.confluent.io/cloud/current/client-apps/topics/manage.html).

#### Important notes 

* The Kafka topic name must be the same as the ClickHouse table name. The way to tweak this is by using a transformer (for example [`ExtractTopic`](https://docs.confluent.io/platform/current/connect/transforms/extracttopic.html)).
* More partitions does not always mean more performance - see our upcoming guide for more details and performance tips.

#### Install connector 
You can download the connector from our [repository](https://github.com/ClickHouse/clickhouse-kafka-connect/releases) - please feel free to submit comments and issues there as well!

Navigate to "Connector Plugins" -> "Add plugin" and using the following settings:

```text
'Connector Class' - 'com.clickhouse.kafka.connect.ClickHouseSinkConnector'
'Connector type' - Sink
'Sensitive properties' - 'password'. This will ensure entries of the ClickHouse password are masked during configuration.
```
Example:
<img src="/images/integrations/data-ingestion/kafka/confluent/AddCustomConnectorPlugin.png" alt="Confluent Platform UI showing settings for adding a custom ClickHouse connector"/>

#### Gather your connection details 

<GatherYourDetailsHttp />

#### Configure the connector 
Navigate to `Connectors` -> `Add Connector` and use the following settings (note that the values are examples only):

```json
{
  "database": "<DATABASE_NAME>",
  "errors.retry.timeout": "30",
  "exactlyOnce": "false",
  "schemas.enable": "false",
  "hostname": "<CLICKHOUSE_HOSTNAME>",
  "password": "<SAMPLE_PASSWORD>",
  "port": "8443",
  "ssl": "true",
  "topics": "<TOPIC_NAME>",
  "username": "<SAMPLE_USERNAME>",
  "key.converter": "org.apache.kafka.connect.storage.StringConverter",
  "value.converter": "org.apache.kafka.connect.json.JsonConverter",
  "value.converter.schemas.enable": "false"
}
```

#### Specify the connection endpoints 
You need to specify the allow-list of endpoints that the connector can access.
You must use a fully-qualified domain name (FQDN) when adding the networking egress endpoint(s).
Example: `u57swl97we.eu-west-1.aws.clickhouse.com:8443`

<Note>
You must specify HTTP(S) port. The Connector doesn't support Native protocol yet.
</Note>

[Read the documentation.](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/custom-connector-qs.html#cc-byoc-endpoints)

You should be all set!

#### Known limitations 
* Custom Connectors must use public internet endpoints. Static IP addresses aren't supported.
* You can override some Custom Connector properties. See the fill [list in the official documentation.](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/custom-connector-manage.html#override-configuration-properties)
* Custom Connectors are available only in [some AWS regions](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/custom-connector-fands.html#supported-aws-regions)
* See the list of [Custom Connectors limitations in the official docs](https://docs.confluent.io/cloud/current/connectors/bring-your-connector/custom-connector-fands.html#limitations)
