---
sidebarTitle: 'Rocket BI'
sidebar_position: 131
slug: /integrations/rocketbi
keywords: ['clickhouse', 'RocketBI', 'connect', 'integrate', 'ui']
description: 'RocketBI is a self-service business intelligence platform that helps you quickly analyze data, build drag-n-drop visualizations and collaborate with colleagues right on your web browser.'
title: 'Integrate Rocket BI with ClickHouse'
doc_type: 'guide'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

<CommunityMaintainedBadge/>

In this guide, you will install and build a simple dashboard using Rocket.BI .
This is the dashboard:

<img src="/images/integrations/data-visualization/rocketbi_01.gif" alt="Rocket BI dashboard showing sales metrics with charts and KPIs" />
<br/>

You can checkout [the Dashboard via this link.](https://demo.rocket.bi/dashboard/sales-dashboard-7?token=7eecf750-cbde-4c53-8fa8-8b905fec667e)

## Install 

Start RocketBI with our pre-built docker images.

Get docker-compose.yml and configuration file:

```bash
wget https://raw.githubusercontent.com/datainsider-co/rocket-bi/main/docker/docker-compose.yml
wget https://raw.githubusercontent.com/datainsider-co/rocket-bi/main/docker/.clickhouse.env
```
Edit .clickhouse.env, add clickhouse server information.

Start RocketBI by run command: ``` docker-compose up -d . ```

Open browser, go to ```localhost:5050```, login with this account: ```hello@gmail.com/123456```

To build from source or advanced configuration you could check it here [Rocket.BI Readme](https://github.com/datainsider-co/rocket-bi/blob/main/README.md)

## Let's build the dashboard 

In Dashboard, you will find your reportings, start visualization by clicking **+New**

You can build **unlimited dashboards** & draw **unlimited charts** in a dashboard.

<img src="/images/integrations/data-visualization/rocketbi_02.gif" alt="Animation showing the process of creating a new chart in Rocket BI" />
<br/>

See hi-res tutorial on Youtube: [https://www.youtube.com/watch?v=TMkdMHHfvqY](https://www.youtube.com/watch?v=TMkdMHHfvqY)

### Build the chart controls 

#### Create a metrics control 
In the Tab filter, select metric fields you want to use. Make sure to keep check on aggregation setting.

<img src="/images/integrations/data-visualization/rocketbi_03.png" alt="Rocket BI metrics control configuration panel showing selected fields and aggregation settings" />
<br/>

Rename filters & Save Control to Dashboard

<img src="/images/integrations/data-visualization/rocketbi_04.png" alt="Metrics control with renamed filters ready to save to dashboard" />

#### Create a date type control 
Choose a Date field as Main Date column:

<img src="/images/integrations/data-visualization/rocketbi_05.png" alt="Date field selection interface in Rocket BI showing available date columns" />
<br/>

Add duplicate variants with different lookup ranges. For example, Year, Monthly, Daily date or Day of Week.

<img src="/images/integrations/data-visualization/rocketbi_06.png" alt="Date range configuration showing different time period options like year, month, and day" />
<br/>

Rename filters & Save Control to Dashboard

<img src="/images/integrations/data-visualization/rocketbi_07.png" alt="Date range control with renamed filters ready to save to dashboard" />

### Now, let build the Charts 

#### Pie chart: sales metrics by regions 
Choose Adding new chart, then Select Pie Chart

<img src="/images/integrations/data-visualization/rocketbi_08.png" alt="Chart type selection panel with pie chart option highlighted" />
<br/>

First Drag & Drop the column "Region" from the Dataset to Legend Field

<img src="/images/integrations/data-visualization/rocketbi_09.png" alt="Drag and drop interface showing Region column being added to legend field" />
<br/>

Then, change to Chart Control Tab

<img src="/images/integrations/data-visualization/rocketbi_10.png" alt="Chart control tab interface showing visualization configuration options" />
<br/>

Drag & Drop the Metrics Control into Value Field

<img src="/images/integrations/data-visualization/rocketbi_11.png" alt="Metrics control being added to the value field of the pie chart" />
<br/>

(you can also use Metrics Control as Sorting)

Navigate to Chart Setting for further customization

<img src="/images/integrations/data-visualization/rocketbi_12.png" alt="Chart settings panel showing customization options for the pie chart" />
<br/>

For example, change Data label to Percentage

<img src="/images/integrations/data-visualization/rocketbi_13.png" alt="Data label settings being changed to show percentages on the pie chart" />
<br/>

Save & Add the Chart to Dashboard

<img src="/images/integrations/data-visualization/rocketbi_14.png" alt="Dashboard view showing the newly added pie chart with other controls" />

#### Use date control in a time-series chart 
Let Use a Stacked Column Chart

<img src="/images/integrations/data-visualization/rocketbi_15.png" alt="Stacked column chart creation interface with time-series data" />
<br/>

In Chart Control, use Metrics Control as Y-axis & Date Range as X-axis

<img src="/images/integrations/data-visualization/rocketbi_16.png" alt="Chart control configuration showing metrics on Y-axis and date range on X-axis" />
<br/>

Add Region column in to Breakdown

<img src="/images/integrations/data-visualization/rocketbi_17.png" alt="Region column being added as breakdown dimension in the stacked column chart" />
<br/>

Adding Number Chart as KPIs & glare-up the Dashboard

<img src="/images/integrations/data-visualization/rocketbi_18.png" alt="Complete dashboard with KPI number charts, pie chart, and time-series visualization" />
<br/>

Now, you had successfully build your 1st dashboard with rocket.BI
