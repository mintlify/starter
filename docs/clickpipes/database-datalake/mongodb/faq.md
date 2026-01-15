---
sidebarTitle: 'FAQ'
description: 'Frequently asked questions about ClickPipes for MongoDB.'
slug: /integrations/clickpipes/mongodb/faq
sidebar_position: 2
title: 'ClickPipes for MongoDB FAQ'
doc_type: 'reference'
keywords: ['clickpipes', 'mongodb', 'cdc', 'data ingestion', 'real-time sync']
---

### Can I query for individual fields in the JSON datatype? 

For direct field access, such as `{"user_id": 123}`, you can use **dot notation**:
```sql
SELECT doc.user_id as user_id FROM your_table;
```
For direct field access of nested object fields, such as `{"address": { "city": "San Francisco", "state": "CA" }}`, use the `^` operator:
```sql
SELECT doc.^address.city AS city FROM your_table;
```
For aggregations, cast the field to the appropriate type with the `CAST` function or `::` syntax:
```sql
SELECT sum(doc.shipping.cost::Float32) AS total_shipping_cost FROM t1;
```
To learn more about working with JSON, see our [Working with JSON guide](./quickstart).

### How do I flatten the nested MongoDB documents in ClickHouse? 

MongoDB documents are replicated as JSON type in ClickHouse by default, preserving the nested structure. You have several options to flatten this data. If you want to flatten the data to columns, you can use normal views, materialized views, or query-time access.

1. **Normal Views**: Use normal views to encapsulate flattening logic.
2. **Materialized Views**: For smaller datasets, you can use refreshable materialized with the [`FINAL` modifier](/sql-reference/statements/select/from#final-modifier) to periodically flatten and deduplicate data. For larger datasets, we recommend using incremental materialized views without `FINAL` to flatten the data in real-time, and then deduplicate data at query time.
3. **Query-time Access**: Instead of flattening, use dot notation to access nested fields directly in queries.

For detailed examples, see our [Working with JSON guide](./quickstart).

### Can I connect MongoDB databases that don't have a public IP or are in private networks? 

We support AWS PrivateLink for connecting to MongoDB databases that don't have a public IP or are in private networks. Azure Private Link and GCP Private Service Connect are currently not supported.

### What happens if I delete a database/table from my MongoDB database? 

When you delete a database/table from MongoDB, ClickPipes will continue running but the dropped database/table will stop replicating changes. The corresponding tables in ClickHouse is preserved.

### How does MongoDB CDC Connector handle transactions? 

Each document change within a transaction is processed individually to ClickHouse. Changes are applied in the order they appear in the oplog; and only committed changes are replicated to ClickHouse. If a MongoDB transaction is rolled back, those changes won't appear in the change stream.

For more examples, see our [Working with JSON guide](./quickstart).

### How do I handle `resume of change stream was not possible, as the resume point may no longer be in the oplog.` error? 

This error typically occurs when the oplog is truncated and ClickPipe is unable to resume the change stream at the expected point. To resolve this issue, [resync the ClickPipe](./resync.md). To avoid this issue from recurring, we recommend [increasing the oplog retention period](./source/atlas#enable-oplog-retention) (or [here](./source/generic#enable-oplog-retention) if you are on a self-managed MongoDB).

### How is replication managed? 

We use MongoDB's native Change Streams API to track changes in the database. Change Streams API provides a resumable stream of database changes by leveraging MongoDB's oplog (operations log). ClickPipe uses MongoDB's resume tokens to track the position in the oplog and ensure every change is replicated to ClickHouse.

### Which read preference should I use? 

Which read preference to use depends on your specific use case. If you want to minimize the load on your primary node, we recommend using `secondaryPreferred` read preference. If you want to optimize ingestion latency, we recommend using `primaryPreferred` read preference. For more details, see [MongoDB documentation](https://www.mongodb.com/docs/manual/core/read-preference/#read-preference-modes-1).

### Does the MongoDB ClickPipe support Sharded Cluster? 
Yes, the MongoDB ClickPipe supports both Replica Set and Sharded Cluster.
