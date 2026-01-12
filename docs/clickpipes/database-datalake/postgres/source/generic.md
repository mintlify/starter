---
sidebarTitle: 'Generic Postgres'
description: 'Set up any Postgres instance as a source for ClickPipes'
slug: /integrations/clickpipes/postgres/source/generic
title: 'Generic Postgres source setup guide'
doc_type: 'guide'
keywords: ['postgres', 'clickpipes', 'logical replication', 'pg_hba.conf', 'wal level']
---

<Note>

If you use one of the supported providers (in the sidebar), please refer to the specific guide for that provider.

</Note>

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

   The output should be `logical`. If not, run:
    ```sql
    ALTER SYSTEM SET wal_level = logical;
    ```

2. Additionally, the following settings are recommended to be set on the Postgres instance:
    ```sql
    max_wal_senders > 1
    max_replication_slots >= 4
    ```
   To check the same, you can run the following SQL commands:
    ```sql
    SHOW max_wal_senders;
    SHOW max_replication_slots;
    ```

   If the values do not match the recommended values, you can run the following SQL commands to set them:
    ```sql
    ALTER SYSTEM SET max_wal_senders = 10;
    ALTER SYSTEM SET max_replication_slots = 10;
    ```
3. If you have made any changes to the configuration as mentioned above, you NEED to RESTART the Postgres instance for the changes to take effect.

## Creating a user with permissions and publication 

Let's create a new user for ClickPipes with the necessary permissions suitable for CDC,
and also create a publication that we'll use for replication.

For this, you can connect to your Postgres instance and run the following SQL commands:
```sql
  CREATE USER clickpipes_user PASSWORD 'clickpipes_password';
  GRANT USAGE ON SCHEMA "public" TO clickpipes_user;
  GRANT SELECT ON ALL TABLES IN SCHEMA "public" TO clickpipes_user;
  ALTER DEFAULT PRIVILEGES IN SCHEMA "public" GRANT SELECT ON TABLES TO clickpipes_user;

-- Give replication permission to the USER
  ALTER USER clickpipes_user REPLICATION;

-- Create a publication. We will use this when creating the pipe
  CREATE PUBLICATION clickpipes_publication FOR ALL TABLES;
```
<Note>

Make sure to replace `clickpipes_user` and `clickpipes_password` with your desired username and password.

</Note>

## Enabling connections in pg_hba.conf to the ClickPipes User 

If you are self serving, you need to allow connections to the ClickPipes user from the ClickPipes IP addresses by following the below steps. If you are using a managed service, you can do the same by following the provider's documentation.

1. Make necessary changes to the `pg_hba.conf` file to allow connections to the ClickPipes user from the ClickPipes IP addresses. An example entry in the `pg_hba.conf` file would look like:
    ```response
    host    all   clickpipes_user     0.0.0.0/0          scram-sha-256
    ```

2. Reload the PostgreSQL instance for the changes to take effect:
    ```sql
    SELECT pg_reload_conf();
    ```

## Increase `max_slot_wal_keep_size` 

This is a recommended configuration change to ensure that large transactions/commits do not cause the replication slot to be dropped.

You can increase the `max_slot_wal_keep_size` parameter for your PostgreSQL instance to a higher value (at least 100GB or `102400`) by updating the `postgresql.conf` file.

```sql
max_slot_wal_keep_size = 102400
```

You can reload the Postgres instance for the changes to take effect:
```sql
SELECT pg_reload_conf();
```

<Note>

For better recommendation of this value you can contact the ClickPipes team.

</Note>

## What's next? 

You can now [create your ClickPipe](../index.md) and start ingesting data from your Postgres instance into ClickHouse Cloud.
Make sure to note down the connection details you used while setting up your Postgres instance as you will need them during the ClickPipe creation process.
