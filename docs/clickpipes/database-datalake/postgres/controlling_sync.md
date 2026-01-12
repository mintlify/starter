---
title: 'Controlling the Syncing of a Postgres ClickPipe'
description: 'Doc for controlling the sync a Postgres ClickPipe'
slug: /integrations/clickpipes/postgres/sync_control
sidebarTitle: 'Controlling syncs'
keywords: ['sync control', 'postgres', 'clickpipes', 'batch size', 'sync interval']
doc_type: 'guide'
---

This document describes how to control the sync of a Postgres ClickPipe when the ClickPipe is in **CDC (Running) mode**.

## Overview 

Database ClickPipes have an architecture that consists of two parallel processes - pulling from the source database and pushing to the target database. The pulling process is controlled by a sync configuration that defines how often the data should be pulled and how much data should be pulled at a time. By "at a time", we mean one batch - since the ClickPipe pulls and pushes data in batches.

There are two main ways to control the sync of a Postgres ClickPipe. The ClickPipe will start pushing when one of the below settings kicks in.

### Sync interval 

The sync interval of the pipe is the amount of time (in seconds) for which the ClickPipe will pull records from the source database. The time to push what we have to ClickHouse is not included in this interval.

The default is **1 minute**.
Sync interval can be set to any positive integer value, but it is recommended to keep it above 10 seconds.

### Pull batch size 

The pull batch size is the number of records that the ClickPipe will pull from the source database in one batch. Records mean inserts, updates and deletes done on the tables that are part of the pipe.

The default is **100,000** records.
A safe maximum is 10 million.

### An exception: Long-running transactions on source 

When a transaction is run on the source database, the ClickPipe waits until it receives the COMMIT of the transaction before it moves forward. This with **overrides** both the sync interval and the pull batch size.

### Configuring sync settings 

You can set the sync interval and pull batch size when you create a ClickPipe or edit an existing one.
When creating a ClickPipe it will be seen in the second step of the creation wizard, as shown below:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/create_sync_settings.png" alt="Create sync settings"/>

When editing an existing ClickPipe, you can head over to the **Settings** tab of the pipe, pause the pipe and then click on **Configure** here:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/edit_sync_button.png" alt="Edit sync button"/>

This will open a flyout with the sync settings, where you can change the sync interval and pull batch size:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/sync_settings_edit.png" alt="Edit sync settings"/>

### Tweaking the sync settings to help with replication slot growth 

Let's talk about how to use these settings to handle a large replication slot of a CDC pipe.
The pushing time to ClickHouse does not scale linearly with the pulling time from the source database. This can be leveraged to reduce the size of a large replication slot.
By increasing both the sync interval and pull batch size, the ClickPipe will pull a whole lot of data from the source database in one go, and then push it to ClickHouse.

### Monitoring sync control behaviour 
You can see how long each batch takes in the **CDC Syncs** table in the **Metrics** tab of the ClickPipe. Note that the duration here includes push time and also if there are no rows incoming, the ClickPipe waits and the wait time is also included in the duration.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/cdc_syncs.png" alt="CDC Syncs table"/>
