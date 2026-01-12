---
sidebarTitle: 'Astrato'
sidebar_position: 131
slug: /integrations/astrato
keywords: ['clickhouse', 'Power BI', 'connect', 'integrate', 'ui', 'data apps', 'data viz', 'embedded analytics', 'Astrato']
description: 'Astrato brings true Self-Service BI to Enterprises & Data Businesses by putting analytics in the hands of every user, enabling them to build their own dashboards, reports and data apps, enabling the answering of data questions without IT help. Astrato accelerates adoption, speeds up decision-making, and unifies analytics, embedded analytics, data input, and data apps in one platform. Astrato unites action and analytics in one,  introduce live write-back, interact with ML models, accelerate your analytics with AI – go beyond dashboarding, thanks to pushdown SQL support in Astrato.'
title: 'Connecting Astrato to ClickHouse'
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'data_visualization'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

Astrato uses Pushdown SQL to query ClickHouse Cloud or on-premise deployments directly. This means you can access all of the data you need, powered by the industry-leading performance of ClickHouse.

## Connection data required 

When setting up your data connection, you'll need to know:

- Data connection: Hostname, Port

- Database Credentials: Username, Password

<GatherYourDetailsHttp />

## Creating the data connection to ClickHouse 

- Select **Data** in the sidebar, and select the **Data Connection** tab
(or, navigate to this link: https://app.astrato.io/data/sources)
​
- Click on the **New Data Connection** button in the top right side of the screen.

<img src="/images/integrations/data-visualization/astrato_1_dataconnection.png" alt="Astrato Data Connection" />

- Select **ClickHouse**.

<img src="/images/integrations/data-visualization/astrato_2a_clickhouse_connection.png" alt="Astrato ClickHouse Data Connection" />

- Complete the required fields in the connection dialogue box

<img src="/images/integrations/data-visualization/astrato_2b_clickhouse_connection.png" alt="Astrato connect to ClickHouse required fields" />

- Click **Test Connection**. If the connection is successful, give the data connection a **name** and click **Next.**

- Set the **user access** to the data connection and click **connect.**

<img src="/images/integrations/data-visualization/astrato_3_user_access.png" alt="Astrato connect to ClickHouse User Access" />

-   A connection is created and a dataview is created.

<Note>
if a duplicate is created, a timestamp is added to the data source name.
</Note>

## Creating a semantic model / data view 

In our Data View editor, you will see all of your Tables and Schemas in ClickHouse, select some to get started.

<img src="/images/integrations/data-visualization/astrato_4a_clickhouse_data_view.png" alt="Astrato connect to ClickHouse User Access" />

Now that you have your data selected, go to define the **data view**. Click define on the top right of the webpage.

In here, you are able to join data, as well as, **create governed dimensions and measures** - ideal for driving consistency in business logic across various teams.

<img src="/images/integrations/data-visualization/astrato_4b_clickhouse_data_view_joins.png" alt="Astrato connect to ClickHouse User Access" />

**Astrato intelligently suggests joins** using your meta data, including leveraging the keys in ClickHouse. Our suggested joins make it easy for you to gets started, working from your well-governed ClickHouse data, without reinventing the wheel. We also show you **join quality** so that you have the option to review all suggestions, in detail, from Astrato.

<img src="/images/integrations/data-visualization/astrato_4c_clickhouse_completed_data_view.png" alt="Astrato connect to ClickHouse User Access" />

## Creating a dashboard 

In just a few steps, you can build your first chart in Astrato.
1. Open visuals panel
2. Select a visual (lets start with Column Bar Chart)
3. Add dimension(s)
4. Add measure(s)

<img src="/images/integrations/data-visualization/astrato_5a_clickhouse_build_chart.png" alt="Astrato connect to ClickHouse User Access" />

### View generated SQL supporting each visualization 

Transparency and accuracy are at the heart of Astrato. We ensure that every query generated is visible, letting you keep full control. All compute happens directly in ClickHouse, taking advantage of its speed while maintaining robust security and governance.

<img src="/images/integrations/data-visualization/astrato_5b_clickhouse_view_sql.png" alt="Astrato connect to ClickHouse User Access" />

### Example completed dashboard 

A beautiful complete dashboard or data app isn't far away now. To see more of what we've built, head to our demo gallery on our website. https://astrato.io/gallery

<img src="/images/integrations/data-visualization/astrato_5c_clickhouse_complete_dashboard.png" alt="Astrato connect to ClickHouse User Access" />
