---
slug: /integrations/dbeaver
sidebarTitle: 'DBeaver'
description: 'DBeaver is a multi-platform database tool.'
title: 'Connect DBeaver to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'sql_client'
  - website: 'https://github.com/dbeaver/dbeaver'
keywords: ['DBeaver', 'database management', 'SQL client', 'JDBC connection', 'multi-platform']
---

import ClickHouseSupportedBadge from '/snippets/components/ClickHouseSupported/ClickHouseSupported.jsx'

<ClickHouseSupportedBadge/>

DBeaver is available in multiple offerings. In this guide [DBeaver Community](https://dbeaver.io/) is used. See the various offerings and capabilities [here](https://dbeaver.com/edition/).  DBeaver connects to ClickHouse using JDBC.

<Note>
Please use DBeaver version 23.1.0 or above for improved support of `Nullable` columns in ClickHouse.
</Note>

## 1. Gather your ClickHouse details 

DBeaver uses JDBC over HTTP(S) to connect to ClickHouse; you need:

- endpoint
- port number
- username
- password

## 2. Download DBeaver 

DBeaver is available at https://dbeaver.io/download/

## 3. Add a database 

- Either use the **Database > New Database Connection** menu or the **New Database Connection** icon in the **Database Navigator** to bring up the **Connect to a database** dialog:

<img src="/images/integrations/sql-clients/dbeaver-add-database.png" alt="Add a new database"/>

- Select **Analytical** and then **ClickHouse**:

- Build the JDBC URL. On the **Main** tab set the Host, Port, Username, Password, and Database:

<img src="/images/integrations/sql-clients/dbeaver-host-port.png" alt="Set the hostname, port, user, password, and database name"/>

- By default the **SSL > Use SSL** property will be unset, if you are connecting to ClickHouse Cloud or a server that requires SSL on the HTTP port, then set **SSL > Use SSL** on:

<img src="/images/integrations/sql-clients/dbeaver-use-ssl.png" alt="Enable SSL if required"/>

- Test the connection:

<img src="/images/integrations/sql-clients/dbeaver-test-connection.png" alt="Test the connection"/>

If DBeaver detects that you do not have the ClickHouse driver installed it will offer to download them for you:

<img src="/images/integrations/sql-clients/dbeaver-download-driver.png" alt="Download the ClickHouse driver"/>

- After downloading the driver **Test** the connection again:

<img src="/images/integrations/sql-clients/dbeaver-test-connection.png" alt="Test the connection"/>

## 4. Query ClickHouse 

Open a query editor and run a query.

- Right click on your connection and choose **SQL Editor > Open SQL Script** to open a query editor:

<img src="/images/integrations/sql-clients/dbeaver-sql-editor.png" alt="Open the SQL editor"/>

- An example query against `system.query_log`:

<img src="/images/integrations/sql-clients/dbeaver-query-log-select.png" alt="A sample query"/>

## Next steps 

See the [DBeaver wiki](https://github.com/dbeaver/dbeaver/wiki) to learn about the capabilities of DBeaver, and the [ClickHouse documentation](https://clickhouse.com/docs) to learn about the capabilities of ClickHouse.
