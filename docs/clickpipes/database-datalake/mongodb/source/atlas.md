---
sidebarTitle: 'MongoDB Atlas'
description: 'Step-by-step guide on how to set up MongoDB Atlas as a source for ClickPipes'
slug: /integrations/clickpipes/mongodb/source/atlas
title: 'MongoDB Atlas source setup guide'
doc_type: 'guide'
keywords: ['clickpipes', 'mongodb', 'cdc', 'data ingestion', 'real-time sync']
---


## Configure oplog retention 

Minimum oplog retention of 24 hours is required for replication. We recommend setting the oplog retention to 72 hours or longer to ensure that the oplog is not truncated before the initial snapshot is completed. To set the oplog retention via UI:

1. Navigate to your cluster's `Overview` tab in the MongoDB Atlas console and click on the `Configuration` tab.
<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-cluster-overview-configuration.png" alt="Navigate to cluster configuration"/>

2. Click `Additional Settings` and scroll down to `More Configuration Options`.
<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-expand-additional-settings.png" alt="Expand additional settings"/>

3. Click `More Configuration Options` and set the minimum oplog window to `72 hours` or longer.
<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-set-retention-hours.png" alt="Set oplog retention hours"/>

4. Click `Review Changes` to review, and then `Apply Changes` to deploy the changes.

## Configure a database user 

Once you are logged in to your MongoDB Atlas console, click `Database Access` under the Security tab in the left navigation bar. Click on "Add New Database User".

ClickPipes requires password authentication:

<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-add-new-database-user.png" alt="Add database user"/>

ClickPipes requires a user with the following roles:

- `readAnyDatabase`
- `clusterMonitor`

You can find them in the `Specific Privileges` section:

<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-database-user-privilege.png" alt="Configure user roles"/>

You can further specify the cluster(s)/instance(s) you wish to grant access to ClickPipes user:

<img src="/images/integrations/data-ingestion/clickpipes/mongodb/mongo-atlas-restrict-access.png" alt="Restrict cluster/instance acces"/>

## What's next? 

You can now [create your ClickPipe](../index.md) and start ingesting data from your MongoDB instance into ClickHouse Cloud.
Make sure to note down the connection details you used while setting up your MongoDB instance as you will need them during the ClickPipe creation process.
