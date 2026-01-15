---
sidebarTitle: 'FAQ'
description: 'Frequently asked questions about ClickPipes for Postgres.'
slug: /integrations/clickpipes/postgres/faq
sidebar_position: 2
title: 'ClickPipes for Postgres FAQ'
keywords: ['postgres faq', 'clickpipes', 'toast columns', 'replication slot', 'publications']
doc_type: 'reference'
---

<AccordionGroup>
<Accordion title="How does idling affect my Postgres CDC ClickPipe?">
### How does idling affect my Postgres CDC ClickPipe? 

If your ClickHouse Cloud service is idling, your Postgres CDC ClickPipe will continue to sync data, your service will wake-up at the next sync interval to handle the incoming data. Once the sync is finished and the idle period is reached, your service will go back to idling.

As an example, if your sync interval is set to 30 mins and your service idle time is set to 10 mins, Your service will wake-up every 30 mins and be active for 10 mins, then go back to idling.
</Accordion>

<Accordion title="How are TOAST columns handled in ClickPipes for Postgres?">
### How are TOAST columns handled in ClickPipes for Postgres? 

Please refer to the [Handling TOAST Columns](./toast) page for more information.
</Accordion>

<Accordion title="How are generated columns handled in ClickPipes for Postgres?">
### How are generated columns handled in ClickPipes for Postgres? 

Please refer to the [Postgres Generated Columns: Gotchas and Best Practices](./generated_columns) page for more information.
</Accordion>

<Accordion title="Do tables need to have primary keys to be part of Postgres CDC?">
### Do tables need to have primary keys to be part of Postgres CDC? 

For a table to be replicated using ClickPipes for Postgres, it must have either a primary key or a [REPLICA IDENTITY](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) defined.

- **Primary Key**: The most straightforward approach is to define a primary key on the table. This provides a unique identifier for each row, which is crucial for tracking updates and deletions. You can have REPLICA IDENTITY set to `DEFAULT` (the default behavior) in this case.
- **Replica Identity**: If a table does not have a primary key, you can set a replica identity. The replica identity can be set to `FULL`, which means that the entire row will be used to identify changes. Alternatively, you can set it to use a unique index if one exists on the table, and then set REPLICA IDENTITY to `USING INDEX index_name`.
To set the replica identity to FULL, you can use the following SQL command:
```sql
ALTER TABLE your_table_name REPLICA IDENTITY FULL;
```
REPLICA IDENTITY FULL also enables replication of unchanged TOAST columns. More on that [here](./toast).

Note that using `REPLICA IDENTITY FULL` can have performance implications and also faster WAL growth, especially for tables without a primary key and with frequent updates or deletes, as it requires more data to be logged for each change. If you have any doubts or need assistance with setting up primary keys or replica identities for your tables, please reach out to our support team for guidance.

It's important to note that if neither a primary key nor a replica identity is defined, ClickPipes will not be able to replicate changes for that table, and you may encounter errors during the replication process. Therefore, it's recommended to review your table schemas and ensure that they meet these requirements before setting up your ClickPipe.
</Accordion>

<Accordion title="Do you support partitioned tables as part of Postgres CDC?">
### Do you support partitioned tables as part of Postgres CDC? 

Yes, partitioned tables are supported out of the box, as long as they have a PRIMARY KEY or REPLICA IDENTITY defined. The PRIMARY KEY and REPLICA IDENTITY must be present on both the parent table and its partitions. You can read more about it [here](https://blog.peerdb.io/real-time-change-data-capture-for-postgres-partitioned-tables).
</Accordion>

<Accordion title="Can I connect Postgres databases that don't have a public IP or are in private networks?">
### Can I connect Postgres databases that don't have a public IP or are in private networks? 

Yes! ClickPipes for Postgres offers two ways to connect to databases in private networks:

1. **SSH Tunneling**
   - Works well for most use cases
   - See the setup instructions [here](/integrations/clickpipes/postgres#adding-your-source-postgres-database-connection)
   - Works across all regions

2. **AWS PrivateLink**
   - Available in three AWS regions:
     - us-east-1
     - us-east-2
     - eu-central-1
   - For detailed setup instructions, see our [PrivateLink documentation](/knowledgebase/aws-privatelink-setup-for-clickpipes)
   - For regions where PrivateLink is not available, please use SSH tunneling
</Accordion>

<Accordion title="How do you handle UPDATEs and DELETEs?">
### How do you handle UPDATEs and DELETEs? 

ClickPipes for Postgres captures both INSERTs and UPDATEs from Postgres as new rows with different versions (using the `_peerdb_` version column) in ClickHouse. The ReplacingMergeTree table engine periodically performs deduplication in the background based on the ordering key (ORDER BY columns), retaining only the row with the latest `_peerdb_` version.

DELETEs from Postgres are propagated as new rows marked as deleted (using the `_peerdb_is_deleted` column). Since the deduplication process is asynchronous, you might temporarily see duplicates. To address this, you need to handle deduplication at the query layer.

Also note that by default, Postgres does not send column values of columns that are not part of the primary key or replica identity during DELETE operations. If you want to capture the full row data during DELETEs, you can set the [REPLICA IDENTITY](https://www.postgresql.org/docs/current/sql-altertable.html#SQL-ALTERTABLE-REPLICA-IDENTITY) to FULL.

For more details, refer to:

* [ReplacingMergeTree table engine best practices](https://docs.peerdb.io/bestpractices/clickhouse_datamodeling#replacingmergetree-table-engine)
* [Postgres-to-ClickHouse CDC internals blog](https://clickhouse.com/blog/postgres-to-clickhouse-data-modeling-tips)
</Accordion>

<Accordion title="Can I update primary key columns in PostgreSQL?">
### Can I update primary key columns in PostgreSQL? 

<Warning>
Primary key updates in PostgreSQL cannot be properly replayed in ClickHouse by default.

This limitation exists because `ReplacingMergeTree` deduplication works based on the `ORDER BY` columns (which typically correspond to the primary key). When a primary key is updated in PostgreSQL, it appears as a new row with a different key in ClickHouse, rather than an update to the existing row. This can lead to both the old and new primary key values existing in your ClickHouse table.
</Warning>

Note that updating primary key columns is not a common practice in PostgreSQL database design, as primary keys are intended to be immutable identifiers. Most applications avoid primary key updates by design, making this limitation rarely encountered in typical use cases.

There is an experimental setting available that can enable primary key update handling, but it comes with significant performance implications and is not recommended for production use without careful consideration.

If your use case requires updating primary key columns in PostgreSQL and having those changes properly reflected in ClickHouse, please reach out to our support team at [db-integrations-support@clickhouse.com](mailto:db-integrations-support@clickhouse.com) to discuss your specific requirements and potential solutions.
</Accordion>

<Accordion title="Do you support schema changes?">
### Do you support schema changes? 

Please refer to the [ClickPipes for Postgres: Schema Changes Propagation Support](./schema-changes) page for more information.
</Accordion>

<Accordion title="What are the costs for ClickPipes for Postgres CDC?">
### What are the costs for ClickPipes for Postgres CDC? 

For detailed pricing information, please refer to the [ClickPipes for Postgres CDC pricing section on our main billing overview page](/cloud/reference/billing/clickpipes).
</Accordion>

<Accordion title="My replication slot size is growing or not decreasing; what might be the issue?">
### My replication slot size is growing or not decreasing; what might be the issue? 

If you're noticing that the size of your Postgres replication slot keeps increasing or isn't coming back down, it usually means that **WAL (Write-Ahead Log) records aren't being consumed (or "replayed") quickly enough** by your CDC pipeline or replication process. Below are the most common causes and how you can address them.

1. **Sudden Spikes in Database Activity**
   - Large batch updates, bulk inserts, or significant schema changes can quickly generate a lot of WAL data.
   - The replication slot will hold these WAL records until they are consumed, causing a temporary spike in size.

2. **Long-Running Transactions**
   - An open transaction forces Postgres to keep all WAL segments generated since the transaction began, which can dramatically increase slot size.
   - Set `statement_timeout` and `idle_in_transaction_session_timeout` to reasonable values to prevent transactions from staying open indefinitely:
     ```sql
     SELECT
         pid,
         state,
         age(now(), xact_start) AS transaction_duration,
         query AS current_query
     FROM
         pg_stat_activity
     WHERE
         xact_start IS NOT NULL
     ORDER BY
         age(now(), xact_start) DESC;
     ```
     Use this query to identify unusually long-running transactions.

3. **Maintenance or Utility Operations (e.g., `pg_repack`)**
   - Tools like `pg_repack` can rewrite entire tables, generating large amounts of WAL data in a short time.
   - Schedule these operations during slower traffic periods or monitor your WAL usage closely while they run.

4. **VACUUM and VACUUM ANALYZE**
   - Although necessary for database health, these operations can create extra WAL traffic—especially if they scan large tables.
   - Consider using autovacuum tuning parameters or scheduling manual VACUUM operations during off-peak hours.

5. **Replication Consumer Not Actively Reading the Slot**
   - If your CDC pipeline (e.g., ClickPipes) or another replication consumer stops, pauses, or crashes, WAL data will accumulate in the slot.
   - Ensure your pipeline is continuously running and check logs for connectivity or authentication errors.

For an excellent deep dive into this topic, check out our blog post: [Overcoming Pitfalls of Postgres Logical Decoding](https://blog.peerdb.io/overcoming-pitfalls-of-postgres-logical-decoding#heading-beware-of-replication-slot-growth-how-to-monitor-it).
</Accordion>

<Accordion title="How are Postgres data types mapped to ClickHouse?">
### How are Postgres data types mapped to ClickHouse? 

ClickPipes for Postgres aims to map Postgres data types as natively as possible on the ClickHouse side. This document provides a comprehensive list of each data type and its mapping: [Data Type Matrix](https://docs.peerdb.io/datatypes/datatype-matrix).
</Accordion>

<Accordion title="Can I define my own data type mapping while replicating data from Postgres to ClickHouse?">
### Can I define my own data type mapping while replicating data from Postgres to ClickHouse? 

Currently, we don't support defining custom data type mappings as part of the pipe. However, note that the default data type mapping used by ClickPipes is highly native. Most column types in Postgres are replicated as closely as possible to their native equivalents on ClickHouse. Integer array types in Postgres, for instance, are replicated as integer array types on ClickHouse.
</Accordion>

<Accordion title="How are JSON and JSONB columns replicated from Postgres?">
### How are JSON and JSONB columns replicated from Postgres? 

JSON and JSONB columns are replicated as String type in ClickHouse. Since ClickHouse supports a native [JSON type](/sql-reference/data-types/newjson), you can create a materialized view over the ClickPipes tables to perform the translation if needed. Alternatively, you can use [JSON functions](/sql-reference/functions/json-functions) directly on the String column(s). We are actively working on a feature that replicates JSON and JSONB columns directly to the JSON type in ClickHouse. This feature is expected to be available in a few months.
</Accordion>

<Accordion title="What happens to inserts when a mirror is paused?">
### What happens to inserts when a mirror is paused? 

When you pause the mirror, the messages are queued up in the replication slot on the source Postgres, ensuring they are buffered and not lost. However, pausing and resuming the mirror will re-establish the connection, which could take some time depending on the source.

During this process, both the sync (pulling data from Postgres and streaming it into the ClickHouse raw table) and normalize (from raw table to target table) operations are aborted. However, they retain the state required to resume durably.

- For sync, if it is canceled mid-way, the confirmed_flush_lsn in Postgres is not advanced, so the next sync will start from the same position as the aborted one, ensuring data consistency.
- For normalize, the ReplacingMergeTree insert order handles deduplication.

In summary, while sync and normalize processes are terminated during a pause, it is safe to do so as they can resume without data loss or inconsistency.
</Accordion>

<Accordion title="Can ClickPipe creation be automated or done via API or CLI?">
### Can ClickPipe creation be automated or done via API or CLI? 

A Postgres ClickPipe can also be created and managed via [OpenAPI](https://clickhouse.com/docs/cloud/manage/openapi) endpoints. This feature is in beta, and the API reference can be found [here](https://clickhouse.com/docs/cloud/manage/api/swagger#tag/beta). We are actively working on Terraform support to create Postgres ClickPipes as well.
</Accordion>

<Accordion title="How do I speed up my initial load?">
### How do I speed up my initial load? 

You cannot speed up an already running initial load. However, you can optimize future initial loads by adjusting certain settings. By default, the settings are configured with 4 parallel threads and a snapshot number of rows per partition set to 100,000. These are advanced settings and are generally sufficient for most use cases.

For Postgres versions 13 or lower, CTID range scans are slower, and these settings become more critical. In such cases, consider the following process to improve performance:

1. **Drop the existing pipe**: This is necessary to apply new settings.
2. **Delete destination tables on ClickHouse**: Ensure that the tables created by the previous pipe are removed.
3. **Create a new pipe with optimized settings**: Typically, increase the snapshot number of rows per partition to between 1 million and 10 million, depending on your specific requirements and the load your Postgres instance can handle.

These adjustments should significantly enhance the performance of the initial load, especially for older Postgres versions. If you are using Postgres 14 or later, these settings are less impactful due to improved support for CTID range scans.
</Accordion>

<Accordion title="How should I scope my publications when setting up replication?">
### How should I scope my publications when setting up replication? 

You can let ClickPipes manage your publications (requires additional permissions) or create them yourself. With ClickPipes-managed publications, we automatically handle table additions and removals as you edit the pipe. If self-managing, carefully scope your publications to only include tables you need to replicate - including unnecessary tables will slow down Postgres WAL decoding.

If you include any table in your publication, make sure it has either a primary key or `REPLICA IDENTITY FULL`. If you have tables without a primary key, creating a publication for all tables will cause DELETE and UPDATE operations to fail on those tables.

To identify tables without primary keys in your database, you can use this query:
```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE
    (table_catalog, table_schema, table_name) NOT IN (
        SELECT table_catalog, table_schema, table_name
        FROM information_schema.table_constraints
        WHERE constraint_type = 'PRIMARY KEY') AND
    table_schema NOT IN ('information_schema', 'pg_catalog', 'pgq', 'londiste');
```

You have two options when dealing with tables without primary keys:

1. **Exclude tables without primary keys from ClickPipes**:
   Create the publication with only the tables that have a primary key:
   ```sql
   CREATE PUBLICATION clickpipes_publication FOR TABLE table_with_primary_key1, table_with_primary_key2, ...;
   ```

2. **Include tables without primary keys in ClickPipes**:
   If you want to include tables without a primary key, you need to alter their replica identity to `FULL`. This ensures that UPDATE and DELETE operations work correctly:
   ```sql
   ALTER TABLE table_without_primary_key1 REPLICA IDENTITY FULL;
   ALTER TABLE table_without_primary_key2 REPLICA IDENTITY FULL;
   CREATE PUBLICATION clickpipes_publication FOR TABLE <...>, <...>;
   ```

<Tip>
If you're creating a publication manually instead of letting ClickPipes manage it, we don't recommend creating a publication `FOR ALL TABLES`, this leads to more traffic from Postgres to ClickPipes (to sending changes for other tables not in the pipe) and reduces overall efficiency.

For manually created publications, please add any tables you want to the publication before adding them to the pipe.
</Tip>

<Warning>
If you're replicating from a Postgres read replica/hot standby, you will need to create your own publication on the primary instance, which will automatically propagate to the standby. The ClickPipe will not be able to manage the publication in this case as you're unable to create publications on a standby.
</Warning>
</Accordion>

<Accordion title="Recommended max_slot_wal_keep_size settings">
### Recommended `max_slot_wal_keep_size` settings 

- **At Minimum:** Set [`max_slot_wal_keep_size`](https://www.postgresql.org/docs/devel/runtime-config-replication.html#GUC-MAX-SLOT-WAL-KEEP-SIZE) to retain at least **two days' worth** of WAL data.
- **For Large Databases (High Transaction Volume):** Retain at least **2-3 times** the peak WAL generation per day.
- **For Storage-Constrained Environments:** Tune this conservatively to **avoid disk exhaustion** while ensuring replication stability.

#### How to calculate the right value 

To determine the right setting, measure the WAL generation rate:

##### For PostgreSQL 10+ 

```sql
SELECT pg_wal_lsn_diff(pg_current_wal_insert_lsn(), '0/0') / 1024 / 1024 AS wal_generated_mb;
```

##### For PostgreSQL 9.6 and below: 

```sql
SELECT pg_xlog_location_diff(pg_current_xlog_insert_location(), '0/0') / 1024 / 1024 AS wal_generated_mb;
```

* Run the above query at different times of the day, especially during highly transactional periods.
* Calculate how much WAL is generated per 24-hour period.
* Multiply that number by 2 or 3 to provide sufficient retention.
* Set `max_slot_wal_keep_size` to the resulting value in MB or GB.

##### Example 

If your database generates 100 GB of WAL per day, set:

```sql
max_slot_wal_keep_size = 200GB
```
</Accordion>

<Accordion title="I'm seeing a ReceiveMessage EOF error in the logs. What does it mean?">
### I'm seeing a ReceiveMessage EOF error in the logs. What does it mean? 

`ReceiveMessage` is a function in the Postgres logical decoding protocol that reads messages from the replication stream. An EOF (End of File) error indicates that the connection to the Postgres server was unexpectedly closed while trying to read from the replication stream.

It is a recoverable, completely non-fatal error. ClickPipes will automatically attempt to reconnect and resume the replication process.

It can happen for a few reasons:
- **Low wal_sender_timeout:** Make sure `wal_sender_timeout` is 5 minutes or higher. This setting controls how long the server waits for a response from the client before closing the connection. If the timeout is too low, it can lead to premature disconnections.
- **Network Issues:** Temporary network disruptions can cause the connection to drop.
- **Postgres Server Restart:** If the Postgres server is restarted or crashes, the connection will be lost.
</Accordion>

<Accordion title="My replication slot is invalidated. What should I do?">
### My replication slot is invalidated. What should I do? 

The only way to recover ClickPipe is by triggering a resync, which you can do in the Settings page.

The most common cause of replication slot invalidation is a low `max_slot_wal_keep_size` setting on your PostgreSQL database (e.g., a few gigabytes). We recommend increasing this value. [Refer to this section](/integrations/clickpipes/postgres/faq#recommended-max_slot_wal_keep_size-settings) on tuning `max_slot_wal_keep_size`. Ideally, this should be set to at least 200GB to prevent replication slot invalidation.

In rare cases, we have seen this issue occur even when `max_slot_wal_keep_size` is not configured. This could be due to an intricate and rare bug in PostgreSQL, although the cause remains unclear.
</Accordion>

<Accordion title="I am seeing out of memory (OOMs) on ClickHouse while my ClickPipe is ingesting data. Can you help?">
### I am seeing out of memory (OOMs) on ClickHouse while my ClickPipe is ingesting data. Can you help? 

One common reason for OOMs on ClickHouse is that your service is undersized. This means that your current service configuration doesn't have enough resources (e.g., memory or CPU) to handle the ingestion load effectively. We strongly recommend scaling up the service to meet the demands of your ClickPipe data ingestion.

Another reason we've observed is the presence of downstream Materialized Views with potentially unoptimized joins:

- A common optimization technique for JOINs is if you have a `LEFT JOIN` where the right-hand side table is very large. In this case, rewrite the query to use a `RIGHT JOIN` and move the larger table to the left-hand side. This allows the query planner to be more memory efficient.

- Another optimization for JOINs is to explicitly filter the tables through `subqueries` or `CTEs` and then perform the `JOIN` across these subqueries. This provides the planner with hints on how to efficiently filter rows and perform the `JOIN`.
</Accordion>

<Accordion title="I am seeing an invalid snapshot identifier during the initial load. What should I do?">
### I am seeing an `invalid snapshot identifier` during the initial load. What should I do? 

The `invalid snapshot identifier` error occurs when there is a connection drop between ClickPipes and your Postgres database. This can happen due to gateway timeouts, database restarts, or other transient issues.

It is recommended that you do not carry out any disruptive operations like upgrades or restarts on your Postgres database while Initial Load is in progress and ensure that the network connection to your database is stable.

To resolve this issue, you can trigger a resync from the ClickPipes UI. This will restart the initial load process from the beginning.
</Accordion>

<Accordion title="What happens if I drop a publication in Postgres?">
### What happens if I drop a publication in Postgres? 

Dropping a publication in Postgres will break your ClickPipe connection since the publication is required for the ClickPipe to pull changes from the source. When this happens, you'll typically receive an error alert indicating that the publication no longer exists.

To recover your ClickPipe after dropping a publication:

1. Create a new publication with the same name and required tables in Postgres
2. Click the 'Resync tables' button in the Settings tab of your ClickPipe

This resync is necessary because the recreated publication will have a different Object Identifier (OID) in Postgres, even if it has the same name. The resync process refreshes your destination tables and restores the connection.

Alternatively, you can create an entirely new pipe if preferred.

Note that if you're working with partitioned tables, make sure to create your publication with the appropriate settings:

```sql
CREATE PUBLICATION clickpipes_publication
FOR TABLE <...>, <...>
WITH (publish_via_partition_root = true);
```
</Accordion>

<Accordion title="What if I am seeing Unexpected Datatype errors or Cannot parse type XX ...">
### What if I am seeing `Unexpected Datatype` errors or `Cannot parse type XX ...` 

This error typically occurs when the source Postgres database has a datatype which cannot be mapped during ingestion.
For more specific issue, refer to the possibilities below.
</Accordion>

<Accordion title="Cannot parse type Decimal(XX, YY), expected non-empty binary data with size equal to or less than ...">
### `Cannot parse type Decimal(XX, YY), expected non-empty binary data with size equal to or less than ...` 

Postgres `NUMERIC`s have really high precision (up to 131072 digits before the decimal point; up to 16383 digits after the decimal point) and ClickHouse Decimal type allows maximum of (76 digits, 39 scale).
The system assumes that _usually_ the size would not get that high and does an optimistic cast for the same as source table can have large number of rows or the row can come in during the CDC phase.

The current workaround would be to map the NUMERIC type to string on ClickHouse. To enable this please raise a ticket with the support team and this will be enabled for your ClickPipes.
</Accordion>

<Accordion title="I'm seeing errors like invalid memory alloc request size <XXX> during replication/slot creation">
### I'm seeing errors like `invalid memory alloc request size <XXX>` during replication/slot creation 

There was a bug introduced in Postgres patch versions 17.5/16.9/15.13/14.18/13.21 due to which certain workloads can cause an exponential increase in memory usage, leading to a memory allocation request >1GB which Postgres considers invalid. This bug [has been fixed](https://github.com/postgres/postgres/commit/d87d07b7ad3b782cb74566cd771ecdb2823adf6a) and will be in the next Postgres patch series (17.6...). Please check with your Postgres provider when this patch version will be available for upgrade. If an upgrade isn't immediately possible, a resync of the pipe will be needed as it hits the error.
</Accordion>

<Accordion title="I need to maintain a complete historical record in ClickHouse, even when the data is deleted from the source Postgres database. Can I completely ignore DELETE and TRUNCATE operations from Postgres in ClickPipes?">
### I need to maintain a complete historical record in ClickHouse, even when the data is deleted from the source Postgres database. Can I completely ignore DELETE and TRUNCATE operations from Postgres in ClickPipes? 

Yes! Before creating your Postgres ClickPipe, create a publication without DELETE operations. For example:
```sql
CREATE PUBLICATION <pub_name> FOR TABLES IN SCHEMA <schema_name> WITH (publish = 'insert,update');
```
Then when [setting up](https://clickhouse.com/docs/integrations/clickpipes/postgres#configuring-the-replication-settings) your Postgres ClickPipe, make sure this publication name is selected.

Note that TRUNCATE operations are ignored by ClickPipes and will not be replicated to ClickHouse.
</Accordion>

<Accordion title="Why can I not replicate my table which has a dot in it?">
### Why can I not replicate my table which has a dot in it? 

PeerDB has a limitation currently where dots in source table identifiers - aka either schema name or table name - is not supported for replication as PeerDB cannot discern, in that case, what is the schema and what is the table as it splits on dot.
Effort is being made to support input of schema and table separately to get around this limitation.
</Accordion>

<Accordion title="Initial load completed but there is no/missing data on ClickHouse. What could be the issue?">
### Initial load completed but there is no/missing data on ClickHouse. What could be the issue? 

If your initial load has completed without error but your destination ClickHouse table is missing data, it might be that you have RLS (Row Level Security) policies enabled on your source Postgres tables.
Also worth checking:
- If the user has sufficient permissions to read the source tables.
- If there are any row policies on ClickHouse side which might be filtering out rows.
</Accordion>

<Accordion title="Can I have the ClickPipe create a replication slot with failover enabled?">
### Can I have the ClickPipe create a replication slot with failover enabled? 

Yes, for a Postgres ClickPipe with replication mode as CDC or Snapshot + CDC, you can have ClickPipes create a replication slot with failover enabled, by toggling the below switch in the `Advanced Settings` section while creating the ClickPipe. Note that your Postgres version must be 17 or above to use this feature.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/failover_slot.png" alt="Failover slot toggle"/>

If the source is configured accordingly, the slot is preserved after failovers to a Postgres read replica, ensuring continuous data replication. Learn more [here](https://www.postgresql.org/docs/current/logical-replication-failover.html).
</Accordion>

<Accordion title="I am seeing errors like Internal error encountered during logical decoding of aborted sub-transaction">
### I am seeing errors like `Internal error encountered during logical decoding of aborted sub-transaction` 

This error suggests a transient issue with the logical decoding of aborted sub-transaction, and is specific to custom implementations of Aurora Postgres. Given the error is coming from `ReorderBufferPreserveLastSpilledSnapshot` routine, this suggests that logical decoding is not able to read the snapshot spilled to disk. It may be worth trying to increase [`logical_decoding_work_mem`](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-LOGICAL-DECODING-WORK-MEM) to a higher value.
</Accordion>

<Accordion title="I am seeing errors like error converting new tuple to map or error parsing logical message during CDC replication">
### I am seeing errors like `error converting new tuple to map` or `error parsing logical message` during CDC replication 

Postgres sends information about changes in the form of messages that have a fixed protocol. These errors arise when the ClickPipe receives a message that it is unable to parse, either due to corruption in transit or invalid messages being sent. While the exact issue tends to vary, we've seen several cases from Neon Postgres sources. In case you are seeing this issue with Neon as well, please raise a support ticket with them. In other cases, please reach out to our support team for guidance.
</Accordion>
</AccordionGroup>