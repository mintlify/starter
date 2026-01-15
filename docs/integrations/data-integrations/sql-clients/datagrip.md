---
sidebarTitle: 'DataGrip'
slug: /integrations/datagrip
description: 'DataGrip is a database IDE that supports ClickHouse out of the box.'
title: 'Connecting DataGrip to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'sql_client'
  - website: 'https://www.jetbrains.com/datagrip/'
keywords: ['DataGrip', 'database IDE', 'JetBrains', 'SQL client', 'integrated development environment']
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

## Start or download DataGrip 

DataGrip is available at https://www.jetbrains.com/datagrip/

## 1. Gather your connection details 

<GatherYourDetailsHttp />

## 2. Load the ClickHouse driver 

1. Launch DataGrip, and on the **Data Sources** tab in the **Data Sources and Drivers** dialog, click the **+** icon

<img src="/images/integrations/sql-clients/datagrip-5.png" alt="DataGrip Data Sources tab with + icon highlighted"/>

  Select **ClickHouse**

  :::tip
  As you establish connections the order changes, ClickHouse may not be at the top of your list yet.
  :::

<img src="/images/integrations/sql-clients/datagrip-6.png" alt="DataGrip selecting ClickHouse from the data sources list"/>

- Switch to the **Drivers** tab and load the ClickHouse driver

  DataGrip does not ship with drivers in order to minimize the download size.  On the **Drivers** tab
  Select **ClickHouse** from the **Complete Support** list, and expand the **+** sign.  Choose the **Latest stable** driver from the **Provided Driver** option:

<img src="/images/integrations/sql-clients/datagrip-1.png" alt="DataGrip Drivers tab showing ClickHouse driver installation"/>

## 3. Connect to ClickHouse 

- Specify your database connection details, and click **Test Connection**:

  In step one you gathered your connection details, fill in the host URL, port, username, password, and database name, then test the connection.

  :::tip
  The **HOST** entry in the DataGrip dialog is actually a URL, see the image below.

  For more details on JDBC URL settings, please refer to the [ClickHouse JDBC driver](https://github.com/ClickHouse/clickhouse-java) repository.
  :::

<img src="/images/integrations/sql-clients/datagrip-7.png" alt="DataGrip connection details form with ClickHouse settings"/>

## Learn more 

Find more information about DataGrip visit the DataGrip documentation.
