---
sidebarTitle: 'TABLUM.IO'
slug: /integrations/tablumio
description: 'TABLUM.IO is a data management SaaS that supports ClickHouse out of the box.'
title: 'Connecting TABLUM.IO to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'sql_client'
keywords: ['tablum', 'sql client', 'database tool', 'query tool', 'desktop app']
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

<CommunityMaintainedBadge/>

## Open the TABLUM.IO startup page 

<Note>
  You can install a self-hosted version of TABLUM.IO on your Linux server in docker.
</Note>

## 1. Sign up or sign in to the service 

  First, sign up to TABLUM.IO using your email or use a quick-login via accounts in Google or Facebook.

<img src="/images/integrations/sql-clients/tablum-ch-0.png" alt="TABLUM.IO login page"/>

## 2. Add a ClickHouse connector 

Gather your ClickHouse connection details, navigate to the **Connector** tab, and fill in the host URL, port, username, password, database name, and connector's name. After completing these fields, click on **Test connection** button to validate the details and then click on  **Save connector for me** to make it persistent.

<Tip>
Make sure that you specify the correct **HTTP** port and toggle **SSL** mode according to your connection details.
</Tip>

<Tip>
Typically, the port is 8443 when using TLS or 8123 when not using TLS.
</Tip>

<img src="/images/integrations/sql-clients/tablum-ch-1.png" alt="Adding a ClickHouse connector in TABLUM.IO"/>

## 3. Select the connector 

Navigate to the **Dataset** tab. Select recently created ClickHouse connector in the dropdown. In the right panel, you will see the list of available tables and schemas.

<img src="/images/integrations/sql-clients/tablum-ch-2.png" alt="Selecting the ClickHouse connector in TABLUM.IO"/>

## 4. Input a SQL query and run it 

Type a query in the SQL Console and press **Run Query**. The results will be displayed as a spreadsheet.

<Tip>
Right-click on the column name to open the dropdown menu with sort, filter and other actions.
</Tip>

<img src="/images/integrations/sql-clients/tablum-ch-3.png" alt="Running a SQL query in TABLUM.IO"/>

<Note>
With TABLUM.IO you can
* create and utilise multiple ClickHouse connectors within your TABLUM.IO account,
* run queries on any loaded data regardless of the data source,
* share the results as a new ClickHouse database.
</Note>

## Learn more 

Find more information about TABLUM.IO at https://tablum.io.
