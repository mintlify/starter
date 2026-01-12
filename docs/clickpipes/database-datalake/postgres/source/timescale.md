---
sidebarTitle: 'Timescale'
description: 'Set up Postgres with the TimescaleDB extension as a source for ClickPipes'
slug: /integrations/clickpipes/postgres/source/timescale
title: 'Postgres with TimescaleDB source setup guide'
keywords: ['TimescaleDB']
doc_type: 'guide'
icon: "rectangle-beta"
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'

<BetaBadge/>

## Background 

[TimescaleDB](https://github.com/timescale/timescaledb) is an open-source Postgres extension developed by Timescale Inc 
that aims to boost the performance of analytics queries without having to move away from Postgres. This is achieved by 
creating "hypertables" which are managed by the extension and support automatic partitioning into "chunks". 
Hypertables also support transparent compression and hybrid row-columnar storage (known as "hypercore"), although these
features require a version of the extension that has a proprietary license.

Timescale Inc also offers two managed services for TimescaleDB: 
- `Managed Service for Timescale`
- `Timescale Cloud`. 

There are third-party vendors offering managed services that allow you to use the TimescaleDB extension, but due to 
 licensing, these vendors only support the open-source version of the extension.

Timescale hypertables behave differently from regular Postgres tables in several ways. This poses some complications 
to the process of replicating them, which is why the ability to replicate Timescale hypertables should be considered as 
**best effort**.

## Supported Postgres versions 

ClickPipes supports Postgres version 12 and later.

## Enable logical replication 

The steps to be follow depend on how your Postgres instance with TimescaleDB is deployed. 

- If you're using a managed service and your provider is listed in the sidebar, please follow the guide for that provider.
- If you're deploying TimescaleDB yourself, follow the generic guide. 

For other managed services, please raise a support ticket with your provider to help in enabling logical replication if 
it isn't already.

<Note>
Timescale Cloud does not support enabling logical replication, which is needed for Postgres pipes in CDC mode.
As a result, users of Timescale Cloud can only perform a one-time load of their data (`Initial Load Only`) with the
Postgres ClickPipe.
</Note>

## Configuration 

Timescale hypertables don't store any data inserted into them. Instead, the data is stored in multiple corresponding 
"chunk" tables which are in the `_timescaledb_internal` schema. For running queries on the hypertables, this is not an
issue. But during logical replication, instead of detecting changes in the hypertable we detect them in the chunk table
instead. The Postgres ClickPipe has logic to automatically remap changes from the chunk tables to the parent hypertable,
but this requires additional steps.

<Note>
If you'd like to only perform a one-time load of your data (`Initial Load Only`), please skip steps 2 onward.
</Note>

1. Create a Postgres user for the pipe and grant it permissions to `SELECT` the tables you wish to replicate.

```sql
  CREATE USER clickpipes_user PASSWORD 'clickpipes_password';
  GRANT USAGE ON SCHEMA "public" TO clickpipes_user;
  -- If desired, you can refine these GRANTs to individual tables alone, instead of the entire schema
  -- But when adding new tables to the ClickPipe, you'll need to add them to the user as well.
  GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO clickpipes_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO clickpipes_user;
```

<Note>
Make sure to replace `clickpipes_user` and `clickpipes_password` with your desired username and password.
</Note>

2. As a Postgres superuser/admin user, create a publication on the source instance that has the tables and hypertables 
   you want to replicate and **also includes the entire `_timescaledb_internal` schema**. While creating the ClickPipe, you need to select this publication.

```sql
-- When adding new tables to the ClickPipe, you'll need to add them to the publication as well manually. 
  CREATE PUBLICATION clickpipes_publication FOR TABLE <...>, <...>, TABLES IN SCHEMA _timescaledb_internal;
```

<Tip>
We don't recommend creating a publication `FOR ALL TABLES`, this leads to more traffic from Postgres to ClickPipes (to sending changes for other tables not in the pipe) and reduces overall efficiency.

For manually created publications, please add any tables you want to the publication before adding them to the pipe.
</Tip>

<Note>
Some managed services don't give their admin users the required permissions to create a publication for an entire schema.
If this is the case, please raise a support ticket with your provider. Alternatively, you can skip this step and the following 
steps and perform a one-time load of your data.
</Note>

3. Grant replication permissions to the user created earlier.

```sql
-- Give replication permission to the USER
  ALTER USER clickpipes_user REPLICATION;
```

After these steps, you should be able to proceed with [creating a ClickPipe](../index.md).

## Configure network access 

If you want to restrict traffic to your Timescale instance, please allowlist the [documented static NAT IPs](../../index.md#list-of-static-ips).
Instructions to do this will vary across providers, please consult the sidebar if your provider is listed or raise a 
ticket with them.
