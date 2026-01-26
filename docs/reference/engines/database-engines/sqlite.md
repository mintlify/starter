---
description: 'Allows to connect to SQLite databases and perform `INSERT` and `SELECT`
  queries to exchange data between ClickHouse and SQLite.'
sidebarTitle: 'SQLite'
sidebar_position: 55
slug: /engines/database-engines/sqlite
title: 'SQLite'
doc_type: 'reference'
---

Allows to connect to [SQLite](https://www.sqlite.org/index.html) database and perform `INSERT` and `SELECT` queries to exchange data between ClickHouse and SQLite.

## Creating a database 

```sql
    CREATE DATABASE sqlite_database
    ENGINE = SQLite('db_path')
```

**Engine Parameters**

- `db_path` — Path to a file with SQLite database.

## Data types support 

|  SQLite   | ClickHouse                                              |
|---------------|---------------------------------------------------------|
| INTEGER       | [Int32](../../sql-reference/data-types/int-uint.md)     |
| REAL          | [Float32](../../sql-reference/data-types/float.md)      |
| TEXT          | [String](../../sql-reference/data-types/string.md)      |
| BLOB          | [String](../../sql-reference/data-types/string.md)      |

## Specifics and recommendations 

SQLite stores the entire database (definitions, tables, indices, and the data itself) as a single cross-platform file on a host machine. During writing SQLite locks the entire database file, therefore write operations are performed sequentially. Read operations can be multi-tasked.
SQLite does not require service management (such as startup scripts) or access control based on `GRANT` and passwords. Access control is handled by means of file-system permissions given to the database file itself.

## Usage example 

Database in ClickHouse, connected to the SQLite:

```sql
CREATE DATABASE sqlite_db ENGINE = SQLite('sqlite.db');
SHOW TABLES FROM sqlite_db;
```

```text
┌──name───┐
│ table1  │
│ table2  │
└─────────┘
```

Shows the tables:

```sql
SELECT * FROM sqlite_db.table1;
```

```text
┌─col1──┬─col2─┐
│ line1 │    1 │
│ line2 │    2 │
│ line3 │    3 │
└───────┴──────┘
```
Inserting data into SQLite table from ClickHouse table:

```sql
CREATE TABLE clickhouse_table(`col1` String,`col2` Int16) ENGINE = MergeTree() ORDER BY col2;
INSERT INTO clickhouse_table VALUES ('text',10);
INSERT INTO sqlite_db.table1 SELECT * FROM clickhouse_table;
SELECT * FROM sqlite_db.table1;
```

```text
┌─col1──┬─col2─┐
│ line1 │    1 │
│ line2 │    2 │
│ line3 │    3 │
│ text  │   10 │
└───────┴──────┘
```
