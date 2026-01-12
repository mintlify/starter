---
sidebarTitle: 'Explo'
sidebar_position: 131
slug: /integrations/explo
keywords: ['clickhouse', 'Explo', 'connect', 'integrate', 'ui']
description: 'Explo is an easy-to-use, open source UI tool for asking questions about your data.'
title: 'Connecting Explo to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'data_visualization'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

Customer-facing analytics for any platform. Designed for beautiful visualization. Engineered for simplicity.

## Goal 

In this guide you will connect your data from ClickHouse to Explo and visualize the results.  The chart will look like this:
<img src="/images/integrations/data-visualization/explo_15.png" alt="Explo Dashboard"/>

<p/>

<Tip title="Add some data">
If you do not have a dataset to work with you can add one of the examples.  This guide uses the [UK Price Paid](/getting-started/example-datasets/uk-price-paid.md) dataset, so you might choose that one.  There are several others to look at in the same documentation category.
</Tip>

## 1. Gather your connection details 
<GatherYourDetailsHttp />

## 2.  Connect Explo to ClickHouse 

1. Sign up for an Explo account.

2. Click on the Explo **data** tab on the left hand sidebar.

<img src="/images/integrations/data-visualization/explo_01.png" alt="Data Tab"/>

3. Click **Connect Data Source** in the upper right hand side.

<img src="/images/integrations/data-visualization/explo_02.png" alt="Connect Data Source"/>

4. Fill out the information on the **Getting Started** page

<img src="/images/integrations/data-visualization/explo_03.png" alt="Getting Started"/>

5. Select **Clickhouse**

<img src="/images/integrations/data-visualization/explo_04.png" alt="Clickhouse"/>

6. Enter your **Clickhouse Credentials**.

<img src="/images/integrations/data-visualization/explo_05.png" alt="Credentials"/>

7. Configure **Security**

<img src="/images/integrations/data-visualization/explo_06.png" alt="Security"/>

8. Within Clickhouse, **Whitelist the Explo IPs**.
`
54.211.43.19, 52.55.98.121, 3.214.169.94, and 54.156.141.148
`

## 3. Create a Dashboard 

1. Navigate to **Dashboard** tab on the left side nav bar.

<img src="/images/integrations/data-visualization/explo_07.png" alt="Dashboard"/>

2. Click **Create Dashboard** in the upper right corner and name your dashboard. You've now created a dashboard!

<img src="/images/integrations/data-visualization/explo_08.png" alt="Create Dashboard"/>

3. You should now see a screen that is similar to this:

<img src="/images/integrations/data-visualization/explo_09.png" alt="Explo Dashboard"/>

## 4. Run a SQL query 

1. Get your table name from the right hand sidebar under your schema title. You should then put the following command into your dataset editor:
`
SELECT * FROM YOUR_TABLE_NAME
LIMIT 100
`

<img src="/images/integrations/data-visualization/explo_10.png" alt="Explo Dashboard"/>

2. Now click run and go to the preview tab to see your data.

<img src="/images/integrations/data-visualization/explo_11.png" alt="Explo Dashboard"/>

## 5. Build a Chart 

1. From the left hand side, drag the bar chart icon onto the screen.

<img src="/images/integrations/data-visualization/explo_16.png" alt="Explo Dashboard"/>

2. Select the dataset. You should now see a screen like the following:

<img src="/images/integrations/data-visualization/explo_12.png" alt="Explo Dashboard"/>

3. Fill out the **county** in the X Axis and **Price** in the Y Axis Section like so:

<img src="/images/integrations/data-visualization/explo_13.png" alt="Explo Dashboard"/>

4. Now, change the aggregation to **AVG**.

<img src="/images/integrations/data-visualization/explo_14.png" alt="Explo Dashboard"/>

5. We now have average price of homes broken down by price!

<img src="/images/integrations/data-visualization/explo_15.png" alt="Explo Dashboard"/>

## Learn more 

Find more information about Explo and how to build dashboards by <a href="https://docs.explo.co/" target="_blank">visiting the Explo documentation</a>.
