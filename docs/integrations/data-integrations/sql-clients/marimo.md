---
slug: /integrations/marimo
sidebarTitle: 'marimo'
description: 'marimo is a next-generation Python notebook for interacting with data'
title: 'Using marimo with ClickHouse'
doc_type: 'guide'
keywords: ['marimo', 'notebook', 'data analysis', 'python', 'visualization']
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

<CommunityMaintainedBadge/>

[marimo](https://marimo.io/) is an open-source reactive notebook for Python with SQL built-in. When you run a cell or interact with a UI element, marimo automatically runs affected cells (or marks them as stale), keeping code and outputs consistent and preventing bugs before they happen. Every marimo notebook is stored as pure Python, executable as a script, and deployable as an app.

<img src="/images/integrations/sql-clients/marimo/clickhouse-connect.gif" alt="Connect to ClickHouse"/>

## 1. Install marimo with SQL support 

```shell
pip install "marimo[sql]" clickhouse_connect
marimo edit clickhouse_demo.py
```
This should open up a web browser running on localhost.

## 2. Connecting to ClickHouse. 

Navigate to the datasources panel on the left side of the marimo editor and click on 'Add database'.

<img src="/images/integrations/sql-clients/marimo/panel-arrow.png" alt="Add a new database"/>

You will be prompted to fill in the database details.

<img src="/images/integrations/sql-clients/marimo/add-db-details.png" alt="Fill in the database details"/>

You will then have a cell that can be run to establish a connection.

<img src="/images/integrations/sql-clients/marimo/run-cell.png" alt="Run the cell to connect to ClickHouse"/>

## 3. Run SQL 

Once you have set up a connection, you can create a new SQL cell and choose the clickhouse engine. 

<img src="/images/integrations/sql-clients/marimo/choose-sql-engine.png" alt="Choose SQL engine"/>

For this guide, we will use the New York Taxi dataset.

```sql
CREATE TABLE trips (
    trip_id             UInt32,
    pickup_datetime     DateTime,
    dropoff_datetime    DateTime,
    pickup_longitude    Nullable(Float64),
    pickup_latitude     Nullable(Float64),
    dropoff_longitude   Nullable(Float64),
    dropoff_latitude    Nullable(Float64),
    passenger_count     UInt8,
    trip_distance       Float32,
    fare_amount         Float32,
    extra               Float32,
    tip_amount          Float32,
    tolls_amount        Float32,
    total_amount        Float32,
    payment_type        Enum('CSH' = 1, 'CRE' = 2, 'NOC' = 3, 'DIS' = 4, 'UNK' = 5),
    pickup_ntaname      LowCardinality(String),
    dropoff_ntaname     LowCardinality(String)
)
ENGINE = MergeTree
PRIMARY KEY (pickup_datetime, dropoff_datetime);
```

```sql
INSERT INTO trips
SELECT
    trip_id,
    pickup_datetime,
    dropoff_datetime,
    pickup_longitude,
    pickup_latitude,
    dropoff_longitude,
    dropoff_latitude,
    passenger_count,
    trip_distance,
    fare_amount,
    extra,
    tip_amount,
    tolls_amount,
    total_amount,
    payment_type,
    pickup_ntaname,
    dropoff_ntaname
FROM gcs(
    'https://storage.googleapis.com/clickhouse-public-datasets/nyc-taxi/trips_0.gz',
    'TabSeparatedWithNames'
);
```

```sql
SELECT * FROM trips LIMIT 1000;
```

<img src="/images/integrations/sql-clients/marimo/results.png" alt="Results in a dataframe"/>

Now, you are able to view the results in a dataframe. I would like to visualize the most expensive drop-offs from a given pickup location. marimo provides several UI components to help you. I will use a dropdown to select the location and altair for charting.

<img src="/images/integrations/sql-clients/marimo/dropdown-cell-chart.png" alt="Combination of dropdown, table and chart"/>

marimo's reactive execution model extends into SQL queries, so changes to your SQL will automatically trigger downstream computations for dependent cells (or optionally mark cells as stale for expensive computations). Hence the chart and table changes when the query is updated.

You can also toggle App View to have a clean interface for exploring your data.

<img src="/images/integrations/sql-clients/marimo/run-app-view.png" alt="Run app view"/>
