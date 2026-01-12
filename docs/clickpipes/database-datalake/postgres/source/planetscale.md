---
sidebarTitle: 'Planetscale for Postgres'
description: 'Set up Planetscale for Postgres as a source for ClickPipes'
slug: /integrations/clickpipes/postgres/source/planetscale
title: 'PlanetScale for Postgres source setup guide'
doc_type: 'guide'
keywords: ['clickpipes', 'postgresql', 'cdc', 'data ingestion', 'real-time sync']
---

<Note>
PlanetScale for Postgres is currently in [early access](https://planetscale.com/postgres).
</Note>

## Supported Postgres versions 

ClickPipes supports Postgres version 12 and later.

## Enable logical replication 

1. To enable replication on your Postgres instance, we need to make sure that the following settings are set:

    ```sql
    wal_level = logical
    ```
   To check the same, you can run the following SQL command:
    ```sql
    SHOW wal_level;
    ```

   The output should be `logical` by default. If not, please log into the PlanetScale console and go to `Cluster configuration->Parameters` and scroll down to `Write-ahead log` to change it.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/source/planetscale/planetscale_wal_level_logical.png" alt="Adjusting wal_level in PlanetScale console"/>

<Warning>
Changing this in the PlanetScale console WILL trigger a restart.
</Warning>

2. Additionally, it is recommended to increase the setting `max_slot_wal_keep_size` from its default of 4GB. This is also done via the PlanetScale console by going to `Cluster configuration->Parameters` and then scroll down to `Write-ahead log`. To help determine the new value, please take a look [here](../faq#recommended-max_slot_wal_keep_size-settings).

<img src="/images/integrations/data-ingestion/clickpipes/postgres/source/planetscale/planetscale_max_slot_wal_keep_size.png" alt="Adjusting max_slot_wal_keep_size in PlanetScale console"/>

## Creating a user with permissions and publication 

Let's create a new user for ClickPipes with the necessary permissions suitable for CDC,
and also create a publication that we'll use for replication.

For this, you can connect to your PlanetScale Postgres instance using the default `postgres.<...>` user and run the following SQL commands:
```sql
  CREATE USER clickpipes_user PASSWORD 'clickpipes_password';
  GRANT USAGE ON SCHEMA "public" TO clickpipes_user;
-- You may need to grant these permissions on more schemas depending on the tables you're moving
  GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO clickpipes_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO clickpipes_user;

-- Give replication permission to the USER
  ALTER USER clickpipes_user REPLICATION;

-- Create a publication. We will use this when creating the pipe
-- When adding new tables to the ClickPipe, you'll need to manually add them to the publication as well. 
  CREATE PUBLICATION clickpipes_publication FOR TABLE <...>, <...>, <...>;
```
<Note>
Make sure to replace `clickpipes_user` and `clickpipes_password` with your desired username and password.
</Note>

## Caveats 
1. To connect to PlanetScale Postgres, the current branch needs to be appended to the username created above. For example, if the created user was named `clickpipes_user`, the actual user provided during the ClickPipe creation needs to be `clickpipes_user`.`branch` where `branch` refers to the "id" of the current PlanetScale Postgres [branch](https://planetscale.com/docs/postgres/branching). To quickly determine this, you can refer to the username of the `postgres` user you used to create the user earlier, the part after the period would be the branch id.
2. Do not use the `PSBouncer` port (currently `6432`) for CDC pipes connecting to PlanetScale Postgres, the normal port `5432` must be used. Either port may be used for initial-load only pipes.
3. Please ensure you're connecting only to the primary instance, [connecting to replica instances](https://planetscale.com/docs/postgres/scaling/replicas#how-to-query-postgres-replicas) is currently not supported. 

## What's next? 

You can now [create your ClickPipe](../index.md) and start ingesting data from your Postgres instance into ClickHouse Cloud.
Make sure to note down the connection details you used while setting up your Postgres instance as you will need them during the ClickPipe creation process.
