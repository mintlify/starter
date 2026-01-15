---
sidebarTitle: 'Looker Studio'
slug: /integrations/lookerstudio
keywords: ['clickhouse', 'looker', 'studio', 'connect', 'mysql', 'integrate', 'ui']
description: 'Looker Studio, formerly Google Data Studio, is an online tool for converting data into customizable informative reports and dashboards.'
title: 'Looker Studio'
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'data_visualization'
---

import {PartnerBadge} from '/snippets/components/PartnerBadge/PartnerBadge.jsx'

import ClickhouseMysqlCloudSetup from '/snippets/_clickhouse_mysql_cloud_setup.mdx';
import ClickhouseMysqlOnPremiseSetup from '/snippets/_clickhouse_mysql_on_premise_setup.mdx';

<PartnerBadge/>

Looker Studio can connect to ClickHouse via the MySQL interface using the official Google MySQL data source.

## ClickHouse Cloud setup 

<ClickhouseMysqlCloudSetup />

## On-premise ClickHouse server setup 

<ClickhouseMysqlOnPremiseSetup />

## Connecting Looker Studio to ClickHouse 

First, login to https://lookerstudio.google.com using your Google account and create a new Data Source:

<img src="/images/integrations/data-visualization/looker_studio_01.png" alt="Creating a new data source in Looker Studio interface" />

Search for the official MySQL connector provided by Google (named just **MySQL**):

<img src="/images/integrations/data-visualization/looker_studio_02.png" alt="MySQL connector search in Looker Studio connectors list" />

Specify your connection details. Please note that MySQL interface port is 9004 by default,
and it might be different depending on your server configuration.

<img src="/images/integrations/data-visualization/looker_studio_03.png" alt="Specifying the ClickHouse MySQL connection details in Looker Studio" />

Now, you have two options on how to fetch the data from ClickHouse. First, you could use the Table Browser feature:

<img src="/images/integrations/data-visualization/looker_studio_04.png" alt="Using the Table Browser to select ClickHouse tables in Looker Studio" />

Alternatively, you could specify a custom query to fetch your data:

<img src="/images/integrations/data-visualization/looker_studio_05.png" alt="Using a custom SQL query to fetch data from ClickHouse in Looker Studio" />

Finally, you should be able to see the introspected table structure and adjust the data types if necessary.

<img src="/images/integrations/data-visualization/looker_studio_06.png" alt="Viewing the introspected ClickHouse table structure in Looker Studio" />

Now you can proceed with exploring your data or creating a new report!

## Using Looker Studio with ClickHouse Cloud 

When using ClickHouse Cloud, you need to enable MySQL interface first. You can do that in connection dialog, "MySQL" tab.

<img src="/images/integrations/data-visualization/looker_studio_enable_mysql.png" alt="Enabling MySQL interface in ClickHouse Cloud settings" />

In the Looker Studio UI, choose the "Enable SSL" option. ClickHouse Cloud's SSL certificate is signed by [Let's Encrypt](https://letsencrypt.org/certificates/). You can download this root cert [here](https://letsencrypt.org/certs/isrgrootx1.pem).

<img src="/images/integrations/data-visualization/looker_studio_mysql_cloud.png" alt="Looker Studio connection configuration with ClickHouse Cloud SSL settings" />

The rest of the steps are the same as listed above in the previous section.
