---
sidebarTitle: 'Reference'
description: 'Details supported formats, sources, delivery semantics, authentication and experimental features supported by Kafka ClickPipes'
slug: /integrations/clickpipes/kafka/reference
sidebar_position: 1
title: 'Reference'
doc_type: 'reference'
keywords: ['kafka reference', 'clickpipes', 'data sources', 'avro', 'virtual columns']
---

import {ExperimentalBadge} from '/snippets/components/ExperimentalBadge/ExperimentalBadge.jsx';


## Supported data sources 

| Name                 |Logo|Type| Status          | Description                                                                                          |
|----------------------|----|----|-----------------|------------------------------------------------------------------------------------------------------|
| Apache Kafka         |<Kafkasvg class="image" alt="Apache Kafka logo" style={{width: '3rem', 'height': '3rem'}}/>|Streaming| Stable          | Configure ClickPipes and start ingesting streaming data from Apache Kafka into ClickHouse Cloud.     |
| Confluent Cloud      |<Confluentsvg class="image" alt="Confluent Cloud logo" style={{width: '3rem'}}/>|Streaming| Stable          | Unlock the combined power of Confluent and ClickHouse Cloud through our direct integration.          |
| Redpanda             |<img src="/images/integrations/logos/logo_redpanda.png" alt="Redpanda logo"/>|Streaming| Stable          | Configure ClickPipes and start ingesting streaming data from Redpanda into ClickHouse Cloud.         |
| AWS MSK              |<Msksvg class="image" alt="AWS MSK logo" style={{width: '3rem', 'height': '3rem'}}/>|Streaming| Stable          | Configure ClickPipes and start ingesting streaming data from AWS MSK into ClickHouse Cloud.          |
| Azure Event Hubs     |<Azureeventhubssvg class="image" alt="Azure Event Hubs logo" style={{width: '3rem'}}/>|Streaming| Stable          | Configure ClickPipes and start ingesting streaming data from Azure Event Hubs into ClickHouse Cloud. |
| WarpStream           |<Warpstreamsvg class="image" alt="WarpStream logo" style={{width: '3rem'}}/>|Streaming| Stable          | Configure ClickPipes and start ingesting streaming data from WarpStream into ClickHouse Cloud.       |

## Supported data formats 

The supported formats are:
- [JSON](/integrations/data-formats/json/overview)
- [AvroConfluent](/interfaces/formats/AvroConfluent)

## Supported data types 

### Standard 

The following standard ClickHouse data types are currently supported in ClickPipes:

- Base numeric types - \[U\]Int8/16/32/64, Float32/64, and BFloat16
- Large integer types - \[U\]Int128/256
- Decimal Types
- Boolean
- String
- FixedString
- Date, Date32
- DateTime, DateTime64 (UTC timezones only)
- Enum8/Enum16
- UUID
- IPv4
- IPv6
- all ClickHouse LowCardinality types
- Map with keys and values using any of the above types (including Nullables)
- Tuple and Array with elements using any of the above types (including Nullables, one level depth only)
- SimpleAggregateFunction types (for AggregatingMergeTree or SummingMergeTree destinations)

### Avro 

#### Supported Avro Data Types 
ClickPipes supports all Avro Primitive and Complex types, and all Avro Logical types except `time-millis`, `time-micros`, `local-timestamp-millis`, `local_timestamp-micros`, and `duration`.  Avro `record` types are converted to Tuple, `array` types to Array, and `map` to Map (string keys only).  In general the conversions listed [here](/interfaces/formats/Avro#data-type-mapping) are available.  We recommend using exact type matching for Avro numeric types, as ClickPipes does not check for overflow or precision loss on type conversion.
Alternatively, all Avro types can be inserted into a `String` column, and will be represented as a valid JSON string in that case.

#### Nullable types and Avro unions 
Nullable types in Avro are defined by using a Union schema of `(T, null)` or `(null, T)` where T is the base Avro type.  During schema inference, such unions will be mapped to a ClickHouse "Nullable" column.  Note that ClickHouse does not support
`Nullable(Array)`, `Nullable(Map)`, or `Nullable(Tuple)` types.  Avro null unions for these types will be mapped to non-nullable versions (Avro Record types are mapped to a ClickHouse named Tuple).  Avro "nulls" for these types will be inserted as:
- An empty Array for a null Avro array
- An empty Map for a null Avro Map
- A named Tuple with all default/zero values for a null Avro Record

#### Variant type support 
ClickPipes supports the Variant type in the following circumstances:
- Avro Unions.  If your Avro schema contains a union with multiple non-null types, ClickPipes will infer the
  appropriate variant type.  Variant types are not otherwise supported for Avro data.
- JSON fields.  You can manually specify a Variant type (such as `Variant(String, Int64, DateTime)`) for any JSON field
  in the source data stream.  Because of the way ClickPipes determines the correct variant subtype to use, only one integer or datetime
  type can be used in the Variant definition - for example, `Variant(Int64, UInt32)` is not supported.

#### JSON type support 
ClickPipes support the JSON type in the following circumstances:
- Avro Record types can always be assigned to a JSON column.
- Avro String and Bytes types can be assigned to a JSON column if the column actually holds JSON String objects.
- JSON fields that are always a JSON object can be assigned to a JSON destination column.

Note that you will have to manually change the destination column to the desired JSON type, including any fixed or skipped paths.

## Kafka virtual columns 

The following virtual columns are supported for Kafka compatible streaming data sources.  When creating a new destination table virtual columns can be added by using the `Add Column` button.

| Name             | Description                                     | Recommended Data Type  |
|------------------|-------------------------------------------------|------------------------|
| `_key`           | Kafka Message Key                               | `String`               |
| `_timestamp`     | Kafka Timestamp (Millisecond precision)         | `DateTime64(3)`        |
| `_partition`     | Kafka Partition                                 | `Int32`                |
| `_offset`        | Kafka Offset                                    | `Int64`                |
| `_topic`         | Kafka Topic                                     | `String`               |
| `_header_keys`   | Parallel array of keys in the record Headers    | `Array(String)`        |
| `_header_values` | Parallel array of headers in the record Headers | `Array(String)`        |
| `_raw_message`   | Full Kafka Message                              | `String`               |

Note that the `_raw_message` column is only recommended for JSON data. 
For use cases where only the JSON string is required (such as using ClickHouse [`JsonExtract*`](/sql-reference/functions/json-functions#jsonextract-functions) functions to
populate a downstream materialized view), it may improve ClickPipes performance to delete all the "non-virtual" columns.
