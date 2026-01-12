---
sidebarTitle: 'Loading JSON'
sidebar_position: 20
title: 'Working with JSON'
slug: /integrations/data-formats/json/loading
description: 'Loading JSON'
keywords: ['json', 'clickhouse', 'inserting', 'loading', 'inserting']
score: 15
doc_type: 'guide'
---

The following examples provide a very simple example of loading structured and semi-structured JSON data. For more complex JSON, including nested structures, see the guide [**Designing JSON schema**](/integrations/data-formats/json/schema).

## Loading structured JSON 

In this section, we assume the JSON data is in [`NDJSON`](https://github.com/ndjson/ndjson-spec) (Newline delimited JSON) format, known as [`JSONEachRow`](/interfaces/formats/JSONEachRow) in ClickHouse, and well structured i.e. the column names and types are fixed. `NDJSON` is the preferred format for loading JSON due to its brevity and efficient use of space, but others are supported for both [input and output](/interfaces/formats/JSON).

Consider the following JSON sample, representing a row from the [Python PyPI dataset](https://clickpy.clickhouse.com/):

```json
{
  "date": "2022-11-15",
  "country_code": "ES",
  "project": "clickhouse-connect",
  "type": "bdist_wheel",
  "installer": "pip",
  "python_minor": "3.9",
  "system": "Linux",
  "version": "0.3.0"
}
```

In order to load this JSON object into ClickHouse, a table schema must be defined. 

In this simple case, our structure is static, our column names are known, and their types are well-defined. 

Whereas ClickHouse supports semi-structured data through a JSON type, where key names and their types can be dynamic, this is unnecessary here.

<Note title="Prefer static schemas where possible">
In cases where your columns have fixed names and types, and new columns are not expected, always prefer a statically defined schema in production.

The JSON type is preferred for highly dynamic data, where the names and types of columns are subject to change. This type is also useful in prototyping and data exploration.
</Note>

A simple schema for this is shown below, where **JSON keys are mapped to column names**:

```sql
CREATE TABLE pypi (
  `date` Date,
  `country_code` String,
  `project` String,
  `type` String,
  `installer` String,
  `python_minor` String,
  `system` String,
  `version` String
)
ENGINE = MergeTree
ORDER BY (project, date)
```

<Note title="Ordering keys">
We have selected an ordering key here via the `ORDER BY` clause. For further details on ordering keys and how to choose them, see [here](/data-modeling/schema-design#choosing-an-ordering-key).
</Note>

ClickHouse can load data JSON in several formats, automatically inferring the type from the extension and contents. We can read JSON files for the above table using the [S3 function](/sql-reference/table-functions/s3):

```sql
SELECT *
FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/pypi/json/*.json.gz')
LIMIT 1
┌───────date─┬─country_code─┬─project────────────┬─type────────┬─installer────┬─python_minor─┬─system─┬─version─┐
│ 2022-11-15 │ CN           │ clickhouse-connect │ bdist_wheel │ bandersnatch │              │        │ 0.2.8 │
└────────────┴──────────────┴────────────────────┴─────────────┴──────────────┴──────────────┴────────┴─────────┘

1 row in set. Elapsed: 1.232 sec.
```

Note how we are not required to specify the file format. Instead, we use a glob pattern to read all `*.json.gz` files in the bucket. ClickHouse automatically infers the format is `JSONEachRow` (ndjson) from the file extension and contents. A format can be manually specified through parameter functions in case ClickHouse is unable to detect it.

```sql
SELECT * FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/pypi/json/*.json.gz', JSONEachRow)
```

<Note title="Compressed files">
The above files are also compressed. This is automatically detected and handled by ClickHouse.
</Note>

To load the rows in these files, we can use an [`INSERT INTO SELECT`](/sql-reference/statements/insert-into#inserting-the-results-of-select):

```sql
INSERT INTO pypi SELECT * FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/pypi/json/*.json.gz')
Ok.

0 rows in set. Elapsed: 10.445 sec. Processed 19.49 million rows, 35.71 MB (1.87 million rows/s., 3.42 MB/s.)

SELECT * FROM pypi LIMIT 2

┌───────date─┬─country_code─┬─project────────────┬─type──┬─installer────┬─python_minor─┬─system─┬─version─┐
│ 2022-05-26 │ CN           │ clickhouse-connect │ sdist │ bandersnatch │              │        │ 0.0.7 │
│ 2022-05-26 │ CN           │ clickhouse-connect │ sdist │ bandersnatch │              │        │ 0.0.7 │
└────────────┴──────────────┴────────────────────┴───────┴──────────────┴──────────────┴────────┴─────────┘

2 rows in set. Elapsed: 0.005 sec. Processed 8.19 thousand rows, 908.03 KB (1.63 million rows/s., 180.38 MB/s.)
```

Rows can also be loaded inline using the [`FORMAT` clause](/sql-reference/statements/select/format) e.g.

```sql
INSERT INTO pypi
FORMAT JSONEachRow
{"date":"2022-11-15","country_code":"CN","project":"clickhouse-connect","type":"bdist_wheel","installer":"bandersnatch","python_minor":"","system":"","version":"0.2.8"}
```

These examples assume the use of the `JSONEachRow` format. Other common JSON formats are supported, with examples of loading these provided [here](/integrations/data-formats/json/other-formats).

## Loading semi-structured JSON 

Our previous example loaded JSON which was static with well known key names and types. This is often not the case - keys can be added or their types can change. This is common in use cases such as Observability data.

ClickHouse handles this through a dedicated [`JSON`](/sql-reference/data-types/newjson) type.

Consider the following example from an extended version of the above [Python PyPI dataset](https://clickpy.clickhouse.com/) dataset. Here we have added an arbitrary `tags` column with random key value pairs.

```json
{
  "date": "2022-09-22",
  "country_code": "IN",
  "project": "clickhouse-connect",
  "type": "bdist_wheel",
  "installer": "bandersnatch",
  "python_minor": "",
  "system": "",
  "version": "0.2.8",
  "tags": {
    "5gTux": "f3to*PMvaTYZsz!*rtzX1",
    "nD8CV": "value"
  }
}

```

The tags column here is unpredictable and thus impossible for us to model. To load this data, we can use our previous schema but provide an additional `tags` column of type [`JSON`](/sql-reference/data-types/newjson):

```sql
SET enable_json_type = 1;

CREATE TABLE pypi_with_tags
(
    `date` Date,
    `country_code` String,
    `project` String,
    `type` String,
    `installer` String,
    `python_minor` String,
    `system` String,
    `version` String,
    `tags` JSON
)
ENGINE = MergeTree
ORDER BY (project, date);
```

We populate the table using the same approach as for the original dataset:

```sql
INSERT INTO pypi_with_tags SELECT * FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/pypi/pypi_with_tags/sample.json.gz')
```

```sql
INSERT INTO pypi_with_tags SELECT *
FROM s3('https://datasets-documentation.s3.eu-west-3.amazonaws.com/pypi/pypi_with_tags/sample.json.gz')

Ok.

0 rows in set. Elapsed: 255.679 sec. Processed 1.00 million rows, 29.00 MB (3.91 thousand rows/s., 113.43 KB/s.)
Peak memory usage: 2.00 GiB.

SELECT *
FROM pypi_with_tags
LIMIT 2

┌───────date─┬─country_code─┬─project────────────┬─type──┬─installer────┬─python_minor─┬─system─┬─version─┬─tags─────────────────────────────────────────────────────┐
│ 2022-05-26 │ CN           │ clickhouse-connect │ sdist │ bandersnatch │              │        │ 0.0.7 │ {"nsBM":"5194603446944555691"}                           │
│ 2022-05-26 │ CN           │ clickhouse-connect │ sdist │ bandersnatch │              │        │ 0.0.7 │ {"4zD5MYQz4JkP1QqsJIS":"0","name":"8881321089124243208"} │
└────────────┴──────────────┴────────────────────┴───────┴──────────────┴──────────────┴────────┴─────────┴──────────────────────────────────────────────────────────┘

2 rows in set. Elapsed: 0.149 sec.
```

Notice the performance difference here on loading data. The JSON column requires type inference at insert time as well as additional storage if columns exist that have more than one type. Although the JSON type can be configured (see [Designing JSON schema](/integrations/data-formats/json/schema)) for equivalent performance to explicitly declaring columns, it is intentionally flexible out-of-the-box. This flexibility, however, comes at some cost. 

### When to use the JSON type 

Use the JSON type when your data:

* Has **unpredictable keys** that can change over time.
* Contains **values with varying types** (e.g., a path might sometimes contain a string, sometimes a number).
* Requires schema flexibility where strict typing isn't viable.

If your data structure is known and consistent, there is rarely a need for the JSON type, even if your data is in JSON format. Specifically, if your data has:

* **A flat structure with known keys**: use standard column types e.g. String.
* **Predictable nesting**: use Tuple, Array, or Nested types for these structures.
* **Predictable structure with varying types**: consider Dynamic or Variant types instead.

You can also mix approaches as we have done in the above example, using static columns for predictable top-level keys and a single JSON column for a dynamic section of the payload.
