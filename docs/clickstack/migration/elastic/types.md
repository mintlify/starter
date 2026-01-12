---
slug: /use-cases/observability/clickstack/migration/elastic/types
title: 'Mapping types'
pagination_prev: null
pagination_next: null
sidebarTitle: 'Types'
sidebar_position: 2
description: 'Mapping types in ClickHouse and Elasticsearch'
show_related_blogs: true
keywords: ['JSON', 'Codecs']
doc_type: 'reference'
---

Elasticsearch and ClickHouse support a wide variety of data types, but their underlying storage and query models are fundamentally different. This section maps commonly used Elasticsearch field types to their ClickHouse equivalents, where available, and provides context to help guide migrations. Where no equivalent exists, alternatives or notes are provided in the comments.

| **Elasticsearch Type**        | **ClickHouse Equivalent**   | **Comments** |
|-------------------------------|------------------------------|--------------|
| `boolean`                     | [`UInt8`](/sql-reference/data-types/int-uint)  or [`Bool`](/sql-reference/data-types/boolean)        | ClickHouse supports `Boolean` as an alias for `UInt8` in newer versions. |
| `keyword`                     | [`String`](/sql-reference/data-types/string)                    | Used for exact-match filtering, grouping, and sorting. |
| `text`                        | [`String`](/sql-reference/data-types/string)                    | Full-text search is limited in ClickHouse; tokenization requires custom logic using functions such as `tokens` combined with array functions. |
| `long`                        | [`Int64`](/sql-reference/data-types/int-uint)                     | 64-bit signed integer. |
| `integer`                    | [`Int32`](/sql-reference/data-types/int-uint)                      | 32-bit signed integer. |
| `short`                       | [`Int16`](/sql-reference/data-types/int-uint)                      | 16-bit signed integer. |
| `byte`                        | [`Int8`](/sql-reference/data-types/int-uint)                       | 8-bit signed integer. |
| `unsigned_long`              | [`UInt64`](/sql-reference/data-types/int-uint)                    | Unsigned 64-bit integer. |
| `double`                      | [`Float64`](/sql-reference/data-types/float)                   | 64-bit floating-point. |
| `float`                       | [`Float32`](/sql-reference/data-types/float)                   | 32-bit floating-point. |
| `half_float`                 | [`Float32`](/sql-reference/data-types/float) or [`BFloat16`](/sql-reference/data-types/float)      | Closest equivalent. ClickHouse does not have a 16-bit float. ClickHouse has a `BFloat16`- this is different from Half-float IEE-754: half-float offers higher precision with a smaller range, while bfloat16 sacrifices precision for a wider range, making it better suited for machine learning workloads. |
| `scaled_float`              | [`Decimal(x, y)`](/sql-reference/data-types/decimal)             | Store fixed-point numeric values. |
| `date`         | [`DateTime`](/sql-reference/data-types/datetime)    | Equivalent date types with second precision. |
| `date_nanos`         | [`DateTime64`](/sql-reference/data-types/datetime64)    | ClickHouse supports nanosecond precision with `DateTime64(9)`. |
| `binary`                      | [`String`](/sql-reference/data-types/string), [`FixedString(N)`](/sql-reference/data-types/fixedstring)  | Needs base64 decoding for binary fields. |
| `ip`                          | [`IPv4`](/sql-reference/data-types/ipv4), [`IPv6`](/sql-reference/data-types/ipv6)    | Native `IPv4` and `IPv6` types available. |
| `object`                      | [`Nested`](/sql-reference/data-types/nested-data-structures/nested), [`Map`](/sql-reference/data-types/map), [`Tuple`](/sql-reference/data-types/tuple), [`JSON`](/sql-reference/data-types/newjson) | ClickHouse can model JSON-like objects using [`Nested`](/sql-reference/data-types/nested-data-structures/nested) or [`JSON`](/sql-reference/data-types/newjson). |
| `flattened`                  | [`String`](/sql-reference/data-types/string)                      | The flattened type in Elasticsearch stores entire JSON objects as single fields, enabling flexible, schemaless access to nested keys without full mapping. In ClickHouse, similar functionality can be achieved using the String type, but requires processing to be done in materialized views. |
| `nested`                      | [`Nested`](/sql-reference/data-types/nested-data-structures/nested)                    | ClickHouse `Nested` columns provide similar semantics for grouped sub fields assuming users use `flatten_nested=0`. |
| `join`                        | NA                           | No direct concept of parent-child relationships. Not required in ClickHouse as joins across tables are supported. |
| `alias`                       | [`Alias`](/sql-reference/statements/create/table#alias) column modifier      | Aliases [are supported](/sql-reference/statements/create/table#alias) through a field modifier. Functions can be applied to these alias e.g. `size String ALIAS formatReadableSize(size_bytes)`|
| `range` types (`*_range`)     | [`Tuple(start, end)`](/sql-reference/data-types/tuple) or [`Array(T)`](/sql-reference/data-types/array) | ClickHouse has no native range type, but numerical and date ranges can be represented using [`Tuple(start, end)`](/sql-reference/data-types/tuple) or [`Array`](/sql-reference/data-types/array) structures. For IP ranges (`ip_range`), store CIDR values as `String` and evaluate with functions like `isIPAddressInRange()`. Alternatively, consider `ip_trie` based lookup dictionaries for efficient filtering. |
| `aggregate_metric_double`     | [`AggregateFunction(...)`](/sql-reference/data-types/aggregatefunction) and [`SimpleAggregateFunction(...)`](/sql-reference/data-types/simpleaggregatefunction)    | Use aggregate function states and materialized views to model pre-aggregated metrics. All aggregation functions support aggregate states.|
| `histogram`                   | [`Tuple(Array(Float64), Array(UInt64))`](/sql-reference/data-types/tuple) | Manually represent buckets and counts using arrays or custom schemas. |
| `annotated-text`              | [`String`](/sql-reference/data-types/string)                    | No built-in support for entity-aware search or annotations. |
| `completion`, `search_as_you_type` | NA                    | No native autocomplete or suggester engine. Can be reproduced with `String` and [search functions](/sql-reference/functions/string-search-functions). |
| `semantic_text`               | NA                           | No native semantic search - generate embeddings and use vector search. |
| `token_count`                 | [`Int32`](/sql-reference/data-types/int-uint)                    | Use during ingestion to compute token count manually e.g. `length(tokens())` function e.g. with a Materialized column |
| `dense_vector`                | [`Array(Float32)`](/sql-reference/data-types/array)            | Use arrays for embedding storage |
| `sparse_vector`               | [`Map(UInt32, Float32)`](/sql-reference/data-types/map)      | Simulate sparse vectors with maps. No native sparse vector support. |
| `rank_feature` / `rank_features` | [`Float32`](/sql-reference/data-types/float), [`Array(Float32)`](/sql-reference/data-types/array) | No native query-time boosting, but can be modeled manually in scoring logic. |
| `geo_point`                   | [`Tuple(Float64, Float64)`](/sql-reference/data-types/tuple) or [`Point`](/sql-reference/data-types/geo#point) | Use tuple of (latitude, longitude). [`Point`](/sql-reference/data-types/geo#point) is available as a ClickHouse type. |
| `geo_shape`, `shape`          | [`Ring`](/sql-reference/data-types/geo#ring), [`LineString`](/sql-reference/data-types/geo#linestring), [`MultiLineString`](/sql-reference/data-types/geo#multilinestring), [`Polygon`](/sql-reference/data-types/geo#polygon), [`MultiPolygon`](/sql-reference/data-types/geo#multipolygon)                          | Native support for geo shapes and spatial indexing. |
| `percolator`                  | NA                           | No concept of indexing queries. Use standard SQL + Incremental Materialized Views instead. |
| `version`                     | [`String`](/sql-reference/data-types/string)                    | ClickHouse does not have a native version type. Store versions as strings and use custom UDFs functions to perform semantic comparisons if needed. Consider normalizing to numeric formats if range queries are required. |

### Notes 

- **Arrays**: In Elasticsearch, all fields support arrays natively. In ClickHouse, arrays must be explicitly defined (e.g., `Array(String)`), with the advantage specific positions can be accessed and queried e.g. `an_array[1]`.
- **Multi-fields**: Elasticsearch allows indexing the [same field multiple ways](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/multi-fields#_multi_fields_with_multiple_analyzers) (e.g., both `text` and `keyword`). In ClickHouse, this pattern must be modeled using separate columns or views.
- **Map and JSON Types** - In ClickHouse, the [`Map`](/sql-reference/data-types/map) type is commonly used to model dynamic key-value structures such as `resourceAttributes` and `logAttributes`. This type enables flexible schema-less ingestion by allowing arbitrary keys to be added at runtime — similar in spirit to JSON objects in Elasticsearch. However, there are important limitations to consider:

  - **Uniform value types**: ClickHouse [`Map`](/sql-reference/data-types/map) columns must have a consistent value type (e.g., `Map(String, String)`). Mixed-type values are not supported without coercion.
  - **Performance cost**: accessing any key in a [`Map`](/sql-reference/data-types/map) requires loading the entire map into memory, which can be suboptimal for performance.
  - **No subcolumns**: unlike JSON, keys in a [`Map`](/sql-reference/data-types/map) are not represented as true subcolumns, which limits ClickHouse’s ability to index, compress, and query efficiently.

  Because of these limitations, ClickStack is migrating away from [`Map`](/sql-reference/data-types/map) in favor of ClickHouse's enhanced [`JSON`](/sql-reference/data-types/newjson) type. The [`JSON`](/sql-reference/data-types/newjson) type addresses many of the shortcomings of `Map`:

  - **True columnar storage**: each JSON path is stored as a subcolumn, allowing efficient compression, filtering, and vectorized query execution.
  - **Mixed-type support**: different data types (e.g., integers, strings, arrays) can coexist under the same path without coercion or type unification.
  - **File system scalability**: internal limits on dynamic keys (`max_dynamic_paths`) and types (`max_dynamic_types`) prevent an explosion of column files on disk, even with high cardinality key sets.
  - **Dense storage**: nulls and missing values are stored sparsely to avoid unnecessary overhead.

    The [`JSON`](/sql-reference/data-types/newjson) type is especially well-suited for observability workloads, offering the flexibility of schemaless ingestion with the performance and scalability of native ClickHouse types — making it an ideal replacement for [`Map`](/sql-reference/data-types/map) in dynamic attribute fields.

    For further details on the JSON type we recommend the [JSON guide](https://clickhouse.com/docs/integrations/data-formats/json/overview) and ["How we built a new powerful JSON data type for ClickHouse"](https://clickhouse.com/blog/a-new-powerful-json-data-type-for-clickhouse).
