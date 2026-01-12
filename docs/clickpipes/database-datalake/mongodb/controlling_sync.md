---
title: 'Controlling the Syncing of a MongoDB ClickPipe'
description: 'Doc for controllling the sync a MongoDB ClickPipe'
slug: /integrations/clickpipes/mongodb/sync_control
sidebarTitle: 'Controlling syncs'
doc_type: 'guide'
keywords: ['clickpipes', 'mongodb', 'cdc', 'data ingestion', 'real-time sync']
---

This document describes how to control the sync of a MongoDB ClickPipe when the ClickPipe is in **CDC (Running) mode**.

## Overview 

Database ClickPipes have an architecture that consists of two parallel processes - pulling from the source database and pushing to the target database. The pulling process is controlled by a sync configuration that defines how often the data should be pulled and how much data should be pulled at a time. By "at a time", we mean one batch - since the ClickPipe pulls and pushes data in batches.

There are two main ways to control the sync of a MongoDB ClickPipe. The ClickPipe will start pushing when one of the below settings kicks in.

### Sync interval 

The sync interval of the pipe is the amount of time (in seconds) for which the ClickPipe will pull records from the source database. The time to push what we have to ClickHouse is not included in this interval.

The default is **1 minute**.
Sync interval can be set to any positive integer value, but it is recommended to keep it above 10 seconds.

### Pull batch size 

The pull batch size is the number of records that the ClickPipe will pull from the source database in one batch. Records mean inserts, updates and deletes done on the collections that are part of the pipe.

The default is **100,000** records.
A safe maximum is 10 million.

### Configuring sync settings 

You can set the sync interval and pull batch size when you create a ClickPipe or edit an existing one.
When creating a ClickPipe it will be seen in the second step of the creation wizard, as shown below:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/create_sync_settings.png" alt="Create sync settings"/>

When editing an existing ClickPipe, you can head over to the **Settings** tab of the pipe, pause the pipe and then click on **Configure** here:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/edit_sync_button.png" alt="Edit sync button"/>

This will open a flyout with the sync settings, where you can change the sync interval and pull batch size:

<img src="/images/integrations/data-ingestion/clickpipes/postgres/sync_settings_edit.png" alt="Edit sync settings"/>

### Monitoring sync control behaviour 

You can see how long each batch takes in the **CDC Syncs** table in the **Metrics** tab of the ClickPipe. Note that the duration here includes push time and also if there are no rows incoming, the ClickPipe waits and the wait time is also included in the duration.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/cdc_syncs.png" alt="CDC Syncs table"/>
