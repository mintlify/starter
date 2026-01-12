---
sidebarTitle: 'Draxlr'
sidebar_position: 131
slug: /integrations/draxlr
keywords: ['clickhouse', 'Draxlr', 'connect', 'integrate', 'ui']
description: 'Draxlr is a Business intelligence tool with data visualization and analytics.'
title: 'Connecting Draxlr to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'data_visualization'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

Draxlr offers an intuitive interface for connecting to your ClickHouse database, enabling your team to explore, visualize, and publish insights within minutes. This guide will walk you through the steps to establish a successful connection.

## 1. Get your ClickHouse credentials 
<GatherYourDetailsHttp />

## 2.  Connect Draxlr to ClickHouse 

1. Click on the **Connect a Database** button on the navbar.

2. Select **ClickHouse** from the list of available databases and click next.

3. Choose one of the hosting services and click next.

4. Use any name in the **Connection Name** field.

5. Add the connection details in the form.

  <img src="/images/integrations/data-visualization/draxlr_01.png" alt="Draxlr connection form showing ClickHouse database configuration options" />

6. Click on the **Next** button and wait for the connection to be established. You will see the tables page if the connection is successful.

## 4. Explore your data 

1. Click on one of the tables in the list.

2. It will take you to the explore page to see the data in the table.

3. You can start adding the filters, make joins and add sort to your data.

  <img src="/images/integrations/data-visualization/draxlr_02.png" alt="Draxlr data exploration interface showing filters and sorting options" />

4. You can also use the **Graph** button and select the graph type to visualize the data.

  <img src="/images/integrations/data-visualization/draxlr_05.png" alt="Draxlr graph visualization options for ClickHouse data" />

## 4. Using SQL queries 

1. Click on the Explore button on the navbar.

2. Click the **Raw Query** button and enter your query in the text area.

  <img src="/images/integrations/data-visualization/draxlr_03.png" alt="Draxlr SQL query interface for ClickHouse" />

3. Click on the **Execute Query** button to see the results.

## 4. Saving you query 

1. After executing your query, click on the **Save Query** button.

  <img src="/images/integrations/data-visualization/draxlr_04.png" alt="Draxlr save query dialog with dashboard options" />

2. You can name to query in **Query Name** text box and select a folder to categories it.

3. You can also use **Add to dashboard** option to add the result to dashboard.

4. Click on the **Save** button to save the query.

## 5. Building dashboards 

1. Click on the **Dashboards** button on the navbar.

  <img src="/images/integrations/data-visualization/draxlr_06.png" alt="Draxlr dashboard management interface" />

2. You can add a new dashboard by clicking on the **Add +** button on the left sidebar.

3. To add a new widget, click on the **Add** button on the top right corner.

4. You can select a query from the list of saved queries and choose the visualization type then click on the **Add Dashboard Item** button.

## Learn more 
To know more about Draxlr you can visit [Draxlr documentation](https://draxlr.notion.site/draxlr/Draxlr-Docs-d228b23383f64d00a70836ff9643a928) site.
