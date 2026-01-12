---
sidebarTitle: 'Retool'
slug: /integrations/retool
keywords: ['clickhouse', 'retool', 'connect', 'integrate', 'ui', 'admin', 'panel', 'dashboard', 'nocode', 'no-code']
description: 'Quickly build web and mobile apps with rich user interfaces, automate complex tasks, and integrate AI—all powered by your data.'
title: 'Connecting Retool to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'data_integration'
---

import {PartnerBadge} from '/snippets/components/PartnerBadge/PartnerBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<PartnerBadge/>

## 1. Gather your connection details 

<GatherYourDetailsHttp />

## 2. Create a ClickHouse resource 

Login to your Retool account and navigate to the _Resources_ tab. Choose "Create New" -> "Resource":

<img src="/images/integrations/tools/data-integration/retool/retool_01.png" alt="Creating a new resource"/>
<br/>

Select "JDBC" from the list of available connectors:

<img src="/images/integrations/tools/data-integration/retool/retool_02.png" alt="Choosing JDBC connector"/>
<br/>

In the setup wizard, make sure you select `com.clickhouse.jdbc.ClickHouseDriver` as the "Driver name":

<img src="/images/integrations/tools/data-integration/retool/retool_03.png" alt="Selecting the right driver"/>
<br/>

Fill in your ClickHouse credentials in the following format: `jdbc:clickhouse://HOST:PORT/DATABASE?user=USERNAME&password=PASSWORD`.
If your instance requires SSL or you are using ClickHouse Cloud, add `&ssl=true` to the connection string, so it looks like `jdbc:clickhouse://HOST:PORT/DATABASE?user=USERNAME&password=PASSWORD&ssl=true`

<img src="/images/integrations/tools/data-integration/retool/retool_04.png" alt="Specifying your credentials"/>
<br/>

After that, test your connection:

<img src="/images/integrations/tools/data-integration/retool/retool_05.png" alt="Testing your connection"/>
<br/>

Now, you should be able to proceed to your app using your ClickHouse resource.
