---
title: 'Resyncing Specific Tables'
description: 'Resyncing specific tables in a MongoDB ClickPipe'
slug: /integrations/clickpipes/mongodb/table_resync
sidebarTitle: 'Resync table'
doc_type: 'guide'
keywords: ['clickpipes', 'mongodb', 'cdc', 'data ingestion', 'real-time sync']
---

There are scenarios where it would be useful to have specific tables of a pipe be re-synced. Some sample use-cases could be major schema changes on MongoDB, or maybe some data re-modelling on the ClickHouse.

While resyncing individual tables with a button click is a work-in-progress, this guide will share steps on how you can achieve this today in the MongoDB ClickPipe.

### 1. Remove the table from the pipe 

This can be followed by following the [table removal guide](./removing_tables).

### 2. Truncate or drop the table on ClickHouse 

This step is to avoid data duplication when we add this table again in the next step. You can do this by heading over to the **SQL Console** tab in ClickHouse Cloud and running a query.
Note that we have validation to block table addition if the table already exists in ClickHouse and is not empty.

### 3. Add the table to the ClickPipe again 

This can be followed by following the [table addition guide](./add_table).
