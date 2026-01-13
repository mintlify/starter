---
slug: /use-cases/data-lake/unity-catalog
sidebar_label: 'Unity catalog'
title: 'Unity catalog'
pagination_prev: null
pagination_next: null
description: 'In this guide, we will walk you through the steps to query
 your data in S3 buckets using ClickHouse and the Unity Catalog.'
keywords: ['Unity', 'Data Lake']
show_related_blogs: true
doc_type: 'guide'
---

import BetaBadge from '@theme/badges/BetaBadge';

<BetaBadge/>

:::note
Integration with the Unity Catalog works for managed and external tables.
This integration is currently only supported on AWS.
:::

ClickHouse supports integration with multiple catalogs (Unity, Glue, Polaris, etc.). This guide will walk you through the steps to query your data managed by Databricks using ClickHouse and the [Unity Catalog](https://www.databricks.com/product/unity-catalog). 

Databricks supports multiple data formats for their lakehouse. With ClickHouse, you can query Unity Catalog tables as both Delta and Iceberg.

:::note
As this feature is experimental, you will need to enable it using:
`SET allow_experimental_database_unity_catalog = 1;`
:::

## Configuring Unity in Databricks

To allow ClickHouse to interact with the Unity catalog, you need to make sure the Unity Catalog is configured to allow interaction with an external reader. This can be achieved by following the[ "Enable external data access to Unity Catalog"](https://docs.databricks.com/aws/en/external-access/admin) guide.

In addition to enabling external access, ensure the principal configuring the integration has the `EXTERNAL USE SCHEMA` [privilege](https://docs.databricks.com/aws/en/external-access/admin#external-schema) on the schema containing the tables.

Once your catalog is configured, you must generate credentials for ClickHouse. Two different methods can be used, depending on your interaction mode with Unity:

* For Iceberg clients, use authentication as a [service principal](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m).

* For Delta clients, use a Personal Access Token ([PAT](https://docs.databricks.com/aws/en/dev-tools/auth/pat)).

## Creating a connection between Unity Catalog and ClickHouse

With your Unity Catalog configured and authentication in place, establish a connection between ClickHouse and Unity Catalog.

### Read Delta

```sql
CREATE DATABASE unity
ENGINE = DataLakeCatalog('https://<workspace-id>.cloud.databricks.com/api/2.1/unity-catalog')
SETTINGS warehouse = 'CATALOG_NAME', catalog_credential = '<PAT>', catalog_type = 'unity'
```

### Read Iceberg

```sql
CREATE DATABASE unity
ENGINE = DataLakeCatalog('https://<workspace-id>.cloud.databricks.com/api/2.1/unity-catalog/iceberg')
SETTINGS catalog_type = 'rest', catalog_credential = '<client-id>:<client-secret>', warehouse = 'workspace', 
oauth_server_uri = 'https://<workspace-id>.cloud.databricks.com/oidc/v1/token', auth_scope = 'all-apis,sql'
```

## Querying Unity catalog tables using ClickHouse

Now that the connection is in place, you can start querying via the Unity catalog. For example:

```sql
USE unity;

SHOW TABLES;

┌─name───────────────────────────────────────────────┐
│ clickbench.delta_hits                              │
│ demo.fake_user                                     │
│ information_schema.catalog_privileges              │
│ information_schema.catalog_tags                    │
│ information_schema.catalogs                        │
│ information_schema.check_constraints               │
│ information_schema.column_masks                    │
│ information_schema.column_tags                     │
│ information_schema.columns                         │
│ information_schema.constraint_column_usage         │
│ information_schema.constraint_table_usage          │
│ information_schema.information_schema_catalog_name │
│ information_schema.key_column_usage                │
│ information_schema.parameters                      │
│ information_schema.referential_constraints         │
│ information_schema.routine_columns                 │
│ information_schema.routine_privileges              │
│ information_schema.routines                        │
│ information_schema.row_filters                     │
│ information_schema.schema_privileges               │
│ information_schema.schema_tags                     │
│ information_schema.schemata                        │
│ information_schema.table_constraints               │
│ information_schema.table_privileges                │
│ information_schema.table_tags                      │
│ information_schema.tables                          │
│ information_schema.views                           │
│ information_schema.volume_privileges               │
│ information_schema.volume_tags                     │
│ information_schema.volumes                         │
│ uniform.delta_hits                                 │
└────────────────────────────────────────────────────┘
```

If you're using the Iceberg client, only the Delta tables with Uniform-enabled will be shown:

```sql
SHOW TABLES

┌─name───────────────┐
│ uniform.delta_hits │
└────────────────────┘
```

To query a table:

```sql
SELECT count(*) FROM `uniform.delta_hits`
```

:::note Backticks required
Backticks are required because ClickHouse doesn't support more than one namespace.
:::

To inspect the table DDL:

```sql
SHOW CREATE TABLE `uniform.delta_hits`

CREATE TABLE unity_uniform.`uniform.delta_hits`
(
    `WatchID` Int64,
    `JavaEnable` Int32,
    `Title` String,
    `GoodEvent` Int32,
    `EventTime` DateTime64(6, 'UTC'),
    `EventDate` Date,
    `CounterID` Int32,
    `ClientIP` Int32,
    ...
    `FromTag` String,
    `HasGCLID` Int32,
    `RefererHash` Int64,
    `URLHash` Int64,
    `CLID` Int32
)
ENGINE = Iceberg('s3://<path>);

```

## Loading data from your Data Lake into ClickHouse

If you need to load data from Databricks into ClickHouse, start by creating a local ClickHouse table:

```sql
CREATE TABLE hits
(
    `WatchID` Int64,
    `JavaEnable` Int32,
    `Title` String,
    `GoodEvent` Int32,
    `EventTime` DateTime64(6, 'UTC'),
    `EventDate` Date,
    `CounterID` Int32,
    `ClientIP` Int32,
    ...
    `FromTag` String,
    `HasGCLID` Int32,
    `RefererHash` Int64,
    `URLHash` Int64,
    `CLID` Int32
)
PRIMARY KEY (CounterID, EventDate, UserID, EventTime, WatchID);
```

Then load the data from your Unity Catalog table via an `INSERT INTO SELECT`:

```sql
INSERT INTO hits SELECT * FROM unity_uniform.`uniform.delta_hits`;
```
