---
keywords: ['clickhouse', 'python', 'client', 'connect', 'integrate']
slug: /integrations/python
description: 'The ClickHouse Connect project suite for connecting Python to ClickHouse'
title: 'Python Integration with ClickHouse Connect'
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'language_client'
  - website: 'https://github.com/ClickHouse/clickhouse-connect'
---

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';


ClickHouse Connect is a core database driver providing interoperability with a wide range of Python applications.

- The main interface is the `Client` object in the package `clickhouse_connect.driver`. That core package also includes assorted helper classes and utility functions used for communicating with the ClickHouse server and "context" implementations for advanced management of insert and select queries.
- The `clickhouse_connect.datatypes` package provides a base implementation and subclasses for all non-experimental ClickHouse datatypes. Its primary functionality is serialization and deserialization of ClickHouse data into the ClickHouse "Native" binary columnar format, used to achieve the most efficient transport between ClickHouse and client applications.
- The Cython/C classes in the `clickhouse_connect.cdriver` package optimize some of the most common serializations and deserializations for significantly improved performance over pure Python.
- There is a [SQLAlchemy](https://www.sqlalchemy.org/) dialect in the package `clickhouse_connect.cc_sqlalchemy` which is built off of the `datatypes` and `dbi` packages. This implementation supports SQLAlchemy Core functionality including `SELECT` queries with `JOIN`s (`INNER`, `LEFT OUTER`, `FULL OUTER`, `CROSS`), `WHERE` clauses, `ORDER BY`, `LIMIT`/`OFFSET`, `DISTINCT` operations, lightweight `DELETE` statements with `WHERE` conditions, table reflection, and basic DDL operations (`CREATE TABLE`, `CREATE`/`DROP DATABASE`). While it does not support advanced ORM features or advanced DDL features, it provides robust query capabilities suitable for most analytical workloads against ClickHouse's OLAP-oriented database.
- The core driver and [ClickHouse Connect SQLAlchemy](sqlalchemy.md) implementation are the preferred method for connecting ClickHouse to Apache Superset. Use the `ClickHouse Connect` database connection, or `clickhousedb` SQLAlchemy dialect connection string.

This documentation is current as of the clickhouse-connect release 0.9.2.

<Note>
The official ClickHouse Connect Python driver uses the HTTP protocol for communication with the ClickHouse server. This enables HTTP load balancer support and works well in enterprise environments with firewalls and proxies, but has slightly lower compression and performance compared to the native TCP-based protocol, and lacks support for some advanced features like query cancellation. For some use cases, you may consider using one of the [Community Python drivers](/interfaces/third-party/client-libraries.md) that use the native TCP-based protocol.
</Note>

## Requirements and compatibility [#requirements-and-compatibility]

|       Python |   |       Platform¹ |   |      ClickHouse |    | SQLAlchemy² |   | Apache Superset |   |  Pandas |   | Polars |   |
|-------------:|:--|----------------:|:--|----------------:|:---|------------:|:--|----------------:|:--|--------:|:--|-------:|:--|
| 2.x, &lt;3.9 | ❌ |     Linux (x86) | ✅ |       &lt;25.x³ | 🟡 |  &lt;1.4.40 | ❌ |         &lt;1.4 | ❌ | &ge;1.5 | ✅ |    1.x | ✅ |
|        3.9.x | ✅ | Linux (Aarch64) | ✅ |           25.x³ | 🟡 |  &ge;1.4.40 | ✅ |           1.4.x | ✅ |     2.x | ✅ |        |   |
|       3.10.x | ✅ |     macOS (x86) | ✅ |    25.3.x (LTS) | ✅  |     &ge;2.x | ✅ |           1.5.x | ✅ |         |   |        |   |
|       3.11.x | ✅ |     macOS (ARM) | ✅ | 25.6.x (Stable) | ✅  |             |   |           2.0.x | ✅ |         |   |        |   |
|       3.12.x | ✅ |         Windows | ✅ | 25.7.x (Stable) | ✅  |             |   |           2.1.x | ✅ |         |   |        |   |
|       3.13.x | ✅ |                 |   |    25.8.x (LTS) | ✅  |             |   |           3.0.x | ✅ |         |   |        |   |
|              |   |                 |   | 25.9.x (Stable) | ✅  |             |   |                 |   |         |   |        |   |

¹ClickHouse Connect has been explicitly tested against the listed platforms. In addition, untested binary wheels (with C optimization) are built for all architectures supported by the excellent [`cibuildwheel`](https://cibuildwheel.readthedocs.io/en/stable/) project. Finally, because ClickHouse Connect can also run as pure Python, the source installation should work on any recent Python installation.

²SQLAlchemy support is limited to Core functionality (queries, basic DDL). ORM features are not supported. See [SQLAlchemy Integration Support](sqlalchemy.md) docs for details.

³ClickHouse Connect generally works well with versions outside the officially supported range.

## Installation [#installation]

Install ClickHouse Connect from [PyPI](https://pypi.org/project/clickhouse-connect/) via pip:

`pip install clickhouse-connect`

ClickHouse Connect can also be installed from source:
* `git clone` the [GitHub repository](https://github.com/ClickHouse/clickhouse-connect).
* (Optional) run `pip install cython` to build and enable the C/Cython optimizations
* `cd` to the project root directory and run `pip install .`

## Support policy [#support-policy]

Please update to the latest version of ClickHouse Connect before reporting any issues. Issues should be filed in the [GitHub project](https://github.com/ClickHouse/clickhouse-connect/issues). Future releases of ClickHouse Connect are intended be compatible with actively supported ClickHouse versions at the time of release. Actively supported versions of ClickHouse server can be found [here](https://github.com/ClickHouse/ClickHouse/blob/master/SECURITY.md). If you're unsure what version of ClickHouse server to use, read this discussion [here](https://clickhouse.com/docs/knowledgebase/production#how-to-choose-between-clickhouse-releases). Our CI test matrix tests against the latest two LTS releases and the latest three stable releases. However, due to the HTTP protocol and minimal breaking changes between ClickHouse releases, ClickHouse Connect generally works well with server versions outside the officially supported range, though compatibility with certain advanced data types may vary.

## Basic usage [#basic-usage]

### Gather your connection details [#gather-your-connection-details]

<GatherYourDetailsHttp />

### Establish a connection [#establish-a-connection]

There are two examples shown for connecting to ClickHouse:
- Connecting to a ClickHouse server on localhost.
- Connecting to a ClickHouse Cloud service.

#### Use a ClickHouse Connect client instance to connect to a ClickHouse server on localhost: [#use-a-clickhouse-connect-client-instance-to-connect-to-a-clickhouse-server-on-localhost]

```python
import clickhouse_connect

client = clickhouse_connect.get_client(host='localhost', username='default', password='password')
```

#### Use a ClickHouse Connect client instance to connect to a ClickHouse Cloud service: [#use-a-clickhouse-connect-client-instance-to-connect-to-a-clickhouse-cloud-service]

<Tip>
Use the connection details gathered earlier. ClickHouse Cloud services require TLS, so use port 8443.
</Tip>

```python
import clickhouse_connect

client = clickhouse_connect.get_client(host='HOSTNAME.clickhouse.cloud', port=8443, username='default', password='your password')
```

### Interact with your database [#interact-with-your-database]

To run a ClickHouse SQL command, use the client `command` method:

```python
client.command('CREATE TABLE new_table (key UInt32, value String, metric Float64) ENGINE MergeTree ORDER BY key')
```

To insert batch data, use the client `insert` method with a two-dimensional array of rows and values:

```python
row1 = [1000, 'String Value 1000', 5.233]
row2 = [2000, 'String Value 2000', -107.04]
data = [row1, row2]
client.insert('new_table', data, column_names=['key', 'value', 'metric'])
```

To retrieve data using ClickHouse SQL, use the client `query` method:

```python
result = client.query('SELECT max(key), avg(metric) FROM new_table')
print(result.result_rows)
# Output: [(2000, -50.9035)]
```
