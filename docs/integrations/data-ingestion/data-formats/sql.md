---
sidebarTitle: 'SQL Dumps'
slug: /integrations/data-formats/sql
title: 'Inserting and dumping SQL data in ClickHouse'
description: 'Page describing how to transfer data between other databases and ClickHouse using SQL dumps.'
doc_type: 'guide'
keywords: ['sql format', 'data export', 'data import', 'backup', 'sql dumps']
---

ClickHouse can be easily integrated into OLTP database infrastructures in many ways. One way is to transfer data between other databases and ClickHouse using SQL dumps.

## Creating SQL dumps 

Data can be dumped in SQL format using [SQLInsert](/interfaces/formats/SQLInsert). ClickHouse will write data in `INSERT INTO <table name> VALUES(...` form and use [`output_format_sql_insert_table_name`](/operations/settings/settings-formats.md/#output_format_sql_insert_table_name) settings option as a table name:

```sql
SET output_format_sql_insert_table_name = 'some_table';
SELECT * FROM some_data
INTO OUTFILE 'dump.sql'
FORMAT SQLInsert
```

Column names can be omitted by disabling [`output_format_sql_insert_include_column_names`](/operations/settings/settings-formats.md/#output_format_sql_insert_include_column_names) option:

```sql
SET output_format_sql_insert_include_column_names = 0
```

Now we can feed [dump.sql](assets/dump.sql) file to another OLTP database:

```bash
mysql some_db < dump.sql
```

We assume that the `some_table` table exists in the `some_db` MySQL database.

Some DBMSs might have limits on how much values can be processes within a single batch. By default, ClickHouse will create 65k values batches, but that can be changed with the [`output_format_sql_insert_max_batch_size`](/operations/settings/settings-formats.md/#output_format_sql_insert_max_batch_size) option:

```sql
SET output_format_sql_insert_max_batch_size = 1000;
```

### Exporting a set of values 

ClickHouse has [Values](/interfaces/formats/Values) format, which is similar to SQLInsert, but omits an `INSERT INTO table VALUES` part and returns only a set of values:

```sql
SELECT * FROM some_data LIMIT 3 FORMAT Values
```
```response
('Bangor_City_Forest','2015-07-01',34),('Alireza_Afzal','2017-02-01',24),('Akhaura-Laksam-Chittagong_Line','2015-09-01',30)
```

## Inserting data from SQL dumps 

To read SQL dumps, [MySQLDump](/interfaces/formats/MySQLDump) is used:

```sql
SELECT *
FROM file('dump.sql', MySQLDump)
LIMIT 5
```
```response
┌─path───────────────────────────┬──────month─┬─hits─┐
│ Bangor_City_Forest             │ 2015-07-01 │   34 │
│ Alireza_Afzal                  │ 2017-02-01 │   24 │
│ Akhaura-Laksam-Chittagong_Line │ 2015-09-01 │   30 │
│ 1973_National_500              │ 2017-10-01 │   80 │
│ Attachment                     │ 2017-09-01 │ 1356 │
└────────────────────────────────┴────────────┴──────┘
```

By default, ClickHouse will skip unknown columns (controlled by [input_format_skip_unknown_fields](/operations/settings/settings-formats.md/#input_format_skip_unknown_fields) option) and process data for the first found table in a dump (in case multiple tables were dumped to a single file). DDL statements will be skipped. To load data from MySQL dump into a table ([mysql.sql](assets/mysql.sql) file):

```sql
INSERT INTO some_data
FROM INFILE 'mysql.sql' FORMAT MySQLDump
```

We can also create a table automatically from the MySQL dump file:

```sql
CREATE TABLE table_from_mysql
ENGINE = MergeTree
ORDER BY tuple() AS
SELECT *
FROM file('mysql.sql', MySQLDump)
```

Here we've created a table named `table_from_mysql` based on a structure that ClickHouse automatically inferred.  ClickHouse either detects types based on data or uses DDL when available:

```sql
DESCRIBE TABLE table_from_mysql;
```
```response
┌─name──┬─type─────────────┬─default_type─┬─default_expression─┬─comment─┬─codec_expression─┬─ttl_expression─┐
│ path  │ Nullable(String) │              │                    │         │                  │                │
│ month │ Nullable(Date32) │              │                    │         │                  │                │
│ hits  │ Nullable(UInt32) │              │                    │         │                  │                │
└───────┴──────────────────┴──────────────┴────────────────────┴─────────┴──────────────────┴────────────────┘
```

## Other formats 

ClickHouse introduces support for many formats, both text, and binary, to cover various scenarios and platforms. Explore more formats and ways to work with them in the following articles:

- [CSV and TSV formats](csv-tsv.md)
- [Parquet](parquet.md)
- [JSON formats](/integrations/data-ingestion/data-formats/json/intro.md)
- [Regex and templates](templates-regex.md)
- [Native and binary formats](binary.md)
- **SQL formats**

And also check [clickhouse-local](https://clickhouse.com/blog/extracting-converting-querying-local-files-with-sql-clickhouse-local) - a portable full-featured tool to work on local/remote files without the need for ClickHouse server.
