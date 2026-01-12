---
sidebarTitle: 'Overview'
sidebar_position: 1
slug: /integrations/migration/overview
keywords: ['clickhouse', 'migrate', 'migration', 'migrating', 'data']
title: 'Migrating Data into ClickHouse'
description: 'Page describing the options available for migrating data into ClickHouse'
doc_type: 'guide'
---

<Frame>
  <iframe src="https://player.vimeo.com/video/753082620?h=eb566c8c08"
    frameborder="0"
    allow="autoplay;
    fullscreen;
    picture-in-picture"
    allowfullscreen>
  </iframe>
</Frame>

<br/>

There are several options for migrating data into ClickHouse Cloud, depending on where your data resides now:

- [Self-managed to Cloud](/cloud/migration/clickhouse-to-cloud): use the `remoteSecure` function to transfer data
- [Another DBMS](/cloud/migration/clickhouse-local): use the [clickhouse-local] ETL tool along with the appropriate ClickHouse table function for your current DBMS
- [Anywhere!](/cloud/migration/etl-tool-to-clickhouse): use one of the many popular ETL/ELT tools that connect to all kinds of different data sources
- [Object Storage](/integrations/migration/object-storage-to-clickhouse): easily insert data from S3 into ClickHouse

In the example [Migrate from Redshift](/migrations/redshift/migration-guide), we present three different ways to migrate data to ClickHouse.
