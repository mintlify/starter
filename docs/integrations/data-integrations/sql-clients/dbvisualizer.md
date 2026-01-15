---
sidebarTitle: 'DbVisualizer'
slug: /integrations/dbvisualizer
description: 'DbVisualizer is a database tool with extended support for ClickHouse.'
title: 'Connecting DbVisualizer to ClickHouse'
keywords: ['DbVisualizer', 'database visualization', 'SQL client', 'JDBC driver', 'database tool']
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'sql_client'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

## Start or download DbVisualizer 

DbVisualizer is available at https://www.dbvis.com/download/

## 1. Gather your connection details 

<GatherYourDetailsHttp />

## 2. Built-in JDBC driver management 

DbVisualizer has the most up-to-date JDBC drivers for ClickHouse included. It has full JDBC driver management built right in that points to the latest releases as well as historical versions for the drivers.

<img src="/images/integrations/sql-clients/dbvisualizer-driver-manager.png" alt="DbVisualizer driver manager interface showing ClickHouse JDBC driver configuration"/>

## 3. Connect to ClickHouse 

To connect a database with DbVisualizer, you must first create and setup a Database Connection.

1. Create a new connection from **Database->Create Database Connection** and select a driver for your database from the popup menu.

2. An **Object View** tab for the new connection is opened.

3. Enter a name for the connection in the **Name** field, and optionally enter a description of the connection in the **Notes** field.

4. Leave the **Database Type** as **Auto Detect**.

5. If the selected driver in **Driver Type** is marked with a green check mark then it is ready to use. If it is not marked with a green check mark, you may have to configure the driver in the **Driver Manager**.

6. Enter information about the database server in the remaining fields.

7. Verify that a network connection can be established to the specified address and port by clicking the **Ping Server** button.

8. If the result from Ping Server shows that the server can be reached, click **Connect** to connect to the database server.

## Learn more 

See [Fixing Connection Issues](https://www.dbvis.com/docs/ug/troubleshooting/fixing-connection-issues/) for some tips if you have problems connecting to the database.

Find more information about DbVisualizer visit the [DbVisualizer documentation](https://www.dbvis.com/docs/ug/).