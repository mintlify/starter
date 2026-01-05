---
sidebarTitle: 'Review and restore backups'
sidebar_position: 0
slug: /cloud/manage/backups/overview
title: 'Review and restore backups'
keywords: ['backups', 'cloud backups', 'restore']
description: 'Provides an overview of backups in ClickHouse Cloud'
doc_type: 'guide'
---

import {CloudNotSupportedBadge} from '/snippets/components/CloudNotSupportedBadge/CloudNotSupportedBadge.jsx'
import {ScalePlanFeatureBadge} from '/snippets/components/ScalePlanFeatureBadge/ScalePlanFeatureBadge.jsx'

This guide covers how backups work in ClickHouse Cloud, what options you have to configure backups for your service, and how to restore from a backup.

## Backup status list [#backup-status-list]

Your service will be backed up based on the set schedule, whether it is the default daily schedule or a [custom schedule](/cloud/manage/backups/configurable-backups) picked by you. All available backups can be viewed from the **Backups** tab of the service. From here, you can see the status of the backup, the duration, as well as the size of the backup. You can also restore a specific backup using the **Actions** column.

<img src="/images/cloud/manage/backup-status-list.png" alt="List of backup statuses in ClickHouse Cloud"/>

## Understanding backup cost [#understanding-backup-cost]

Per the default policy, ClickHouse Cloud mandates a backup every day, with a 24 hour retention.  Choosing a schedule that requires retaining more data, or causes more frequent backups can cause additional storage charges for backups.

To understand the backup cost, you can view the backup cost per service from the usage screen (as shown below). Once you have backups running for a few days with a customized schedule, you can get an idea of the cost and extrapolate to get the monthly cost for backups.

<img src="/images/cloud/manage/backup-usage.png" alt="Backup usage chart in ClickHouse Cloud"/>

Estimating the total cost for your backups requires you to set a schedule. We are also working on updating our [pricing calculator](https://clickhouse.com/pricing), so you can get a monthly cost estimate before setting a schedule. You will need to provide the following inputs in order to estimate the cost:
- Size of the full and incremental backups
- Desired frequency
- Desired retention
- Cloud provider and region

<Note>
Keep in mind that the estimated cost for backups will change as the size of the data in the service grows over time.
</Note>

## Restore a backup [#restore-a-backup]

Backups are restored to a new ClickHouse Cloud service, not to the existing service from which the backup was taken.

After clicking on the **Restore** backup icon, you can specify the service name of the new service that will be created, and then restore this backup:

<img src="/images/cloud/manage/backup-restore.png" alt="Restoring a backup in ClickHouse Cloud"/>

The new service will show in the services list as `Provisioning` until it is ready:

<img src="/images/cloud/manage/backup-service-provisioning.png" alt="Provisioning service in progress"/>

## Working with your restored service [#working-with-your-restored-service]

After a backup has been restored, you will now have two similar services: the **original service** that needed to be restored, and a new **restored service** that has been restored from a backup of the original.

Once the backup restore is complete, you should do one of the following:
- Use the new restored service and remove the original service.
- Migrate data from the new restored service back to the original service and remove the new restored service.

### Use the **new restored service** [#use-the-new-restored-service]

To use the new service, perform these steps:

1. Verify that the new service has the IP Access List entries required for your use case.
1. Verify that the new service contains the data that you need.
1. Remove the original service.

### Migrate data from the **newly restored service** back to the **original service** [#migrate-data-from-the-newly-restored-service-back-to-the-original-service]

Suppose you cannot work with the newly restored service for some reason, for example, if you still have users or applications that connect to the existing service. You may decide to migrate the newly restored data into the original service. The migration can be accomplished by following these steps:

**Allow remote access to the newly restored service**

The new service should be restored from a backup with the same IP Allow List as the original service. This is required as connections will not be allowed to other ClickHouse Cloud services unless you had allowed access from **Anywhere**. Modify the allow list and allow access from **Anywhere** temporarily. See the [IP Access List](/cloud/security/setting-ip-filters) docs for details.

**On the newly restored ClickHouse service (the system that hosts the restored data)**

<Note>
You will need to reset the password for the new service in order to access it. You can do that from the service list **Settings** tab.
</Note>

Add a read only user that can read the source table (`db.table` in this example):

  ```sql
  CREATE USER exporter
  IDENTIFIED WITH SHA256_PASSWORD BY 'password-here'
  SETTINGS readonly = 1;
  ```

  ```sql
  GRANT SELECT ON db.table TO exporter;
  ```

Copy the table definition:

  ```sql
  SELECT create_table_query
  FROM system.tables
  WHERE database = 'db' AND table = 'table'
  ```

**On the destination ClickHouse Cloud system (the one that had the damaged table):**

Create the destination database:
  ```sql
  CREATE DATABASE db
  ```

Using the `CREATE TABLE` statement from the source, create the destination:

<Tip>
Change the `ENGINE` to `ReplicatedMergeTree` without any parameters when you run the `CREATE` statement. ClickHouse Cloud always replicates tables and provides the correct parameters.
</Tip>

  ```sql
  CREATE TABLE db.table ...
  ENGINE = ReplicatedMergeTree
  ORDER BY ...
  ```

Use the `remoteSecure` function to pull the data from the newly restored ClickHouse Cloud service into your original service:

  ```sql
  INSERT INTO db.table
  SELECT *
  FROM remoteSecure('source-hostname', db, table, 'exporter', 'password-here')
  ```

After you have successfully inserted the data into your original service, make sure to verify the data in the service. You should also delete the new  service once the data is verified.

## Undeleting or undropping tables [#undeleting-or-undropping-tables]

The `UNDROP` command is supported in ClickHouse Cloud through [Shared Catalog](https://clickhouse.com/docs/cloud/reference/shared-catalog).

To prevent users from accidentally dropping tables, you can use [`GRANT` statements](/sql-reference/statements/grant) to revoke permissions for the [`DROP TABLE` command](/sql-reference/statements/drop#drop-table) for a specific user or role.

<Note>
To prevent accidental deletion of data, please note that by default it is not possible to drop tables >`1TB` in size in ClickHouse Cloud.
Should you wish to drop tables greater than this threshold you can use setting `max_table_size_to_drop` to do so:

```sql
DROP TABLE IF EXISTS table_to_drop
SYNC SETTINGS max_table_size_to_drop=2000000000000 -- increases the limit to 2TB
```
</Note>

<Note>
Legacy Plans: For customers on legacy plans, default daily backups retained for 24 hours, are included in the storage cost.
</Note>

## Configurable backups [#configurable-backups]

If you want to set up a backups schedule different from the default backup schedule, take a look at [Configurable Backups](/cloud/manage/backups/configurable-backups).

## Export backups to your own cloud account [#export-backups-to-your-own-cloud-account]

For users wanting to export backups to their own cloud account, see [here](/cloud/manage/backups/export-backups-to-own-cloud-account).
