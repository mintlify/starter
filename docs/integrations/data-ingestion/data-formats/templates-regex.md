---
sidebarTitle: 'Regexp and templates'
sidebar_position: 3
slug: /integrations/data-formats/templates-regexp
title: 'Importing and exporting custom text data using Templates and Regex in ClickHouse'
description: 'Page describing how to import and export custom text using templates and regex in ClickHouse'
doc_type: 'guide'
keywords: ['data formats', 'templates', 'regex', 'custom formats', 'parsing']
---

We often have to deal with data in custom text formats. That could be a non-standard format, invalid JSON, or a broken CSV. Using standard parsers like CSV or JSON won't work in all such cases. But ClickHouse has us covered here with powerful Template and Regex formats.

## Importing based on a template 
Suppose we want to import data from the following [log file](assets/error.log):

```bash
head error.log
```
```response
2023/01/15 14:51:17 [error]  client: 7.2.8.1, server: example.com "GET /apple-touch-icon-120x120.png HTTP/1.1"
2023/01/16 06:02:09 [error]  client: 8.4.2.7, server: example.com "GET /apple-touch-icon-120x120.png HTTP/1.1"
2023/01/15 13:46:13 [error]  client: 6.9.3.7, server: example.com "GET /apple-touch-icon.png HTTP/1.1"
2023/01/16 05:34:55 [error]  client: 9.9.7.6, server: example.com "GET /h5/static/cert/icon_yanzhengma.png HTTP/1.1"
```

We can use a [Template](/interfaces/formats/Template) format to import this data. We have to define a template string with values placeholders for each row of input data:

```response
<time> [error] client: <ip>, server: <host> "<request>"
```

Let's create a table to import our data into:
```sql
CREATE TABLE error_log
(
    `time` DateTime,
    `ip` String,
    `host` String,
    `request` String
)
ENGINE = MergeTree
ORDER BY (host, request, time)
```

To import data using a given template, we have to save our template string in a file ([row.template](assets/row.template) in our case):

```response
${time:Escaped} [error]  client: ${ip:CSV}, server: ${host:CSV} ${request:JSON}
```

We define a name of a column and escaping rule in a `${name:escaping}` format. Multiple options are available here, like CSV, JSON, Escaped, or Quoted, which implement [respective escaping rules](/interfaces/formats/Template).

Now we can use the given file as an argument to the `format_template_row` settings option while importing data (*note, that template and data files **should not have** an extra `\n` symbol at the end of file*):

```sql
INSERT INTO error_log FROM INFILE 'error.log'
SETTINGS format_template_row = 'row.template'
FORMAT Template
```

And we can make sure our data was loaded into the table:

```sql
SELECT
    request,
    count(*)
FROM error_log
GROUP BY request
```
```response
┌─request──────────────────────────────────────────┬─count()─┐
│ GET /img/close.png HTTP/1.1                      │     176 │
│ GET /h5/static/cert/icon_yanzhengma.png HTTP/1.1 │     172 │
│ GET /phone/images/icon_01.png HTTP/1.1           │     139 │
│ GET /apple-touch-icon-precomposed.png HTTP/1.1   │     161 │
│ GET /apple-touch-icon.png HTTP/1.1               │     162 │
│ GET /apple-touch-icon-120x120.png HTTP/1.1       │     190 │
└──────────────────────────────────────────────────┴─────────┘
```

### Skipping whitespaces 
Consider using [TemplateIgnoreSpaces](/interfaces/formats/TemplateIgnoreSpaces), which allows skipping whitespaces between delimiters in a template:
```text
Template:               -->  "p1: ${p1:CSV}, p2: ${p2:CSV}"
TemplateIgnoreSpaces    -->  "p1:${p1:CSV}, p2:${p2:CSV}"
```

## Exporting data using templates 

We can also export data to any text format using templates as well. In this case, we have to create two files:

[Result set template](assets/output.results), which defines the layout for the whole result set:

```response
== Top 10 IPs ==
${data}
--- ${rows_read:XML} rows read in ${time:XML} ---
```

Here, `rows_read` and `time` are system metrics available for each request. While `data` stands for generated rows (`${data}` should always come as a first placeholder in this file), based on a template defined in a [**row template file**](assets/output.rows):

```response
${ip:Escaped} generated ${total:Escaped} requests
```

Now let's use these templates to export the following query:

```sql
SELECT
    ip,
    count() AS total
FROM error_log GROUP BY ip ORDER BY total DESC LIMIT 10
FORMAT Template SETTINGS format_template_resultset = 'output.results',
                         format_template_row = 'output.rows';

== Top 10 IPs ==

9.8.4.6 generated 3 requests
9.5.1.1 generated 3 requests
2.4.8.9 generated 3 requests
4.8.8.2 generated 3 requests
4.5.4.4 generated 3 requests
3.3.6.4 generated 2 requests
8.9.5.9 generated 2 requests
2.5.1.8 generated 2 requests
6.8.3.6 generated 2 requests
6.6.3.5 generated 2 requests

--- 1000 rows read in 0.001380604 ---
```

### Exporting to HTML files 
Template-based results can also be exported to files using an [`INTO OUTFILE`](/sql-reference/statements/select/into-outfile.md) clause. Let's generate HTML files based on given [resultset](assets/html.results) and [row](assets/html.row) formats:

```sql
SELECT
    ip,
    count() AS total
FROM error_log GROUP BY ip ORDER BY total DESC LIMIT 10
INTO OUTFILE 'out.html'
FORMAT Template
SETTINGS format_template_resultset = 'html.results',
         format_template_row = 'html.row'
```

### Exporting to XML 

Template format can be used to generate all imaginable text format files, including XML. Just put a relevant template and do the export.

Also consider using an [XML](/interfaces/formats/XML) format to get standard XML results including metadata:

```sql
SELECT *
FROM error_log
LIMIT 3
FORMAT XML
```
```xml
<?xml version='1.0' encoding='UTF-8' ?>
<result>
        <meta>
                <columns>
                        <column>
                                <name>time</name>
                                <type>DateTime</type>
                        </column>
                        ...
                </columns>
        </meta>
        <data>
                <row>
                        <time>2023-01-15 13:00:01</time>
                        <ip>3.5.9.2</ip>
                        <host>example.com</host>
                        <request>GET /apple-touch-icon-120x120.png HTTP/1.1</request>
                </row>
                ...
        </data>
        <rows>3</rows>
        <rows_before_limit_at_least>1000</rows_before_limit_at_least>
        <statistics>
                <elapsed>0.000745001</elapsed>
                <rows_read>1000</rows_read>
                <bytes_read>88184</bytes_read>
        </statistics>
</result>

```

## Importing data based on regular expressions 

[Regexp](/interfaces/formats/Regexp) format addresses more sophisticated cases when input data needs to be parsed in a more complex way. Let's parse our [error.log](assets/error.log) example file, but capture the file name and protocol this time to save them into separate columns. First, let's prepare a new table for that:

```sql
CREATE TABLE error_log
(
    `time` DateTime,
    `ip` String,
    `host` String,
    `file` String,
    `protocol` String
)
ENGINE = MergeTree
ORDER BY (host, file, time)
```

Now we can import data based on a regular expression:

```sql
INSERT INTO error_log FROM INFILE 'error.log'
SETTINGS
  format_regexp = '(.+?) \\[error\\]  client: (.+), server: (.+?) "GET .+?([^/]+\\.[^ ]+) (.+?)"'
FORMAT Regexp
```

ClickHouse will insert data from each capture group into the relevant column based on its order. Let's check the data:

```sql
SELECT * FROM error_log LIMIT 5
```
```response
┌────────────────time─┬─ip──────┬─host────────┬─file─────────────────────────┬─protocol─┐
│ 2023-01-15 13:00:01 │ 3.5.9.2 │ example.com │ apple-touch-icon-120x120.png │ HTTP/1.1 │
│ 2023-01-15 13:01:40 │ 3.7.2.5 │ example.com │ apple-touch-icon-120x120.png │ HTTP/1.1 │
│ 2023-01-15 13:16:49 │ 9.2.9.2 │ example.com │ apple-touch-icon-120x120.png │ HTTP/1.1 │
│ 2023-01-15 13:21:38 │ 8.8.5.3 │ example.com │ apple-touch-icon-120x120.png │ HTTP/1.1 │
│ 2023-01-15 13:31:27 │ 9.5.8.4 │ example.com │ apple-touch-icon-120x120.png │ HTTP/1.1 │
└─────────────────────┴─────────┴─────────────┴──────────────────────────────┴──────────┘
```

By default, ClickHouse will raise an error in case of unmatched rows. If you want to skip unmatched rows instead, enable it using [format_regexp_skip_unmatched](/operations/settings/settings-formats.md/#format_regexp_skip_unmatched) option:

```sql
SET format_regexp_skip_unmatched = 1;
```

## Other formats 

ClickHouse introduces support for many formats, both text, and binary, to cover various scenarios and platforms. Explore more formats and ways to work with them in the following articles:

- [CSV and TSV formats](csv-tsv.md)
- [Parquet](parquet.md)
- [JSON formats](/integrations/data-ingestion/data-formats/json/intro.md)
- **Regex and templates**
- [Native and binary formats](binary.md)
- [SQL formats](sql.md)

And also check [clickhouse-local](https://clickhouse.com/blog/extracting-converting-querying-local-files-with-sql-clickhouse-local) - a portable full-featured tool to work on local/remote files without the need for Clickhouse server.
