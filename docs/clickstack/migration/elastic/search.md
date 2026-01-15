---
slug: /use-cases/observability/clickstack/migration/elastic/search
title: 'Searching in ClickStack and Elastic'
pagination_prev: null
pagination_next: null
sidebarTitle: 'Search'
sidebar_position: 3
description: 'Searching in ClickStack and Elastic'
doc_type: 'guide'
keywords: ['clickstack', 'search', 'logs', 'observability', 'full-text search']
---

ClickHouse is a SQL-native engine, designed from the ground up for high-performance analytical workloads. In contrast, Elasticsearch provides a SQL-like interface, transpiling SQL into the underlying Elasticsearch query DSL — meaning it is not a first-class citizen, and [feature parity](https://www.elastic.co/docs/explore-analyze/query-filter/languages/sql-limitations) is limited. 

ClickHouse not only supports full SQL but extends it with a range of observability-focused functions, such as [`argMax`](/sql-reference/aggregate-functions/reference/argmax), [`histogram`](/sql-reference/aggregate-functions/parametric-functions#histogram), and [`quantileTiming`](/sql-reference/aggregate-functions/reference/quantiletiming), that simplify querying structured logs, metrics, and traces.

For simple log and trace exploration, HyperDX provides a [Lucene-style syntax](/use-cases/observability/clickstack/search) for intuitive, text-based filtering for field-value queries, ranges, wildcards, and more. This is comparable to the [Lucene syntax](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-query-string-query#query-string-syntax) in Elasticsearch and elements of the [Kibana Query Language](https://www.elastic.co/docs/reference/query-languages/kql).

<img src="/images/use-cases/observability/hyperdx-search.png" alt="Search"/>

HyperDX's search interface supports this familiar syntax but translates it behind the scenes into efficient SQL `WHERE` clauses, making the experience familiar for Kibana users while still allowing users to leverage the power of SQL when needed. This allows users to exploit the full range of [string search functions](/sql-reference/functions/string-search-functions), [similarity functions](/sql-reference/functions/string-functions#stringJaccardIndex) and [date time functions](/sql-reference/functions/date-time-functions) in ClickHouse.

<img src="/images/use-cases/observability/hyperdx-sql.png" alt="SQL"/>

Below, we compare the Lucene query languages of ClickStack and Elasticsearch.

## ClickStack search syntax vs Elasticsearch query string 

Both HyperDX and Elasticsearch provide flexible query languages to enable intuitive log and trace filtering. While Elasticsearch's query string is tightly integrated with its DSL and indexing engine, HyperDX supports a Lucene-inspired syntax that translates to ClickHouse SQL under the hood. The table below outlines how common search patterns behave across both systems, highlighting similarities in syntax and differences in backend execution.

| **Feature** | **HyperDX Syntax** | **Elasticsearch Syntax** | **Comments** |
|-------------------------|----------------------------------------|----------------------------------------|--------------|
| Free text search        | `error` | `error` | Matches across all indexed fields; in ClickStack this is rewritten to a multi-field SQL `ILIKE`. |
| Field match             | `level:error` | `level:error` | Identical syntax. HyperDX matches exact field values in ClickHouse. |
| Phrase search           | `"disk full"` | `"disk full"` | Quoted text matches an exact sequence; ClickHouse uses string equality or `ILIKE`. |
| Field phrase match      | `message:"disk full"` | `message:"disk full"` | Translates to SQL `ILIKE` or exact match. |
| OR conditions           | `error OR warning` | `error OR warning` | Logical OR of terms; both systems support this natively. |
| AND conditions          | `error AND db` | `error AND db` | Both translate to intersection; no difference in user syntax. |
| Negation                | `NOT error` or `-error` | `NOT error` or `-error` | Supported identically; HyperDX converts to SQL `NOT ILIKE`. |
| Grouping                | `(error OR fail) AND db` | `(error OR fail) AND db` | Standard Boolean grouping in both. |
| Wildcards               | `error*` or `*fail*` | `error*`, `*fail*` | HyperDX supports leading/trailing wildcards; ES disables leading wildcards by default for perf. Wildcards within terms are not supported, e.g., `f*ail.` Wildcards must be applied with a field match.|
| Ranges (numeric/date)   | `duration:[100 TO 200]` | `duration:[100 TO 200]` | HyperDX uses SQL `BETWEEN`; Elasticsearch expands to range queries. Unbounded `*` in ranges are not supported e.g. `duration:[100 TO *]`. If needed use `Unbounded ranges` below.|
| Unbounded ranges (numeric/date)   | `duration:>10` or `duration:>=10` | `duration:>10` or `duration:>=10` | HyperDX uses standard SQL operators|
| Inclusive/exclusive     | `duration:{100 TO 200}` (exclusive)    | Same                                   | Curly brackets denote exclusive bounds. `*` in ranges are not supported. e.g. `duration:[100 TO *]`|
| Exists check            | N/A                       | `_exists_:user` or `field:*` | `_exists_` is not supported. Use `LogAttributes.log.file.path: *` for `Map` columns e.g. `LogAttributes`. For root columns, these have to exist and will have a default value if not included in the event. To search for default values or missing columns use the same syntax as Elasticsearch ` ServiceName:*` or `ServiceName != ''`. |
| Regex                   |      `match` function          | `name:/joh?n(ath[oa]n)/` | Not currently supported in Lucene syntax. Users can use SQL and the [`match`](/sql-reference/functions/string-search-functions#match) function or other [string search functions](/sql-reference/functions/string-search-functions).|
| Fuzzy match             |      `editDistance('quikc', field) = 1` | `quikc~` | Not currently supported in Lucene syntax. Distance functions can be used in SQL e.g. `editDistance('rror', SeverityText) = 1` or [other similarity functions](/sql-reference/functions/string-functions#jaroSimilarity). |
| Proximity search        | Not supported                       | `"fox quick"~5` | Not currently supported in Lucene syntax. |
| Boosting                | `quick^2 fox` | `quick^2 fox` | Not supported in HyperDX at present. |
| Field wildcard          | `service.*:error` | `service.*:error` | Not supported in HyperDX at present. |
| Escaped special chars   | Escape reserved characters with `\` | Same      | Escaping required for reserved symbols. |

## Exists/missing differences 

Unlike Elasticsearch, where a field can be entirely omitted from an event and therefore truly "not exist," ClickHouse requires all columns in a table schema to exist. If a field is not provided in an insert event:

- For [`Nullable`](/sql-reference/data-types/nullable) fields, it will be set to `NULL`.
- For non-nullable fields (the default), it will be populated with a default value (often an empty string, 0, or equivalent).

In ClickStack, we use the latter as [`Nullable`](/sql-reference/data-types/nullable) is [not recommended](/optimize/avoid-nullable-columns).

This behavior means that checking whether a field "exists”" in the Elasticsearch sense is not directly supported. 

Instead, users can use `field:*` or `field != ''` to check for the presence of a non-empty value. It is thus not possible to distinguish between truly missing and explicitly empty fields.

In practice, this difference rarely causes issues for observability use cases, but it's important to keep in mind when translating queries between systems.
